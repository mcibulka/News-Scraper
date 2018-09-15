const express = require("express");
const mongojs = require("mongojs");

const app = express();

const cheerio = require("cheerio");
const request = require("request");
const scrapeURL = "https://www.thestar.com";

const databaseURL = "scraperDB";
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

    $("div .story__body").each((i, element) => {
      // console.log(element);
      const headline = $(element).find(".story__headline").text();
      const abstract = $(element).find(".story__abstract").text();
      const link = scrapeURL + $(element).find("a").attr("href");

      // skip any items that are missing a headline or abstract
      if (headline && abstract) {
        db.scrapedData.insert({
          headline: headline,
          abstract: abstract,
          link: link
        },
          (error, inserted) => {
            if (error) {
              console.log(error);
            }
            else {
              console.log(inserted);
            }
          });
      }
    });
  });

  res.end();
});


app.listen(3000, () => {
  console.log("App running on port 3000!");
});