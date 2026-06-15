function generateGaps(scores, parsedData, linkStatuses = {}) {
  let gaps = [];

  // Completeness
  if (!parsedData.title) {
    gaps.push({ dimension: 'Completeness', severity: 'Critical', text: 'Missing H1 title — LLMs have no primary context for this site.', recommendation: 'Add a `# Site Name` at the very beginning of the file.', snippet: '# Your Site Name\n' });
  }
  if (!parsedData.summary) {
    gaps.push({ dimension: 'Completeness', severity: 'Critical', text: 'Missing blockquote summary — LLMs cannot quickly understand what your site is about.', recommendation: 'Add a `> ` blockquote paragraph describing the site right under the title.', snippet: '> This site provides documentation and API references for our product, helping LLMs understand our core offering.\n' });
  }
  if (parsedData.sections.length < 2) {
    gaps.push({ dimension: 'Completeness', severity: 'Warning', text: 'Very few sections detected. Organized data helps LLMs structure their knowledge.', recommendation: 'Create at least two sections (e.g., `## About`, `## Documentation`).', snippet: '## Documentation\n\n## API Reference\n' });
  }
  
  const totalLinks = parsedData.sections.reduce((acc, sec) => acc + sec.links.length, 0);
  if (totalLinks < 3) {
    gaps.push({ dimension: 'Completeness', severity: 'Warning', text: 'Insufficient file links. LLMs rely on linked resources for deep dives.', recommendation: 'Include at least three key pages (e.g., pricing, docs, contact).', snippet: '- [Documentation](https://example.com/docs): Comprehensive guides.\n' });
  }

  // Structure
  const sectionNames = parsedData.sections.map(s => s.name.toLowerCase());
  const uniqueSections = new Set(sectionNames);
  if (uniqueSections.size < sectionNames.length) {
    gaps.push({ dimension: 'Structure Quality', severity: 'Warning', text: 'Duplicate section headings found.', recommendation: 'Consolidate duplicate sections or rename them.' });
  }

  // Link Coverage
  const allUrls = parsedData.sections.flatMap(s => s.links.map(l => l.url.toLowerCase()));
  const keyPages = ['doc', 'api', 'about', 'pricing', 'blog'];
  let missingKeyPages = keyPages.filter(page => !allUrls.some(u => u.includes(page)));
  if (missingKeyPages.length > 2) {
    gaps.push({ dimension: 'Link Coverage', severity: 'Suggestion', text: `Missing common crucial pages (e.g., ${missingKeyPages.slice(0, 2).join(', ')}).`, recommendation: 'Add links to your documentation, API, or about pages if they exist.', snippet: `- [${missingKeyPages[0]}](https://yourdomain.com/${missingKeyPages[0]})\n` });
  }

  // Description Richness
  const linksWithoutDesc = parsedData.sections.reduce((acc, sec) => {
    return acc + sec.links.filter(l => l.description.length <= 5 && l.label.length <= 10).length;
  }, 0);
  if (linksWithoutDesc > 0) {
    gaps.push({ dimension: 'Description Richness', severity: 'Suggestion', text: `${linksWithoutDesc} of ${totalLinks} links lack sufficient descriptive text.`, recommendation: 'Add a colon and a short description after the markdown link, e.g., `[Label](URL): Brief explanation`.', snippet: '- [API Reference](https://example.com/api): Detailed endpoint documentation with schemas.' });
  }

  // LLM Optimization
  if (scores.llmOptimization < 100) {
    gaps.push({ dimension: 'LLM Optimization', severity: 'Warning', text: '`llms-full.txt` not referenced — LLMs may miss your full site context.', recommendation: 'Add an `llms-full.txt` reference if you have deep documentation, or link it.', snippet: '[Optional full site context](https://example.com/llms-full.txt)' });
  }

  // Best Practices
  const badUrls = allUrls.filter(url => !url.startsWith('http') && !url.startsWith('/'));
  if (badUrls.length > 0) {
    gaps.push({ dimension: 'Best Practices', severity: 'Critical', text: 'Invalid URL formats detected. LLMs might fail to traverse them.', recommendation: 'Ensure all URLs are absolute (starting with http/https) or valid relative paths (/).', snippet: '- [Page](https://www.yourdomain.com/page)' });
  }

  const deadLinks = Object.keys(linkStatuses).filter(url => linkStatuses[url] === false);
  if (deadLinks.length > 0) {
    gaps.push({ dimension: 'Best Practices', severity: 'Critical', text: `${deadLinks.length} dead or unreachable link(s) detected during Deep Scan.`, recommendation: 'Remove or update the broken links.', snippet: 'Verify: ' + deadLinks[0] });
  }

  if (gaps.length === 0) {
    gaps.push({ dimension: 'Overall', severity: 'Suggestion', text: 'No major gaps found! Keep your llms.txt up to date.', recommendation: 'Periodically review your links to ensure they reflect current content.' });
  }

  return gaps;
}

module.exports = generateGaps;
