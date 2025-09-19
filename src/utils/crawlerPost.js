require('module-alias/register');
const cloudinary = require('@/configs/cloudinary');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

puppeteer.use(StealthPlugin());

(async () => {
  const downloadPath = 'D:/tiktok-video';

  // Tạo thư mục nếu chưa có
  if (!fs.existsSync(downloadPath)) {
    fs.mkdirSync(downloadPath, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  }); // headless: false để bạn thấy được trình duyệt
  const page = await browser.newPage();

  await page.goto('https://www.tiktok.com/explore', {
    waitUntil: 'domcontentloaded',
  });
  await page.wait('div[data-e2e="explore-item-list"]');
  const phần tử cần lấy link = div[data-e2e="explore-item"] a
  await new Promise((resolve) => setTimeout(resolve, 600000));

  await browser.close();
})();
