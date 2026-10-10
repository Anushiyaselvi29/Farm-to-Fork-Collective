const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');
const bot = fs.readFileSync(path.join(__dirname, '..', 'js', 'chatbot.js'), 'utf8');
const themes = ['emerald', 'midnight', 'harvest', 'oceanic', 'vineyard', 'espresso'];

console.log('--- 1. Farm AI Theme Adaptations Check ---');
let allThemesPassed = true;
themes.forEach(t => {
    const hasCss = css.includes(`data-theme="${t}"]`) && css.includes('.ftf-chat-trigger');
    const hasBot = bot.includes(`data-theme="${t}"]`) && bot.includes('.ftf-chat-trigger');
    const ok = hasCss && hasBot;
    if (!ok) allThemesPassed = false;
    console.log(`  ${ok ? '✅' : '❌'} Theme ${t.padEnd(10)}: style.css=${hasCss}, chatbot.js=${hasBot}`);
});

console.log('\n--- 2. Legacy Switchers Clean Removal Check ---');
const legacyHidden = css.includes('.nav-lang-pill') &&
                     css.includes('.floating-lang-btn') &&
                     css.includes('#globalFloatingLangBtn') &&
                     css.includes('display: none !important');
console.log(`  ${legacyHidden ? '✅' : '❌'} Legacy switchers hidden with display: none !important in style.css`);

console.log('\n--- 3. Preserved Organic Leaf Foliage Green Check ---');
const leafGreen = css.includes('.brand-leaf-badge') &&
                  css.includes('#16a34a') &&
                  css.includes('.brand-side-leaf');
console.log(`  ${leafGreen ? '✅' : '❌'} Brand organic leaf badge explicitly preserves authentic green (#16a34a)`);

console.log('\n=============================================');
if (allThemesPassed && legacyHidden && leafGreen) {
    console.log('🎉 ALL THEME & LANGUAGE CLEANUP CHECKS PASSED 100%!');
} else {
    console.error('❌ SOME CHECKS FAILED!');
    process.exit(1);
}
