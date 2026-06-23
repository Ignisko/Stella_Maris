const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  console.log('Navigating to http://localhost:5175/');
  await page.goto('http://localhost:5175/');
  
  console.log('Waiting 3 seconds...');
  await page.waitForTimeout(3000);
  
  await browser.close();
})();
