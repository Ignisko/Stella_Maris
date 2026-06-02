const https = require('https');
const fs = require('fs');

const url = 'https://www.miracolieucaristici.org/en/Liste/list.html';

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        const linksMap = new Map();
        
        const regex = /<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
        let match;
        while ((match = regex.exec(data)) !== null) {
            let href = match[1];
            let rawText = match[2].replace(/<[^>]+>/g, '').trim();
            let text = rawText.replace(/&nbsp;/gi, ' ').trim();
            
            if (href.includes('scheda')) {
                // Check if we need to append the &ct= parameter like their JS does
                if (!href.includes('&ct=')) {
                     href += '&ct=' + encodeURIComponent(text);
                }

                if (href.startsWith('scheda')) {
                    href = 'https://www.miracolieucaristici.org/en/Liste/' + href;
                }
                
                // Clean the text for matching (remove the year part for matching)
                let matchName = text.split(',')[0].trim().toLowerCase();
                
                if (matchName.length > 0) {
                    linksMap.set(matchName, href);
                }
            }
        }
        
        const filePath = 'src/data/eucharistic-miracles.ts';
        let tsContent = fs.readFileSync(filePath, 'utf8');
        
        let updatedCount = 0;
        
        const objectRegex = /({[^}]+id:\s*['"]([^'"]+)['"][^}]+})/g;
        
        tsContent = tsContent.replace(objectRegex, (fullMatch, objStr, id) => {
            const titleMatch = objStr.match(/title:\s*['"]([^'"]+)['"]/);
            const locationMatch = objStr.match(/location:\s*['"]([^'"]+)['"]/);
            
            let foundLink = null;
            
            if (titleMatch) {
                const title = titleMatch[1];
                const shortTitle = title.replace(/^Eucharistic Miracle of /i, '').trim().toLowerCase();
                
                if (linksMap.has(shortTitle)) {
                    foundLink = linksMap.get(shortTitle);
                } else if (locationMatch && linksMap.has(locationMatch[1].toLowerCase())) {
                    foundLink = linksMap.get(locationMatch[1].toLowerCase());
                } else {
                    for (const [key, value] of linksMap.entries()) {
                        if (key.includes(shortTitle) || shortTitle.includes(key)) {
                            foundLink = value;
                            break;
                        }
                    }
                }
            }
            
            if (foundLink) {
                if (objStr.includes('sourceUrl:')) {
                    const oldObjStr = objStr;
                    objStr = objStr.replace(/sourceUrl:\s*['"][^'"]*['"]/, `sourceUrl: '${foundLink}'`);
                    if (oldObjStr !== objStr) updatedCount++;
                } else {
                    objStr = objStr.replace(/(\s*})$/, `, sourceUrl: '${foundLink}'$1`);
                    updatedCount++;
                }
            }
            
            return objStr;
        });
        
        fs.writeFileSync(filePath, tsContent, 'utf8');
        console.log(`Updated ${updatedCount} miracles with exact links (including &ct= parameter) in eucharistic-miracles.ts!`);
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
