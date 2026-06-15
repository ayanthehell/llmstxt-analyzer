const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = [
  { from: /bg-slate-900/g, to: 'bg-white' },
  { from: /bg-slate-950/g, to: 'bg-slate-50' },
  { from: /bg-slate-800\/50/g, to: 'bg-slate-100/50' },
  { from: /bg-slate-800/g, to: 'bg-slate-50' },
  { from: /border-slate-700/g, to: 'border-slate-200' },
  { from: /border-slate-800/g, to: 'border-slate-200' },
  { from: /border-white\/5/g, to: 'border-slate-200' },
  { from: /border-white\/10/g, to: 'border-slate-300' },
  { from: /text-slate-400/g, to: 'text-slate-600' },
  { from: /text-slate-300/g, to: 'text-slate-700' },
  { from: /text-slate-200/g, to: 'text-slate-800' },
  { from: /text-slate-50/g, to: 'text-slate-900' },
  // Be careful with text-white: don't replace if it's in a primary button, 
  // but it's hard to safely regex that. Actually, "text-slate-900" is better for most glass panels. 
  // Let's replace `text-white` but maybe manually fix buttons later if needed.
  { from: /text-white/g, to: 'text-slate-900' },
  { from: /bg-slate-900\/30/g, to: 'bg-white/30' },
  // Specific fix: if we replaced text-white with text-slate-900, let's restore it in primary buttons
  { from: /glass-button-primary(.*?)text-slate-900/g, to: 'glass-button-primary$1text-white' },
  // Also for "group-hover:text-white" -> "group-hover:text-white"
  { from: /group-hover:text-slate-900/g, to: 'group-hover:text-white' }
];

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(directoryPath, function(filePath) {
  if (filePath.endsWith('.jsx')) {
    let fileContent = fs.readFileSync(filePath, 'utf8');
    let newContent = fileContent;
    replacements.forEach(r => {
      newContent = newContent.replace(r.from, r.to);
    });
    if (newContent !== fileContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  }
});

console.log("Theme replacement complete.");
