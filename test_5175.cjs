const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('403') && !msg.text().includes('favicon')) {
      console.log('BROWSER ERROR:', msg.text());
    }
  });
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  console.log('Navigating to http://localhost:5175/');
  await page.goto('http://localhost:5175/');
  
  console.log('Waiting for help button...');
  try {
    const helpBtn = await page.waitForSelector('.desktop-help-btn', { timeout: 10000 });
    await helpBtn.click();
    console.log('Clicked help button');
    
    await page.waitForTimeout(1000);
    
    for (let i = 0; i < 15; i++) {
      const nextBtn = await page.$('button:has-text("Dalej")');
      if (nextBtn) {
        console.log(`Step ${i+1}: Clicking Dalej`);
        await nextBtn.click();
        await page.waitForTimeout(500);
      } else {
        const closeBtn = await page.$('button:has-text("Zamknij")');
        if (closeBtn) {
          console.log(`Step ${i+1}: Clicking Zamknij`);
          await closeBtn.click();
          await page.waitForTimeout(1000);
          break;
        }
      }
    }
    
    console.log('Waiting 2 seconds after tutorial...');
    await page.waitForTimeout(2000);
  } catch(e) {
    console.log('Error interacting:', e.message);
  }
  
  await browser.close();
})();
