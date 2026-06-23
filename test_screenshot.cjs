const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  console.log('Navigating to http://localhost:5173/');
  await page.goto('http://localhost:5173/');
  
  console.log('Waiting 3 seconds...');
  await page.waitForTimeout(3000);
  
  console.log('Taking screenshot...');
  await page.screenshot({ path: 'screenshot.png' });
  
  const html = await page.content();
  console.log('HTML snippet:', html.substring(0, 500));
  
  const hasHelpBtn = await page.$('.desktop-help-btn');
  console.log('Has help btn?', !!hasHelpBtn);
  
  if (hasHelpBtn) {
    await hasHelpBtn.click();
    console.log('Clicked help button');
    await page.waitForTimeout(1000);
    
    // just click next multiple times
    for (let i = 0; i < 15; i++) {
      const nextBtn = await page.$('button:has-text("Dalej")');
      if (nextBtn) {
        console.log('Clicking Dalej');
        await nextBtn.click();
        await page.waitForTimeout(500);
      } else {
        const closeBtn = await page.$('button:has-text("Zamknij")');
        if (closeBtn) {
          console.log('Clicking Zamknij');
          await closeBtn.click();
          await page.waitForTimeout(1000);
          break;
        }
      }
    }
  }
  
  console.log('Waiting 2 seconds after tutorial...');
  await page.waitForTimeout(2000);
  console.log('Taking screenshot after tutorial...');
  await page.screenshot({ path: 'screenshot-after.png' });
  
  await browser.close();
})();
