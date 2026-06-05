const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const os = require('os');

const faviconDir = path.join(__dirname, 'favicon');

function circleMask(size) {
  const r = size / 2;
  return Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${r}" cy="${r}" r="${r}" fill="white"/></svg>`
  );
}

async function makeCircular(inputFile, size) {
  const tmp = path.join(os.tmpdir(), `favicon_tmp_${size}.png`);
  const mask = circleMask(size);
  await sharp(inputFile)
    .resize(size, size)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toFile(tmp);
  fs.copyFileSync(tmp, inputFile);
  fs.unlinkSync(tmp);
  console.log(`✓ ${path.basename(inputFile)} (${size}x${size}) — circular`);
}

async function run() {
  await makeCircular(path.join(faviconDir, 'favicon-32x32.png'), 32);
  await makeCircular(path.join(faviconDir, 'favicon-16x16.png'), 16);
  await makeCircular(path.join(faviconDir, 'android-chrome-192x192.png'), 192);
  await makeCircular(path.join(faviconDir, 'apple-touch-icon.png'), 180);
  console.log('\nDone! All favicons clipped to circle with transparent corners.');
}

run().catch(console.error);
