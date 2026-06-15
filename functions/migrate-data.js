const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

admin.initializeApp({
  projectId: 'llmstxt-2'
});

const db = admin.firestore();

async function migrate() {
  console.log('Starting full CMS migration...');
  try {
    const dataPath = path.join(__dirname, 'data/cms.json');
    if (!fs.existsSync(dataPath)) {
      console.log('No cms.json found. Nothing to migrate.');
      return;
    }

    const fileContent = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(fileContent);

    // Save the entire JSON object into a single document 'global' inside the 'cms' collection
    await db.collection('cms').doc('global').set(data);

    console.log('Migration completed successfully! Full CMS data saved to Firestore.');
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

migrate();
