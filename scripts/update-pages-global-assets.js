const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '..', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

const zeroFlickerTag = `    <script>
        (function() {
            const theme = localStorage.getItem('ftf_theme') || localStorage.getItem('farmToForkTheme') || 'emerald';
            const active = (theme === 'dark') ? 'midnight' : (theme === 'light' ? 'emerald' : theme);
            document.documentElement.setAttribute('data-theme', active);
            if (active === 'midnight') document.documentElement.classList.add('dark-theme');
            const lang = localStorage.getItem('ftf_lang') || 'en';
            document.documentElement.setAttribute('lang', lang);
        })();
    </script>`;

files.forEach(f => {
    const filePath = path.join(pagesDir, f);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // 1. Remove old incomplete theme head scripts if present
    if (content.includes('const theme = localStorage.getItem(\'ftf_theme\')') && !content.includes('localStorage.getItem(\'ftf_lang\')')) {
        content = content.replace(/<script>\s*\(function\(\)\s*\{\s*const theme = localStorage\.getItem[\s\S]*?<\/script>/, zeroFlickerTag);
        changed = true;
    } else if (!content.includes('localStorage.getItem(\'ftf_lang\')')) {
        content = content.replace('</head>', zeroFlickerTag + '\n</head>');
        changed = true;
    }

    // 2. Check script.js before </body>
    if (!content.includes('script.js')) {
        content = content.replace('</body>', '    <script src="../js/script.js"></script>\n</body>');
        changed = true;
    }

    // 3. Check i18n.js before </body>
    if (!content.includes('i18n.js')) {
        content = content.replace('</body>', '    <script src="../js/i18n.js"></script>\n</body>');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated:', f);
    } else {
        console.log('Already clean:', f);
    }
});
