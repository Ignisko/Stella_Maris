import fs from 'fs';
import { apparitionsData } from './src/data/apparitions';

const trPath = './src/data/translations/tr.json';
const trData = JSON.parse(fs.readFileSync(trPath, 'utf8'));

async function translateText(text, targetLang) {
  if (!text) return '';
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 429) {
        console.log('Rate limited! Waiting 5 seconds...');
        await new Promise(r => setTimeout(r, 5000));
        return translateText(text, targetLang);
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data[0].map(part => part[0]).join('');
  } catch (e) {
    console.error(`Error translating:`, e);
    return text;
  }
}

async function run() {
  let changed = false;
  let count = 0;
  for (const app of apparitionsData) {
    if (!trData[app.id]) {
      console.log('Translating missing:', app.id);
      const translatedTitle = await translateText(app.title, 'tr');
      await new Promise(r => setTimeout(r, 300));
      const translatedDesc = await translateText(app.description, 'tr');
      await new Promise(r => setTimeout(r, 300));

      trData[app.id] = {
        title: translatedTitle,
        description: translatedDesc
      };
      changed = true;
      count++;
    }
  }

  if (changed) {
    fs.writeFileSync(trPath, JSON.stringify(trData, null, 2));
    console.log(`Saved ${count} new translations to tr.json`);
  } else {
    console.log('No missing translations found for Turkish!');
  }
}

run();
