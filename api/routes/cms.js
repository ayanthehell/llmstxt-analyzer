const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const CMS_FILE_PATH = path.join(__dirname, '../data/cms.json');

// Get CMS data
router.get('/', (req, res) => {
  try {
    if (!fs.existsSync(CMS_FILE_PATH)) {
      return res.json({});
    }
    const data = fs.readFileSync(CMS_FILE_PATH, 'utf8');
    return res.json(JSON.parse(data));
  } catch (err) {
    console.error('Failed to read CMS data', err);
    return res.status(500).json({ error: 'Failed to fetch CMS content' });
  }
});

// Update CMS data
router.post('/', (req, res) => {
  const { data, password } = req.body;

  // Simple hardcoded password protection for admin dashboard
  // Use ADMIN_PASSWORD from .env
  const adminPassword = process.env.ADMIN_PASSWORD || 'secret';
  
  if (password !== adminPassword) {
    return res.status(401).json({ error: 'Unauthorized: Invalid Admin Password' });
  }

  if (!data) {
    return res.status(400).json({ error: 'No data provided' });
  }

  try {
    fs.writeFileSync(CMS_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
    return res.json({ success: true });
  } catch (err) {
    console.error('Failed to write CMS data', err);
    return res.status(500).json({ error: 'Failed to save CMS content' });
  }
});

module.exports = router;
