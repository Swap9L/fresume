const fs = require('fs');
const FILE_PATH = 'src/app/admin/dashboard/page.tsx';
let content = fs.readFileSync(FILE_PATH, 'utf8');

// Fix double dark classes like "bg-zinc-900 dark:bg-zinc-100 dark:bg-zinc-800/50 text-white dark:text-zinc-900"
content = content.replace(/dark:bg-zinc-100 dark:bg-zinc-800\/50/g, 'dark:bg-zinc-800/50');
content = content.replace(/dark:bg-zinc-900 dark:bg-zinc-100 dark:bg-zinc-800\/50/g, 'dark:bg-zinc-800/50');
content = content.replace(/bg-white dark:bg-zinc-900 dark:bg-zinc-100 dark:bg-zinc-800\/50/g, 'bg-white dark:bg-zinc-900');
content = content.replace(/bg-white dark:bg-zinc-100 dark:bg-zinc-800\/50/g, 'bg-white dark:bg-zinc-900');
content = content.replace(/text-zinc-500 dark:text-zinc-400 dark:text-zinc-500/g, 'text-zinc-500 dark:text-zinc-400');
content = content.replace(/text-zinc-600 dark:text-zinc-400 dark:text-zinc-500/g, 'text-zinc-600 dark:text-zinc-400');
content = content.replace(/text-zinc-400 dark:text-zinc-500 dark:text-zinc-500/g, 'text-zinc-400 dark:text-zinc-500');

// Fix the Sidebar text issue
content = content.replace(
    /"text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:bg-zinc-800\/50 hover:text-zinc-900 dark:text-zinc-100"/g,
    '"text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100"'
);

// Add missing dark:hover:text to the Icon class in SidebarBtn
content = content.replace(
    /'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:text-zinc-300'/g,
    '"text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"'
);

// Specifically the Save btn
content = content.replace(
    /className="flex items-center gap-2 px-5 py-2\.5 text-sm font-medium bg-zinc-900 dark:bg-zinc-800\/50 text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-60 transition-all"/g,
    'className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-60 transition-all"'
);

// Save back
fs.writeFileSync(FILE_PATH, content);
console.log('Fixed double classes.');
