const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'pages', 'tools');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace muddy backgrounds with clean glassmorphism or white styles
  content = content.replace(/bg-slate-50/g, 'bg-white/60 dark:bg-slate-800/50 backdrop-blur-md');
  content = content.replace(/bg-slate-100\/50/g, 'bg-white/40 dark:bg-slate-800/40 backdrop-blur-md');
  content = content.replace(/bg-\[#fdfbf7\]/g, 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg');
  content = content.replace(/border-\[#e5e5e5\]/g, 'border-white/50 dark:border-slate-700/50');
  content = content.replace(/bg-slate-100/g, 'bg-slate-50/50 dark:bg-slate-800/50');
  
  // Make inputs truly glass
  // Some inputs have bg-white explicitly, we might want to keep glass-input handling that
  // CgpaConverter uses bg-[#f8fbff]
  content = content.replace(/bg-\[#f8fbff\]/g, 'bg-blue-50/50 dark:bg-blue-900/20');
  
  // Replace hover states
  content = content.replace(/hover:bg-slate-50\/30/g, 'hover:bg-white/40 dark:hover:bg-slate-800/40');
  content = content.replace(/hover:bg-slate-50/g, 'hover:bg-white/60 dark:hover:bg-slate-800/60');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
