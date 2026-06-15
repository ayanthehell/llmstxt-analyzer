require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const analyzeRoute = require('./routes/analyze');
const chatRoute = require('./routes/chat');
const simulateRoute = require('./routes/simulate');
const scansRoute = require('./routes/scans');
const cmsRoute = require('./routes/cms');

const app = express();
app.set('trust proxy', true);
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/analyze', analyzeRoute);
app.use('/api/chat', chatRoute);
app.use('/api/simulate', simulateRoute);
app.use('/api/scans', scansRoute);
app.use('/api/cms', cmsRoute);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve llms.txt and llms-full.txt at root
const LLMS_DIR = path.join(__dirname, '../client/public');

app.get('/llms.txt', (req, res) => {
  const filePath = path.join(LLMS_DIR, 'llms.txt');
  if (fs.existsSync(filePath)) {
    res.type('text/plain').send(fs.readFileSync(filePath, 'utf8'));
  } else {
    res.status(404).type('text/plain').send('llms.txt not found');
  }
});

app.get('/llms-full.txt', (req, res) => {
  const filePath = path.join(LLMS_DIR, 'llms-full.txt');
  if (fs.existsSync(filePath)) {
    res.type('text/plain').send(fs.readFileSync(filePath, 'utf8'));
  } else {
    res.status(404).type('text/plain').send('llms-full.txt not found');
  }
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel Serverless Functions
module.exports = app;
