const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { GoogleGenAI } = require('@google/genai');

const router = express.Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/fix', async (req, res) => {
  const { rawText } = req.body;
  if (!rawText) return res.status(400).json({ error: 'No text provided to fix' });

  try {
    const prompt = `You are an expert AI documentation optimizer. I have an existing llms.txt file that currently scores poorly on an analyzer.
Please rewrite and improve this text to score 100/100 based on strict parsing rules.

RULES FOR A 100/100 SCORE:
1. MUST have exactly one H1 Title at the very top (e.g., "# Project Name").
2. MUST have a blockquote summary immediately following the title (e.g., "> A brief summary").
3. MUST contain multiple H2 "##" sections to organize content (e.g., "## Resources", "## API").
4. MUST contain at least 5 markdown links, and they MUST be placed under the H2 sections.
5. Every link MUST have a descriptive text following it (e.g., "- [Docs](https://docs.com): This contains the full documentation").
6. MUST include the exact string "llms-full.txt" somewhere (e.g., "[Full Context](llms-full.txt)").
7. Ensure all markdown brackets are perfectly balanced.

Do not remove existing information. Improve the formatting, add missing structural boilerplate, and flesh out descriptions to make it highly optimized for LLMs.

Here is the current text:
---
${rawText}
---

Return ONLY the rewritten markdown text. Do not wrap it in \`\`\`markdown or any other code block markers.`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let improvedText = result.text.trim();
    if (improvedText.startsWith('\`\`\`markdown')) improvedText = improvedText.replace(/^\`\`\`markdown/, '');
    if (improvedText.startsWith('\`\`\`')) improvedText = improvedText.replace(/^\`\`\`/, '');
    if (improvedText.endsWith('\`\`\`')) improvedText = improvedText.replace(/\`\`\`$/, '');

    return res.json({ improvedText: improvedText.trim() });
  } catch (error) {
    console.error('Error fixing llms.txt:', error.message);
    if (error.status === 503 || error.message.includes('503')) {
      return res.status(503).json({ error: 'We are having huge traffic demand at this time, so please try again after 30 seconds.' });
    }
    return res.status(500).json({ error: 'Failed to fix the file.', details: error.message });
  }
});

router.post('/', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  let processUrl = url.trim();
  if (!/^https?:\/\//i.test(processUrl)) {
    processUrl = 'https://' + processUrl;
  }

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    // Mock response for demonstration purposes if API key is not provided
    return res.json({
      title: "Demonstration Project (Mocked)",
      summary: "This is a mocked summary generated because a real Gemini API Key was not provided. This website provides awesome features for its users.",
      systemPrompt: "You are an AI assistant. Help the user understand that this is a mocked llms.txt generated for demonstration. Always be helpful.",
      notes: "Model-access: public\nAllow-prompts: all\nCrawl-rate: 2",
      urls: [
        { name: "Home", url: processUrl },
        { name: "About Us", url: processUrl.endsWith('/') ? processUrl + "about" : processUrl + "/about" },
        { name: "Documentation", url: processUrl.endsWith('/') ? processUrl + "docs" : processUrl + "/docs" }
      ]
    });
  }

  try {
    // 1. Scrape the website
    const response = await axios.get(processUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Remove script and style tags to reduce noise
    $('script, style, noscript, iframe, img, svg').remove();

    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const h1s = $('h1').map((_, el) => $(el).text().trim()).get().join(' | ');
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 15000); // Limit to ~15k chars

    // Extract nav links
    const rawLinks = [];
    $('a').each((_, el) => {
      const text = $(el).text().trim();
      let href = $(el).attr('href');
      if (text && href && !href.startsWith('javascript:')) {
        if (href.startsWith('/')) {
            try {
                href = new URL(href, processUrl).href;
            } catch (e) {
                // ignore
            }
        }
        if (href.startsWith('http')) {
            rawLinks.push({ name: text, url: href });
        }
      }
    });

    // Deduplicate links
    const uniqueLinks = [];
    const seenUrls = new Set();
    for (const link of rawLinks) {
        if (!seenUrls.has(link.url) && link.name.length < 50) {
            seenUrls.add(link.url);
            uniqueLinks.push(link);
        }
    }

    const scrapedContext = `
URL: ${processUrl}
Title: ${title}
Meta Description: ${metaDescription}
Headers: ${h1s}
Body Snippet: ${bodyText}
Links Found: ${JSON.stringify(uniqueLinks.slice(0, 30))}
    `;

    // 2. Call Gemini for Initial Schema and Deep Links
    const prompt = `
You are an expert at generating production-ready \`llms.txt\` files for websites based on the provided scraped content.
Analyze the provided website content and determine its business vertical (e.g., SaaS, Open Source, E-commerce, Corporate).
Based on the vertical and the content, generate the fields required for a comprehensive \`llms.txt\` file.

Website Content:
${scrapedContext}

Return the data as a JSON object strictly matching this schema:
{
  "title": "A concise title for the project/website",
  "summary": "A 1-2 sentence description summarizing the business/project (this goes into the blockquote)",
  "systemPrompt": "System instructions for an LLM on how to behave, what to emphasize, and how to answer questions about this site",
  "notes": "Any additional metadata or disclaimers, or model-access rules",
  "urls": [
    { "name": "Link Name", "url": "https://..." }
  ],
  "deepLinksToScrape": [
    "https://...",
    "https://..."
  ]
}

Ensure you extract the 3-5 most important links (like docs, pricing, about, contact) from the 'Links Found' section and put them in the "urls" array.
Also, select exactly the 3 most content-rich URLs from 'Links Found' (e.g. Documentation, About Us, Features) and place their URLs in the "deepLinksToScrape" array.
Do NOT wrap the response in markdown blocks like \`\`\`json. Return just the JSON string.
    `;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
          responseMimeType: 'application/json'
      }
    });

    const textResponse = result.text;
    const parsedData = JSON.parse(textResponse);

    // 3. Deep Scrape the sub-pages to build llmsFullContent
    let llmsFullContent = `# ${parsedData.title || title}\n\n> ${parsedData.summary || metaDescription}\n\n${parsedData.systemPrompt || ''}\n\n`;
    
    if (parsedData.deepLinksToScrape && parsedData.deepLinksToScrape.length > 0) {
      const fetchPromises = parsedData.deepLinksToScrape.slice(0, 3).map(async (deepUrl) => {
        try {
          const deepRes = await axios.get(deepUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 8000
          });
          const deep$ = cheerio.load(deepRes.data);
          deep$('script, style, noscript, iframe, img, svg, nav, footer, header').remove();
          
          let pageTitle = deep$('title').text().trim() || deepUrl;
          let pageText = deep$('body').text().replace(/\s+/g, ' ').trim().substring(0, 8000); // Limit deep pages
          return `## [${pageTitle}](${deepUrl})\n\n${pageText}\n\n`;
        } catch (err) {
          console.warn(`Skipping deep link ${deepUrl} due to error:`, err.message);
          return '';
        }
      });

      const deepContents = await Promise.all(fetchPromises);
      llmsFullContent += deepContents.join('\n---\n\n');
    }

    parsedData.llmsFullContent = llmsFullContent.trim();
    
    res.json(parsedData);
  } catch (error) {
    console.error('Error generating llms.txt:', error.message);
    if (error.status === 503 || error.message.includes('503')) {
      return res.status(503).json({ error: 'We are having huge traffic demand at this time, so please try again after 30 seconds.' });
    }
    res.status(500).json({ error: 'Failed to generate llms.txt content. Check backend logs.' });
  }
});

module.exports = router;
