"use strict";

let chromium = require("chrome-aws-lambda");

module.exports.snapshot = async (event, context, callback) => {
  try {
    let browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    let url = null;

    if (event.queryStringParameters && event.queryStringParameters.url) {
      url = decodeURIComponent(event.queryStringParameters.url);
      url = url.toLowerCase();

      if (!url.startsWith("http")) {
        url = "http://" + url;
      }
    }

    if (!url) {
      let err = new Error("Url must be provided");
      callback(err);
    }

    let page = await browser.newPage();
    let body = {};

    try {
      let response = await page.goto(url, { waitUntil: ["domcontentloaded","networkidle2"] });
      console.info(`pupetteer got a status of ${response.status()}`)
      
      let success = (response.status() < 400 || response.status() > 600);
      let screenshot = await page.screenshot({ encoding: "base64" });

      // got a screenshot but it may 404/500
      body = {
        url,
        image: screenshot,
        success,
      };
    } catch (e) {
      // couldnt get a screenshot so its failed.
      body = {
        url,
        image: undefined,
        success: false,
      };

    } finally {
      await page.close();
      await browser.close();

      console.info('body', body)

      callback(null, {
        statusCode: 200,
        body: JSON.stringify(body),
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "max-age=60",
        },
      });
    }
  } catch (error) {
    console.error('fatal error', error)
    callback(error);
  }
};
