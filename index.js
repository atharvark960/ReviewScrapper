import { scrapeReviews } from './src/puppeteer/crawler.js';
import { configDotenv } from 'dotenv';

configDotenv();

// const url = 'https://bot.sannysoft.com/';
const url = 'https://2717recovery.com/products/recovery-cream';
// const url = 'https://www.amazon.in/crocs-Classic-Walnut-Clog-205413-267/dp/B0BQHTP848';
scrapeReviews(url);