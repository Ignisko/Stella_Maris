const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  let crashed = false;
  
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('403') && !msg.text().includes('favicon')) {
      console.log('BROWSER ERROR:', msg.text());
      crashed = true;
    }
  });
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
    crashed = true;
  });
  
  await page.goto('http://localhost:5173/'); 
  
  try {
    console.log('Waiting for help button...');
    const helpBtn = await page.waitForSelector('.desktop-help-btn', { timeout: 10000 });
    console.log('Clicking help button...');
    await helpBtn.click();
    
    console.log('Waiting for Dalej...');
    await page.waitForSelector('text=Dalej', { timeout: 10000 });
    
    // Click through the tutorial until it's closed
    for (let i = 0; i < 15; i++) {
      await page.waitForTimeout(500);
      const nextBtn = await page.$('button:has-text("Dalej")');
      if (nextBtn) {
         console.log('Clicking Dalej');
         await nextBtn.click();
      } else {
         const closeBtn = await page.$('button:has-text("Zamknij")');
         if (closeBtn) {
            console.log('Clicking Zamknij');
            await closeBtn.click();
            break;
         }
      }
    }
    
    console.log('Tutorial finished.');
    await page.waitForTimeout(2000);
    
  } catch (e) {
    console.log('Error interacting with tutorial:', e.message);
  }
  
  if (!crashed) {
    console.log('NO CRASH DETECTED!');
  }
  
  await browser.close();
})();
