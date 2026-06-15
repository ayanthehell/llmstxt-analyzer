const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// admin is already initialized in index.js
const db = admin.firestore();
const CMS_FILE_PATH = path.join(__dirname, '../data/cms.json');

// Get CMS data
router.get('/', async (req, res) => {
  try {
    const doc = await db.collection('cms').doc('global').get();
    if (!doc.exists) {
      if (fs.existsSync(CMS_FILE_PATH)) {
        const data = fs.readFileSync(CMS_FILE_PATH, 'utf8');
        return res.json(JSON.parse(data));
      }
      return res.json({});
    }
    return res.json(doc.data());
  } catch (err) {
    console.error('Failed to read CMS data from Firestore', err);
    return res.status(500).json({ error: 'Failed to fetch CMS content' });
  }
});

// Update CMS data
router.post('/', async (req, res) => {
  const { data, password } = req.body;

  // Use hardcoded masked password
  const adminPassword = Buffer.from('YWRtaW4xMjM=', 'base64').toString('ascii');
  
  if (password !== adminPassword) {
    return res.status(401).json({ error: 'Unauthorized: Invalid Admin Password' });
  }

  if (!data) {
    return res.status(400).json({ error: 'No data provided' });
  }

  try {
    await db.collection('cms').doc('global').set(data);
    return res.json({ success: true });
  } catch (err) {
    console.error('Failed to write CMS data to Firestore', err);
    return res.status(500).json({ error: 'Failed to save CMS content' });
  }
});

module.exports = router;
