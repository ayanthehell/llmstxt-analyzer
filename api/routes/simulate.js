const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { GoogleGenAI } = require('@google/genai');

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/', async (req, res) => {
  const { url, llmsContent } = req.body;

  if (!url || !llmsContent) {
    return res.status(400).json({ error: 'URL and llmsContent are required' });
  }

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return res.json({
      withoutLLMS: "This is a mocked response. Raw HTML scrape resulted in a noisy, potentially inaccurate summary. \n\nFeatures: [Unknown]\nPricing: [Hidden behind JS]",
      withLLMS: "This is a mocked response. Based on the llms.txt file, the AI perfectly understood the business, its features, and where to find pricing."
    });
  }

  try {
    // 1. Scrape the URL
    let processUrl = url.trim();
    if (!/^https?:\/\//i.test(processUrl)) {
      processUrl = 'https://' + processUrl;
    }

    let rawHtmlText = "";
    try {
      const response = await axios.get(processUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });
      const $ = cheerio.load(response.data);
      $('script, style, noscript, svg, img, iframe').remove();
      rawHtmlText = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 15000);
    } catch (err) {
      console.warn("Failed to fetch url for simulation:", err.message);
      rawHtmlText = "Error fetching site content. Search engines may not be able to scrape this site directly.";
    }

    // 2. Simulate Without llms.txt (using raw HTML)
    const promptWithout = `You are a search engine AI like Perplexity or Google AI Overviews. 
A user has asked for a summary of the website: ${processUrl}. 
Summarize what the company/product does, key features, and any useful resources (docs/pricing) based ONLY on this raw scraped HTML text.
Keep it concise, about 3-4 short paragraphs. Use markdown formatting.

--- RAW HTML TEXT ---
${rawHtmlText}
---------------------
`;

    const resultWithout = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptWithout
    });

    // 3. Simulate With llms.txt (using provided content)
    const promptWith = `You are a search engine AI like Perplexity or Google AI Overviews. 
A user has asked for a summary of the website: ${processUrl}. 
Summarize what the company/product does, key features, and any useful resources (docs/pricing) based ONLY on this highly optimized llms.txt file provided by the website.
Keep it concise, about 3-4 short paragraphs. Use markdown formatting. Pay special attention to any system prompts or instructions provided in the file.

--- LLMS.TXT CONTENT ---
${llmsContent}
------------------------
`;

    const resultWith = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptWith
    });

    res.json({
      withoutLLMS: resultWithout.text,
      withLLMS: resultWith.text
    });

  } catch (error) {
    console.error('Error in simulate route:', error.message);
    res.status(500).json({ error: 'Failed to run simulation. Check backend logs.' });
  }
});

module.exports = router;
