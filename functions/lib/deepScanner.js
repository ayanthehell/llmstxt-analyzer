const axios = require('axios');

async function checkLinks(parsedData) {
  const allLinks = parsedData.sections.flatMap(s => s.links.map(l => l.url));
  
  // We only check http/https URLs to avoid trying to request absolute paths without host context
  const validUrls = allLinks.filter(url => url.startsWith('http'));
  
  const results = {};
  
  // Run checks in parallel
  await Promise.all(validUrls.map(async (url) => {
    try {
      // Use HEAD request to be faster and download less data
      await axios.head(url, { timeout: 3000 });
      results[url] = true;
    } catch (error) {
      // Sometimes servers don't allow HEAD, fallback to GET if HEAD fails
      if (error.response && error.response.status === 405) {
        try {
          await axios.get(url, { timeout: 3000 });
          results[url] = true;
        } catch {
          results[url] = false;
        }
      } else {
        results[url] = false;
      }
    }
  }));

  return results;
}

module.exports = checkLinks;
