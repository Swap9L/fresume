const fs = require('fs');

const FILE_PATH = 'src/app/admin/dashboard/page.tsx';
let content = fs.readFileSync(FILE_PATH, 'utf8');

const replacements = [
    ['bg-zinc-50', 'bg-zinc-50 dark:bg-zinc-950'],
    ['bg-white', 'bg-white dark:bg-zinc-900'],
    ['border-zinc-200', 'border-zinc-200 dark:border-zinc-800'],
    ['border-zinc-100', 'border-zinc-100 dark:border-zinc-800'],
    ['text-zinc-900', 'text-zinc-900 dark:text-zinc-100'],
    ['text-zinc-800', 'text-zinc-800 dark:text-zinc-200'],
    ['text-zinc-700', 'text-zinc-700 dark:text-zinc-300'],
    ['text-zinc-600', 'text-zinc-600 dark:text-zinc-400'],
    ['text-zinc-500', 'text-zinc-500 dark:text-zinc-400'],
    ['text-zinc-400', 'text-zinc-400 dark:text-zinc-500'],
    ['bg-zinc-900', 'bg-zinc-900 dark:bg-zinc-100'],
    ['text-white', 'text-white dark:text-zinc-900'],
    ['bg-zinc-100', 'bg-zinc-100 dark:bg-zinc-800/50'],
    ['hover:bg-zinc-100', 'hover:bg-zinc-100 dark:hover:bg-zinc-800'],
    ['hover:bg-zinc-800', 'hover:bg-zinc-800 dark:hover:bg-zinc-200'],
    ['hover:text-zinc-700', 'hover:text-zinc-700 dark:hover:text-zinc-300'],
    ['hover:bg-red-50', 'hover:bg-red-50 dark:hover:bg-red-950/50'],
];

replacements.forEach(([from, to]) => {
    // Escape '-' for regex if needed, but \b handles boundaries well.
    // Negative lookahead to ensure we don't duplicate `dark:` classes
    const regex = new RegExp(`\\b${from}(?! dark:)`, 'g');
    content = content.replace(regex, to);
});

fs.writeFileSync(FILE_PATH, content);
console.log('Replacements complete');
