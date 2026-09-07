import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/root/.gemini/antigravity-cli/brain/7b7bfdf7-562a-4266-9c50-e95e23afaa7d';

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process',
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    deviceScaleFactor: 1.5,
  });

  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173 ...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });

  console.log('Waiting for search results and color extraction...');
  // Wait for track cards to appear
  await page.waitForSelector('text=Search Results', { timeout: 15000 });
  await page.waitForTimeout(3000); // Allow liquid animations and fast-average-color to render

  const screenshot1 = path.join(ARTIFACT_DIR, 'aura_coldplay_search.png');
  console.log(`Saving search screenshot to ${screenshot1}...`);
  await page.screenshot({ path: screenshot1, fullPage: false });

  // Click on the first search card or center cover to trigger play state
  console.log('Triggering track playback...');
  const firstCard = await page.$('.glass-card');
  if (firstCard) {
    await firstCard.click();
    await page.waitForTimeout(2500); // Allow mesh gradient transition & glow to animate
  }

  const screenshot2 = path.join(ARTIFACT_DIR, 'aura_coldplay_playing.png');
  console.log(`Saving playback screenshot to ${screenshot2}...`);
  await page.screenshot({ path: screenshot2, fullPage: false });

  await browser.close();
  console.log('Screenshots completed successfully!');
}

run().catch((err) => {
  console.error('Screenshot script error:', err);
  process.exit(1);
});
