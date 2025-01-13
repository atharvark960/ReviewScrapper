// const puppeteer = require('puppeteer-extra')

// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// puppeteer.use(StealthPlugin())

import puppeteer from 'puppeteer';
import { sliceHtmlToFitRequestLimit, sliceHtmlToFitTokenLimit } from './utils/puppeteerHelpers.js';
import { configDotenv } from 'dotenv';
// const fs = require('fs');
import * as fs from 'fs';
import { log } from 'console';
import { main } from '../agent/llamaAgent.js';

configDotenv();


const requestLimit = Number.parseInt(process.env.REQUEST_LIMIT);
const contextWindow = Number.parseInt(process.env.CONTEXT_WINDOW);
const tpm = Number.parseInt(process.env.TOKEN_PER_MIN);

export const scrapeReviews = async (url) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url);

  // extract the content of the body tag of the current products page
  const resultHandle = await page.evaluateHandle(() => document.body.innerHTML);
  let content = await resultHandle.jsonValue();
  await resultHandle.dispose();

  // check if the current domain is present in the cache already

  // slice the html content to fit the request limit
  content = sliceHtmlToFitRequestLimit(content, requestLimit);

  //  Chunk data to fit the context window
  

  // slice the body's initial content to reduce the number of tokens
  // content = sliceHtmlToFitTokenLimit(content, tokenLimit);

  // fs.writeFile('html.txt', content, () => log('file written successfully'));

  // pass the reduced body to the llama agent for dynamic css selector identification
  let agentResponse = main(content);
  

  // fetch the reviews of the product based on the css selectors



  // can be used to pause on the current page
  // await page.waitForSelector('#asdf');

  await browser.close();
};

// module.exports = scrapeReviews;