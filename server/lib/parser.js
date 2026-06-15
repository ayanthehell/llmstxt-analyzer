function parseLLMsTxt(rawText) {
  const lines = rawText.split('\n');
  const parsed = {
    title: null,
    summary: '',
    sections: [],
    metadata: {},
  };

  let currentSection = null;
  let inSummary = false;

  const getOrCreateSection = () => {
    if (!currentSection) {
      currentSection = {
        name: 'General',
        description: '',
        links: []
      };
      parsed.sections.push(currentSection);
    }
    return currentSection;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) continue;

    // Title parsing (first H1)
    if (line.startsWith('# ') && !parsed.title) {
      parsed.title = line.replace(/^#\s*/, '').trim();
      continue;
    }

    // Summary blockquote parsing
    if (line.startsWith('>')) {
      inSummary = true;
      parsed.summary += line.replace(/^>\s*/, '') + ' ';
      continue;
    } else if (inSummary && !line.startsWith('#') && !line.startsWith('-')) {
      // Sometimes blockquotes continue on next line without '>'
      // Just a simple heuristic: if we were in summary and it's not a new section or list, it might be continuation
      // But adhering strictly to standard: let's only do lines starting with '>'
      inSummary = false;
    }

    // Metadata parsing (e.g. key: value)
    if (!currentSection && /^[a-zA-Z0-9_-]+:\s+.+/.test(line)) {
      const match = line.match(/^([a-zA-Z0-9_-]+):\s+(.+)$/);
      if (match) {
        parsed.metadata[match[1]] = match[2];
      }
      continue;
    }

    // Section headers (H2)
    if (line.startsWith('## ')) {
      currentSection = {
        name: line.replace(/^##\s*/, '').trim(),
        description: '',
        links: []
      };
      parsed.sections.push(currentSection);
      continue;
    }

    // Links parsing [Label](URL) optionally following a list item
    // Matches `- [Label](URL)` or `* [Label](URL): optional desc` or just `[Label](URL)`
    const linkRegex = /(?:[-*]\s+)?\[([^\]]+)\]\(([^)]+)\)(?::\s*(.*))?/;
    const linkMatch = line.match(linkRegex);

    if (linkMatch) {
      const sec = getOrCreateSection();
      sec.links.push({
        label: linkMatch[1].trim(),
        url: linkMatch[2].trim(),
        description: linkMatch[3] ? linkMatch[3].trim() : ''
      });
      continue;
    }

    // Capture section description if it's text under a section but not a link
    if (!line.startsWith('#') && !line.startsWith('-') && !line.startsWith('*')) {
      const sec = getOrCreateSection();
      sec.description += line + ' ';
    }
  }

  parsed.summary = parsed.summary.trim();
  parsed.sections.forEach(sec => {
    sec.description = sec.description.trim();
  });

  return parsed;
}

module.exports = parseLLMsTxt;
