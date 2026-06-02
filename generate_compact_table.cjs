const fs = require('fs');

const dataFile = fs.readFileSync('src/data/eucharistic-miracles.ts', 'utf8');

// Quick and dirty regex extraction for the array items
const items = [];
const regex = /{([^}]+)}/g;
let match;
while ((match = regex.exec(dataFile)) !== null) {
    const itemStr = match[1];
    
    // We only care about objects with an id, location, country, year
    if (!itemStr.includes('id:')) continue;
    
    const extract = (key) => {
        const m = itemStr.match(new RegExp(`${key}:\\s*(['"\`])(.*?)\\1`));
        if (m) return m[2];
        const mNum = itemStr.match(new RegExp(`${key}:\\s*([0-9]+)`));
        if (mNum) return mNum[1];
        return '';
    };

    const id = extract('id');
    const location = extract('location');
    const country = extract('country');
    const year = extract('year');
    let originalTitle = extract('title');
    const approvalStatus = extract('approvalStatus');
    const sourceUrl = extract('sourceUrl');

    if (id && location && originalTitle) {
        let shortTitle = originalTitle.replace(/^Eucharistic Miracle of /i, '');
        
        let link = sourceUrl;
        let isFallback = false;
        if (!link) {
             link = `https://www.miracolieucaristici.org/en/Liste/list.html`;
             isFallback = true;
        }

        items.push({ id, originalTitle, shortTitle, location, country, year, approvalStatus, link, isFallback });
    }
}

// Sort alphabetically by title
items.sort((a, b) => a.shortTitle.localeCompare(b.shortTitle));

let md = `# Compact Eucharistic Miracles & Sources\n\n`;
md += `This table helps you find the correct links for the Eucharistic Miracles. \n`;
md += `1. **Search**: Click 🔍 to instantly Google the miracle name.\n`;
md += `2. **Copy**: You can easily double-click the code text (e.g. \`Eucharistic Miracle...\`) to copy it.\n`;
md += `3. **Report**: Click "Report Fix" to create a GitHub issue with the correct link.\n\n`;
md += `| Full Name (Copy) | Current Link | Search | Status | Action |\n`;
md += `| :--- | :---: | :---: | :--- | :--- |\n`;

for (const item of items) {
    const shortStatus = item.approvalStatus.replace(' Approved', '').replace('Traditionally', 'Trad.');
    
    // Code block makes it extremely easy to double-click and copy the whole phrase
    const copyBlock = `\`${item.originalTitle}\``;
    
    // Current Link
    const currentLinkUrl = `[${item.link}](${item.link})`;
    
    // A direct Google search link
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent('"' + item.originalTitle + '"')}`;
    const searchBtn = `[🔍](${searchUrl})`;
    
    const issueTitle = encodeURIComponent(`Update link for ${item.shortTitle}`);
    const issueBody = encodeURIComponent(`The current link for ${item.shortTitle} is a generic fallback.\n\nThe correct URL is:\n[Insert correct URL here]`);
    const reportUrl = `https://github.com/Ignisko/Stella_Maris/issues/new?title=${issueTitle}&body=${issueBody}`;
    
    const reportLink = item.isFallback 
        ? `<a href="${reportUrl}" target="_blank" style="color:red; font-weight:bold;">Report Fix</a>` 
        : `<a href="${reportUrl}" target="_blank" style="color:green;">Update</a>`;
    
    md += `| ${copyBlock} | ${currentLinkUrl} | ${searchBtn} | ${shortStatus} | ${reportLink} |\n`;
}

const outPath = 'C:\\Users\\ignac\\.gemini\\antigravity\\brain\\915685d5-d422-4fe2-bd0c-9ef65bfb7107\\eucharistic_miracles_table.md';
fs.writeFileSync(outPath, md, 'utf8');

console.log(`Generated ${items.length} compact table items with copy text and search links.`);
