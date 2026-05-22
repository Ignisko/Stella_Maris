import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'src', 'data', 'centuries');
const OUTPUT_FILE = path.join(__dirname, 'project-documentation', 'source_links_diagnostic.md');

// Helper to scan files and extract source URLs
function getUrlsFromData() {
  const files = fs.readdirSync(DATA_DIR).filter(file => file.endsWith('.ts'));
  const urlMap = new Map(); // url -> { apparitionId, apparitionTitle, file, line }

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    let currentApparition = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Track current apparition ID/Title
      const idMatch = line.match(/id:\s*["']([^"']+)["']/);
      const titleMatch = line.match(/title:\s*["']([^"']+)["']/);

      if (idMatch) {
        if (!currentApparition) currentApparition = {};
        currentApparition.id = idMatch[1];
      }
      if (titleMatch) {
        if (!currentApparition) currentApparition = {};
        currentApparition.title = titleMatch[1];
      }

      // Check if closing brace of object
      if (line.trim() === '},' || line.trim() === '}') {
        currentApparition = null;
      }

      const sourceMatch = line.match(/sourceUrl:\s*["']([^"']+)["']/);
      if (sourceMatch) {
        const rawUrls = sourceMatch[1];
        const urls = rawUrls.split(';').map(u => u.trim()).filter(Boolean);

        for (const url of urls) {
          if (!urlMap.has(url)) {
            urlMap.set(url, []);
          }
          urlMap.get(url).push({
            apparitionId: currentApparition?.id || 'unknown',
            apparitionTitle: currentApparition?.title || 'Unknown',
            file: file,
            line: i + 1
          });
        }
      }
    }
  }

  return urlMap;
}

async function checkUrl(url) {
  console.log(`Checking: ${url}`);
  const userAgent = 'Mozilla/5.5 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 second timeout

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': userAgent },
      signal: controller.signal,
      redirect: 'follow'
    });
    
    clearTimeout(timeoutId);

    return {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
      redirected: response.redirected,
      url: response.url
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      statusText: error.message || 'Fetch failed',
      redirected: false,
      url: url
    };
  }
}

async function run() {
  console.log('Scanning data files for sourceUrls...');
  const urlMap = getUrlsFromData();
  console.log(`Found ${urlMap.size} unique URLs to check.`);

  const results = [];

  for (const [url, locations] of urlMap.entries()) {
    const res = await checkUrl(url);
    results.push({
      url,
      locations,
      ...res
    });
  }

  // Generate Markdown
  let md = `# Source Links Diagnostic Report\n\n`;
  md += `Generated on: ${new Date().toISOString()}\n\n`;
  md += `This document lists all source URLs defined in the Marian apparitions dataset, their test results, and status.\n\n`;

  // Summary table
  md += `## Summary Table\n\n`;
  md += `| URL | Apparition (ID) | Status | Code | Notes |\n`;
  md += `| :--- | :--- | :---: | :---: | :--- |\n`;

  for (const item of results) {
    const locNames = item.locations.map(l => `${l.apparitionTitle} (\`${l.apparitionId}\`)`).join(', ');
    const statusIcon = item.ok ? '✅ Valid' : '❌ Invalid/Broken';
    const notes = item.redirected 
      ? `Redirected to: ${item.url}` 
      : (item.ok ? 'OK' : item.statusText);
    
    md += `| [${item.url}](${item.url}) | ${locNames} | ${statusIcon} | ${item.status} | ${notes} |\n`;
  }

  md += `\n\n## Detailed Findings\n\n`;

  for (const item of results) {
    md += `### URL: ${item.url}\n\n`;
    md += `- **Status**: ${item.ok ? '✅ Valid' : '❌ Invalid/Broken'}\n`;
    md += `- **HTTP Status Code**: ${item.status || 'N/A'}\n`;
    md += `- **Details/Error**: ${item.statusText || 'None'}\n`;
    if (item.redirected) {
      md += `- **Final Redirected URL**: [${item.url}](${item.url})\n`;
    }
    md += `- **Used in Apparitions**:\n`;
    for (const loc of item.locations) {
      md += `  - **Apparition**: ${loc.apparitionTitle} (ID: \`${loc.apparitionId}\`)\n`;
      md += `  - **Location**: file [${loc.file}](file:///src/data/centuries/${loc.file}#L${loc.line}) (Line ${loc.line})\n`;
    }
    md += `\n---\n\n`;
  }

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, md, 'utf-8');
  console.log(`Diagnostic completed. Report written to ${OUTPUT_FILE}`);
}

run().catch(err => {
  console.error('Fatal error during diagnostic:', err);
  process.exit(1);
});
