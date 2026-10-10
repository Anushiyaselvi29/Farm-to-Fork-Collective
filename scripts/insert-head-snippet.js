const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '..', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

const zeroFlickerSnippet = `    <script>
        (function() {
            const theme = localStorage.getItem('ftf_theme') || localStorage.getItem('farmToForkTheme') || 'emerald';
            const active = (theme === 'dark') ? 'midnight' : (theme === 'light' ? 'emerald' : theme);
            document.documentElement.setAttribute('data-theme', active);
            if (active === 'midnight') document.documentElement.classList.add('dark-theme');
            const lang = localStorage.getItem('ftf_lang') || 'en';
            document.documentElement.setAttribute('lang', lang);
        })();
    </script>
`;

files.forEach(f => {
    const filePath = path.join(pagesDir, f);
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if head contains the snippet
    const headMatch = content.match(/<head[\s\S]*?<\/head>/i);
    if (!headMatch) return;

    const headContent = headMatch[0];
    if (!headContent.includes("const theme = localStorage.getItem('ftf_theme')") && !headContent.includes("const theme = localStorage.getItem(\"ftf_theme\")")) {
        // Insert right before </head>
        content = content.replace(/<\/head>/i, zeroFlickerSnippet + '</head>');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Inserted head snippet into:', f);
    } else {
        console.log('Head snippet already exists in:', f);
    }
});
