import express from 'express';
import { scrapeReviews } from '../puppeteer/crawlAmazon.js';
import { log } from 'console';

const router = express.Router();

router.use(express.json());

router.get('/reviews', (req, res) => {
    const url = req.query.url;

    const reviews = scrapeReviews(url);

    res.json(reviews);
});

export default router;