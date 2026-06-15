import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error("❌ index.html not found in dist/. Please run 'vite build' first.");
  process.exit(1);
}

const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const tools = [
  {
    id: 'emi-calculator',
    title: 'EMI Calculator | Free Online Tool',
    description: 'Calculate your Equated Monthly Installment for home, car, or personal loans.',
  },
  {
    id: 'sip-calculator',
    title: 'SIP Calculator | Free Online Tool',
    description: 'Estimate returns on your Systematic Investment Plan mutual fund investments.',
  },
  {
    id: 'gst-calculator',
    title: 'GST Calculator | Free Online Tool',
    description: 'Easily calculate Goods and Services Tax for inclusive and exclusive amounts.',
  },
  {
    id: 'electricity-bill-calculator',
    title: 'Electricity Bill Estimator',
    description: 'Estimate your monthly electricity bill based on unit consumption.',
  },
  {
    id: 'cgpa-percentage-converter',
    title: 'CGPA to Percentage Converter',
    description: 'Convert your CGPA to percentage according to CBSE/university standards.',
  },
  {
    id: 'land-unit-converter',
    title: 'Land Unit Converter',
    description: 'Convert regional Indian land area units like Bigha, Katha, Decimal to Sq Ft.',
  },
  {
    id: 'salary-slip-generator',
    title: 'Salary Slip Generator | Free PDF',
    description: 'Generate professional salary slips with automatic tax and allowance calculations.',
  },
  {
    id: 'rent-agreement-generator',
    title: 'Rent Agreement Generator | Free PDF',
    description: 'Draft and generate a standard rent agreement document quickly.',
  },
  {
    id: 'leave-application-generator',
    title: 'Leave Application Generator',
    description: 'Generate formatted leave application letters for school, college, or office.',
  },
  {
    id: 'robots-txt-generator',
    title: 'AI Robots.txt Generator',
    description: 'Generate an advanced robots.txt optimized for AI crawlers and LLMs.',
  },
  {
    id: 'llms-txt-builder',
    title: 'llms.txt Builder | AI SEO',
    description: 'Create a semantic mapping file to guide AI agents and LLMs to your content.',
  }
];

const generateToolHtml = (tool) => {
  // We replace the generic meta tags with tool-specific ones.
  // Assuming the base HTML has <title>...</title> and generic OG tags.
  // We'll just inject our specific tags right before </head> to override anything else.
  
  const ogTags = `
    <title>${tool.title}</title>
    <meta name="description" content="${tool.description}" />
    <meta property="og:title" content="${tool.title}" />
    <meta property="og:description" content="${tool.description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.llmstxt.in.net/tools/${tool.id}" />
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="${tool.title}" />
    <meta property="twitter:description" content="${tool.description}" />
  `;

  // We use regex to replace <title>...</title> so we don't have duplicates
  let newHtml = baseHtml.replace(/<title>.*?<\/title>/, '');
  // Remove existing description if exists
  newHtml = newHtml.replace(/<meta name="description".*?>/, '');
  
  // Inject new tags before </head>
  newHtml = newHtml.replace('</head>', `${ogTags}\n</head>`);

  return newHtml;
};

console.log('🚀 Generating static HTML pages for Open Graph...');

tools.forEach(tool => {
  const toolDir = path.join(distDir, 'tools', tool.id);
  if (!fs.existsSync(toolDir)) {
    fs.mkdirSync(toolDir, { recursive: true });
  }

  const toolHtmlPath = path.join(toolDir, 'index.html');
  const toolHtml = generateToolHtml(tool);

  fs.writeFileSync(toolHtmlPath, toolHtml, 'utf8');
  console.log(`✅ Generated: /tools/${tool.id}/index.html`);
});

console.log('🎉 All static OG pages generated successfully!');
