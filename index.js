import express from 'express';

import amazonRoutes from './src/routes/amazonRoutes.js';
import { scrapeReviews } from './src/puppeteer/crawler.js';
import { configDotenv } from 'dotenv';

configDotenv();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const url = 'https://bot.sannysoft.com/';
// const url = 'https://2717recovery.com/products/recovery-cream';
// const url = 'https://www.amazon.in/crocs-Classic-Walnut-Clog-205413-267/dp/B0BQHTP848';
// scrapeReviews(url);


app.use('/api/amazon', amazonRoutes);
// app.use('/api/twoSevenOneSeven', twoSevenOneSevenRoutes);
// app.use('/api/bhumi', bhumiRoutes);
// app.use('/api/lyfefuel', lyfefuelRoutes);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
