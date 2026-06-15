function scoreLLMsTxt(parsedData, rawText, host, linkStatuses = {}) {
  let scores = {
    completeness: 0,
    structure: 0,
    linkCoverage: 0,
    descriptionRichness: 0,
    llmOptimization: 0,
    bestPractices: 0,
    overall: 0
  };

  // 1. Completeness (Out of 100)
  let completenessScore = 0;
  if (parsedData.title) completenessScore += 25;
  if (parsedData.summary) completenessScore += 25;
  if (parsedData.sections.length >= 2) completenessScore += 25;
  
  const totalLinks = parsedData.sections.reduce((acc, sec) => acc + sec.links.length, 0);
  if (totalLinks >= 3) completenessScore += 25;
  scores.completeness = completenessScore;

  // 2. Structure Quality (Out of 100)
  let structureScore = 100;
  // Penalty for multiple H1s
  const h1Count = (rawText.match(/^# /gm) || []).length;
  if (h1Count === 0) structureScore -= 20;
  if (h1Count > 1) structureScore -= 20;
  
  // Penalty for duplicate sections
  const sectionNames = parsedData.sections.map(s => s.name.toLowerCase());
  const uniqueSections = new Set(sectionNames);
  if (uniqueSections.size < sectionNames.length) structureScore -= 30;

  // Check ordering: H1 should be before H2s.
  const firstH1Idx = rawText.indexOf('# ');
  const firstH2Idx = rawText.indexOf('## ');
  if (firstH2Idx !== -1 && firstH1Idx > firstH2Idx) structureScore -= 20;
  
  scores.structure = Math.max(0, structureScore);

  // 3. Link Coverage (Out of 100)
  let linkScore = 0;
  if (totalLinks > 0) linkScore += 30;
  if (totalLinks >= 5) linkScore += 20;

  const allUrls = parsedData.sections.flatMap(s => s.links.map(l => l.url.toLowerCase()));
  const keyPages = ['doc', 'api', 'about', 'pricing', 'blog'];
  let keyPageMatches = 0;
  allUrls.forEach(url => {
    keyPages.forEach(keyword => {
      if (url.includes(keyword)) keyPageMatches++;
    });
  });
  linkScore += Math.min(50, keyPageMatches * 10);
  scores.linkCoverage = linkScore;

  // 4. Description Richness (Out of 100)
  let descScore = 0;
  const linksWithDescriptions = parsedData.sections.reduce((acc, sec) => {
    return acc + sec.links.filter(l => l.description.length > 5 || l.label.length > 10).length;
  }, 0);
  
  const linkDescRatio = totalLinks > 0 ? linksWithDescriptions / totalLinks : 0;
  descScore += Math.round(linkDescRatio * 50);

  const sectionsWithDesc = parsedData.sections.filter(s => s.description.length > 10).length;
  const sectionDescRatio = parsedData.sections.length > 0 ? sectionsWithDesc / parsedData.sections.length : 0;
  descScore += Math.round(sectionDescRatio * 50);
  
  scores.descriptionRichness = descScore;

  // 5. LLM Optimization (Out of 100)
  let llmScore = 100;
  if (!rawText.includes('llms-full.txt')) llmScore -= 50;
  
  // Broken markdown check (unmatched brackets/parentheses)
  const openBracket = (rawText.match(/\[/g) || []).length;
  const closeBracket = (rawText.match(/\]/g) || []).length;
  if (openBracket !== closeBracket) llmScore -= 25;
  
  scores.llmOptimization = Math.max(0, llmScore);

  // 6. Best Practices (Out of 100)
  let bpScore = 100;
  // Canonical URLs (should start with http/https or /)
  const badUrls = allUrls.filter(url => !url.startsWith('http') && !url.startsWith('/'));
  if (badUrls.length > 0) bpScore -= 30;
  
  // Simulated dead link check (invalid URL formats)
  const invalidFormatUrls = allUrls.filter(url => {
    try {
      if (url.startsWith('/')) new URL(url, `https://${host}`);
      else new URL(url);
      return false;
    } catch {
      return true;
    }
  });
  if (invalidFormatUrls.length > 0) bpScore -= 30;

  // Real dead links from DeepScan
  const deadLinks = Object.keys(linkStatuses).filter(url => linkStatuses[url] === false);
  if (deadLinks.length > 0) {
    bpScore -= Math.min(60, deadLinks.length * 20); // Big penalty for real dead links
  }

  // Encoding issues
  if (rawText.includes('')) bpScore -= 40;
  
  scores.bestPractices = Math.max(0, bpScore);

  // Calculate Overall Score
  scores.overall = Math.round(
    (scores.completeness * 0.25) +
    (scores.structure * 0.20) +
    (scores.linkCoverage * 0.20) +
    (scores.descriptionRichness * 0.15) +
    (scores.llmOptimization * 0.10) +
    (scores.bestPractices * 0.10)
  );

  return scores;
}

module.exports = scoreLLMsTxt;
