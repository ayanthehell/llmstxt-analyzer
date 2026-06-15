const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// admin is already initialized in index.js
const db = admin.firestore();

router.get('/', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
  const userIp = ip.split(',')[0].trim();

  try {
    const doc = await db.collection('recent_scans').doc(userIp).get();
    if (doc.exists) {
      return res.json({ scans: doc.data().scans || [] });
    }
    return res.json({ scans: [] });
  } catch (err) {
    console.error('Error fetching recent scans:', err);
    return res.json({ scans: [] });
  }
});

router.post('/', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
  const userIp = ip.split(',')[0].trim();

  try {
    const docRef = db.collection('recent_scans').doc(userIp);
    const doc = await docRef.get();
    
    let userScans = [];
    if (doc.exists) {
      userScans = doc.data().scans || [];
    }

    // Add the new url to the front of the array, remove duplicates, limit to 5
    userScans = [url, ...userScans.filter(u => u !== url)].slice(0, 5);
    
    await docRef.set({ scans: userScans });

    return res.json({ scans: userScans });
  } catch (err) {
    console.error('Error saving recent scan:', err);
    return res.status(500).json({ error: 'Failed to save recent scan' });
  }
});

module.exports = router;
