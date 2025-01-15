// const puppeteer = require('puppeteer-extra')

// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// puppeteer.use(StealthPlugin())

import puppeteer from 'puppeteer';
import { log } from 'console';
import { configDotenv } from 'dotenv';

configDotenv();

export const scrapeReviews = async (url) => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(url);
    let button;

    button = await page.$('[data-hook="see-all-reviews-link-foot"]');

    if (button) {
        await button.click();
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
    } else {
        console.log('Element not found.');
    }

    // await page.waitForSelector('#ap_email_login');
    await page.type('#ap_email_login', '<email>', {delay: 100});
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    
    // await page.waitForSelector('#ap_password');
    await page.type('#ap_password', '<password>', {delay: 100});
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });



    let reviews = [];
    for (let i = 0; i < 2; i++) {
        let currReviews = await page.evaluate(() => {
            const reviewsArray = [];
            const reviewElements = document.querySelectorAll('.aok-relative');
            reviewElements.forEach((reviewElement) => {
                const titleElement = reviewElement.querySelectorAll('a[data-hook="review-title"] > span')[1];
                const bodyElement = reviewElement.querySelector('span[data-hook="review-body"] span');
                const ratingElement = reviewElement.querySelector('i[data-hook="review-star-rating"] span');
                const reviewerElement = reviewElement.querySelector('span.a-profile-name');
        
                const title = titleElement ? titleElement.innerText.trim() : null;
                const body = bodyElement ? bodyElement.innerText.trim() : null;
                const rating = ratingElement ? parseFloat(ratingElement.innerText.split(' ')[0]) : null;
                const reviewer = reviewerElement ? reviewerElement.innerText.trim() : null;
        
                reviewsArray.push({
                    title,
                    body,
                    rating,
                    reviewer,
                });
            });
        
            return reviewsArray.slice(0, 10);
        });

        reviews = reviews.concat(currReviews);

        const nextPage = await page.$('li.a-last a');
        if (nextPage) {
            await Promise.all([
                nextPage.click(),
                page.waitForNavigation({ waitUntil: 'networkidle0' })
            ]);
        } else {
            break;
        }
    }


    console.log(reviews);
    console.log(reviews.length);
    


    // can be used to pause on the current page
    await page.waitForSelector('#asdf');

    await browser.close();
};
