const express = require('express');
const axios = require('axios');
const router = express.Router();
const parseLLMsTxt = require('../lib/parser');
const scoreLLMsTxt = require('../lib/scorer');
const generateGaps = require('../lib/gapAnalyzer');
const checkLinks = require('../lib/deepScanner');

router.post('/', async (req, res) => {
  const { url, rawText: providedRawText, deepScan } = req.body;
  
  // If we only have rawText (from the live editor), we don't need to fetch
  if (!url && !providedRawText) {
    return res.status(400).json({ error: 'URL or rawText is required' });
  }

  let targetUrl = url;
  let urlObj = null;
  let llmsTxtUrl = 'Live Editor';
  let host = 'localhost';

  if (targetUrl) {
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }
    try {
      urlObj = new URL(targetUrl);
      llmsTxtUrl = `${urlObj.protocol}//${urlObj.host}/llms.txt`;
      host = urlObj.host;
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL provided.' });
    }
  }

  try {
    let rawText = providedRawText;
    
    if (!rawText && urlObj) {
      const timeoutMs = deepScan ? 15000 : 5000;
      const response = await axios.get(llmsTxtUrl, {
        timeout: timeoutMs,
        headers: {
          'User-Agent': 'LLMSTXTAnalyzer/1.0',
        },
      });

      rawText = response.data;
      if (typeof rawText !== 'string') {
        return res.status(400).json({ error: 'Invalid llms.txt format returned by server.' });
      }
    }

    const parsedData = parseLLMsTxt(rawText);
    
    let linkStatuses = {};
    if (deepScan) {
      linkStatuses = await checkLinks(parsedData);
    }
    
    // We pass linkStatuses to the scorer to penalize 404 links if deepScan was enabled
    const scores = scoreLLMsTxt(parsedData, rawText, host, linkStatuses);
    const gaps = generateGaps(scores, parsedData, linkStatuses);

    return res.json({
      url: llmsTxtUrl,
      rawText,
      parsedData,
      scores,
      gaps,
      deepScanCompleted: deepScan || false
    });
  } catch (error) {
    console.error('Error fetching llms.txt:', error.message);
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'Timeout fetching llms.txt. The server took too long to respond.' });
    }
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'llms.txt not found on this website.' });
    }
    return res.status(500).json({ error: 'Failed to fetch or analyze llms.txt.', details: error.message });
  }
});

module.exports = router;
