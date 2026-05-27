import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'src', 'data', 'centuries');

function getApparitions() {
  const files = fs.readdirSync(DATA_DIR).filter(file => file.endsWith('.ts'));
  const list = [];

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // We parse the file content crudely to find the objects
    // Since it's a TS array, let's match objects inside
    const entryRegex = /id:\s*["']([^"']+)["']/g;
    
    // Let's do a line-by-line or object-by-object extract
    const lines = content.split('\n');
    let current = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const idMatch = line.match(/id:\s*["']([^"']+)["']/);
      const titleMatch = line.match(/title:\s*["']([^"']+)["']/);
      const yearMatch = line.match(/year:\s*([0-9\-]+)/);
      const locationMatch = line.match(/location:\s*["']([^"']+)["']/);
      const sourceMatch = line.match(/sourceUrl:\s*["']([^"']+)["']/);

      if (idMatch) {
        if (current) list.push(current);
        current = { id: idMatch[1], file, line: i + 1 };
      }
      if (current) {
        if (titleMatch) current.title = titleMatch[1];
        if (yearMatch) current.year = parseInt(yearMatch[1], 10);
        if (locationMatch) current.location = locationMatch[1];
        if (sourceMatch) current.sourceUrl = sourceMatch[1];
      }

      if (line.trim() === '},' || line.trim() === '}') {
        if (current) {
          list.push(current);
          current = null;
        }
      }
    }
    if (current) {
      list.push(current);
    }
  }

  return list;
}

function getFallbackUrl(location) {
  if (!location) return null;
  const querySlug = location.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `https://www.miraclehunter.com/marian_apparitions/approved_apparitions/${querySlug}/index.html`;
}

async function checkUrl(url) {
  const userAgent = 'Mozilla/5.5 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const response = await fetch(url, {
      method: 'HEAD', // HEAD is faster
      headers: { 'User-Agent': userAgent },
      signal: controller.signal,
      redirect: 'follow'
    });
    clearTimeout(timeoutId);
    return response.status;
  } catch (error) {
    return 0;
  }
}

async function run() {
  const apps = getApparitions();
  console.log(`Found ${apps.length} total apparitions in dataset.`);

  const results = [];
  let checked = 0;

  for (const app of apps) {
    const url = app.sourceUrl ? app.sourceUrl.split(';')[0].trim() : getFallbackUrl(app.location);
    if (!url) continue;

    checked++;
    const status = await checkUrl(url);
    console.log(`[${checked}/${apps.length}] ${app.id} (${app.year}) -> Status: ${status} (URL: ${url})`);
    
    results.push({
      id: app.id,
      title: app.title,
      year: app.year,
      location: app.location,
      file: app.file,
      line: app.line,
      hasExplicitSource: !!app.sourceUrl,
      url,
      status
    });

    // Short throttle to avoid hitting the server too aggressively
    await new Promise(r => setTimeout(r, 100));
  }

  // Write results to JSON
  fs.writeFileSync('all_sources_diagnostic.json', JSON.stringify(results, null, 2));
  
  // Generate md report of broken ones
  const broken = results.filter(r => r.status === 404 || r.status === 0);
  console.log(`Done. Found ${broken.length} broken URLs out of ${results.length} checked.`);
}

run().catch(console.error);
