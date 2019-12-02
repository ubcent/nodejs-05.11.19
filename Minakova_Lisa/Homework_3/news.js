const request = require("request");
const cheerio = require("cheerio");
const ansi = require("ansi");
const cursor = ansi(process.stdout);
const url = "https://www.newscientist.com/";

const drawString = (title, date, author, newsText) => {
  cursor
    .write("\n\n\n")
    .white()
    .bg.blue()
    .bold()
    .write(`${title}`)
    .write("\n")
    .reset()
    .bg.reset();
  cursor
    .blue()
    .write(`${date}`)
    .reset();
  cursor
    .grey()
    .write(`${author}`)
    .write("\n")
    .reset();
  cursor.write(`${newsText}`).reset();

  cursor
    .grey()
    .write("\n")
    .write(
      "___________________________________________________________________________"
    )
    .reset()
    .write("\n");
};

const getInformation = (
  url,
  titleSelector,
  dateSelector,
  authorSelector,
  newsTextSelector
) => {
  const $ = cheerio.load(url);
  let title = $(titleSelector).text();
  let date = $(dateSelector).text();
  let author = $(authorSelector).text();

  let newsText = $(newsTextSelector)
    .map((i, el) => {
      return $(el).text();
    })
    .get()
    .join("\n ");

  drawString(title, date, author, newsText);
};

request(url, (err, res, body) => {
  if (!err && res.statusCode === 200) {
    const $ = cheerio.load(body);
    let newsLinkList = $(".card__link")
      .map((i, el) => {
        return $(el).attr("href");
      })
      .slice(0, 10);

    $(newsLinkList).each((i, el) => {
      request(url + el, (err, res, body) => {
        if (!err && res.statusCode === 200) {
          getInformation(
            body,
            ".article-title",
            ".published-date",
            "a.author",
            ".article-content p:not(.credit):not(.author-byline):not(.references):not(.font-sans-serif-xxs--bold):not(:has(strong))"
          );
        }
      });
    });
  }
});
