const express = require('express');
const router = express.Router();

// In-memory store mapping IP addresses to an array of URLs
// For a production app, use Redis or a Database.
const recentScansCache = {};

router.get('/', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
  const userIp = ip.split(',')[0].trim(); // Handle multiple IPs in x-forwarded-for

  const userScans = recentScansCache[userIp] || [];
  return res.json({ scans: userScans });
});

router.post('/', (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
  const userIp = ip.split(',')[0].trim();

  if (!recentScansCache[userIp]) {
    // Basic memory management
    if (Object.keys(recentScansCache).length > 1000) {
      const keys = Object.keys(recentScansCache);
      delete recentScansCache[keys[0]]; // Remove oldest roughly
    }
    recentScansCache[userIp] = [];
  }

  // Add the new url to the front of the array, remove duplicates, limit to 5
  let userScans = recentScansCache[userIp];
  userScans = [url, ...userScans.filter(u => u !== url)].slice(0, 5);
  
  recentScansCache[userIp] = userScans;

  return res.json({ scans: userScans });
});

module.exports = router;
