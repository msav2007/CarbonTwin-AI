const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Exclude some landing page files that should keep white text on navy background
  if (!file.includes('hero.tsx') && !file.includes('navbar.tsx') && !file.includes('ambient-background.tsx')) {
    content = content.replace(/text-\[\#F8FAFC\]/g, 'text-foreground');
    content = content.replace(/text-\[\#94A3B8\]/g, 'text-muted-foreground');
    content = content.replace(/bg-\[\#08111B\]/g, 'bg-background');
    content = content.replace(/border-cyan-500\/\[?0\.[0-9]+\]?/g, 'border-border');
    content = content.replace(/bg-white\/\[0\.0[2-9]\]/g, 'bg-slate-50');
    content = content.replace(/bg-cyan-500\/\[?0\.[0-9]+\]?/g, 'bg-slate-50');
    content = content.replace(/text-\[\#7DF9FF\]/g, 'text-primary');
    content = content.replace(/border-cyan-400\/\[?0\.[0-9]+\]?/g, 'border-border');
    content = content.replace(/border-cyan-400\/[0-9]+/g, 'border-border');
    content = content.replace(/bg-cyan-500\/[0-9]+/g, 'bg-primary/10');
    content = content.replace(/shadow-cyan-sm/g, 'shadow-sm');
    content = content.replace(/shadow-cyan/g, 'shadow-sm');
    content = content.replace(/text-amber-300/g, 'text-amber-500');
    content = content.replace(/text-amber-400/g, 'text-amber-500');
    content = content.replace(/text-success/g, 'text-green-600');
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
