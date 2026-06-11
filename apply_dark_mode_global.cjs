const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  [/bg-white/g, 'bg-white dark:bg-slate-800'],
  [/bg-gray-50/g, 'bg-gray-50 dark:bg-slate-900\/50'],
  [/bg-gray-100/g, 'bg-gray-100 dark:bg-slate-800'],
  [/text-gray-900/g, 'text-gray-900 dark:text-white'],
  [/text-gray-800/g, 'text-gray-800 dark:text-slate-100'],
  [/text-gray-700/g, 'text-gray-700 dark:text-slate-300'],
  [/text-gray-600/g, 'text-gray-600 dark:text-slate-400'],
  [/text-gray-500/g, 'text-gray-500 dark:text-slate-400'],
  [/border-gray-200/g, 'border-gray-200 dark:border-slate-700'],
  [/border-gray-100/g, 'border-gray-100 dark:border-slate-800'],
  [/hover:bg-gray-50/g, 'hover:bg-gray-50 dark:hover:bg-slate-700'],
  [/hover:bg-gray-100/g, 'hover:bg-gray-100 dark:hover:bg-slate-700'],
  [/hover:border-gray-400/g, 'hover:border-gray-400 dark:hover:border-slate-500'],
  [/group-hover:bg-gray-100/g, 'group-hover:bg-gray-100 dark:group-hover:bg-slate-700'],
  [/group-hover:border-gray-200/g, 'group-hover:border-gray-200 dark:group-hover:border-slate-600'],
  [/group-hover:text-gray-950/g, 'group-hover:text-gray-950 dark:group-hover:text-white'],
  [/text-gray-950/g, 'text-gray-950 dark:text-white'],
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  replacements.forEach(([regex, replacement]) => {
    content = content.replace(regex, replacement);
  });

  // Clean up double darks
  content = content.replace(/dark:bg-slate-800 dark:bg-slate-800/g, 'dark:bg-slate-800');
  content = content.replace(/dark:text-white dark:text-white/g, 'dark:text-white');
  content = content.replace(/dark:bg-slate-900\/50 dark:bg-slate-900\/50/g, 'dark:bg-slate-900\/50');
  content = content.replace(/dark:text-slate-100 dark:text-slate-100/g, 'dark:text-slate-100');
  content = content.replace(/dark:text-slate-300 dark:text-slate-300/g, 'dark:text-slate-300');
  content = content.replace(/dark:text-slate-400 dark:text-slate-400/g, 'dark:text-slate-400');
  content = content.replace(/dark:border-slate-700 dark:border-slate-700/g, 'dark:border-slate-700');
  content = content.replace(/dark:border-slate-800 dark:border-slate-800/g, 'dark:border-slate-800');
  content = content.replace(/dark:hover:bg-slate-700 dark:hover:bg-slate-700/g, 'dark:hover:bg-slate-700');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      traverseDirectory(fullPath);
    } else if (stat.isFile() && (fullPath.endsWith('.jsx') || fullPath.endsWith('.js'))) {
      processFile(fullPath);
    }
  }
}

traverseDirectory(srcDir);
console.log('Global dark mode applied successfully.');
