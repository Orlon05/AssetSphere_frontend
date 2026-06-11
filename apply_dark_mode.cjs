const fs = require('fs');
const path = 'C:/Users/3171135/Desktop/Desarollo/Desarollo/AssetSphere_frontend/src/views/dashboard/dashboard.jsx';

let content = fs.readFileSync(path, 'utf8');

// Replace standard colors with dark mode equivalents
const replacements = [
  [/bg-white/g, 'bg-white dark:bg-slate-800'],
  [/bg-gray-50/g, 'bg-gray-50 dark:bg-slate-900/50'],
  [/bg-gray-100/g, 'bg-gray-100 dark:bg-slate-800'],
  [/text-gray-900/g, 'text-gray-900 dark:text-white'],
  [/text-gray-800/g, 'text-gray-800 dark:text-slate-100'],
  [/text-gray-700/g, 'text-gray-700 dark:text-slate-300'],
  [/text-gray-600/g, 'text-gray-600 dark:text-slate-400'],
  [/text-gray-500/g, 'text-gray-500 dark:text-slate-400'],
  [/border-gray-200/g, 'border-gray-200 dark:border-slate-700'],
  [/border-gray-100/g, 'border-gray-100 dark:border-slate-800'],
  [/hover:bg-gray-50/g, 'hover:bg-gray-50 dark:hover:bg-slate-700'],
  [/hover:border-gray-400/g, 'hover:border-gray-400 dark:hover:border-slate-500'],
  [/group-hover:bg-gray-100/g, 'group-hover:bg-gray-100 dark:group-hover:bg-slate-700'],
  [/group-hover:border-gray-200/g, 'group-hover:border-gray-200 dark:group-hover:border-slate-600'],
  [/group-hover:text-gray-950/g, 'group-hover:text-gray-950 dark:group-hover:text-white'],
  [/text-gray-950/g, 'text-gray-950 dark:text-white'],
];

replacements.forEach(([regex, replacement]) => {
  // Prevent doubling up if dark mode was already applied partially
  content = content.replace(regex, (match) => {
    return replacement;
  });
});

// Clean up any double dark: classes just in case
content = content.replace(/dark:bg-slate-800 dark:bg-slate-800/g, 'dark:bg-slate-800');
content = content.replace(/dark:text-white dark:text-white/g, 'dark:text-white');

fs.writeFileSync(path, content, 'utf8');
console.log('Dark mode classes applied to dashboard.jsx');
