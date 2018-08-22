const cheerio = require("cheerio");
const request = require("request");

const scrapeURL = "https://www.thestar.com";

console.log("\n\n\t\t\t\t\tNews Scraper" +
  "\n\t\t\t\t\t============\n\n");

request(scrapeURL, function (error, response, html) {
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