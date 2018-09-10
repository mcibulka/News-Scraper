const express = require("express");
const mongojs = require("mongojs");

const app = express();

const cheerio = require("cheerio");
const request = require("request");
const scrapeURL = "https://www.thestar.com";

const databaseURL = "scraper";
const collections = ["scrapedData"];

const db = mongojs(databaseURL, collections);
db.on("error", error => {
  console.log("Database Error: ", error);
});


app.get("/", (req, res) => {
  res.send("News Scraper");
});


app.get("/scrape", (req, res) => {
  request(scrapeURL, (error, response, html) => {
    const $ = cheerio.load(html);

    let results = [];

    $("div", ".small-story--small").each((i, element) => {
      const articleDiv = $(element).html();
      const headline = $(articleDiv).find(".story__headline").text();
      const abstract = $(articleDiv).find(".story__abstract").text();
      const link = scrapeURL + $(articleDiv).find("a").attr("href");

      // skip any items that are missing a headline or abstract
      if (headline && abstract) {
        results.push({
          headline: headline,
          abstract: abstract,
          link: link
        });
      }
    });

    results.forEach(result => {
      console.log(`${result.headline.toUpperCase()}\n${result.abstract}\n${result.link}\n\n`);
    });
  });
});


app.listen(3000, () => {
  console.log("App running on port 3000!");
});