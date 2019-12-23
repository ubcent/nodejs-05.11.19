const express = require("express");
const consolidate = require("consolidate");
const path = require("path");
const cheerio = require("cheerio");
const request = require("request");

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.engine("hbs", consolidate.handlebars);
app.set("view engine", "hbs");
app.set("views", path.resolve(__dirname, "views"));

const sourcesConfig = {
  soureces: [
    {
      name: "NewScientist",
      url: "https://www.newscientist.com/",
      link: ".card__link",
      title: ".article-title",
      date: ".published-date",
      author: "a.author",
      text:
        ".article-content p:not(.credit):not(.author-byline):not(.references):not(.font-sans-serif-xxs--bold):not(:has(strong))"
    }
  ]
};

//функция, которая достает нужную информацию
const getInformation = (
  url,
  titleSelector,
  dateSelector,
  authorSelector,
  newsTextSelector
) => {
  console.log("выдаем инфу");
  const $ = cheerio.load(url);

  let title = $(titleSelector)
    .map((i, el) => $(el).text())
    .get()
    .join();

  let date = $(dateSelector)
    .map((i, el) => $(el).text())
    .get()
    .join();

  let author = $(authorSelector)
    .map((i, el) => $(el).text())
    .get()
    .join();

  let newsText = $(newsTextSelector)
    .map((i, el) => $(el).text())
    .get()
    .join();

  console.log(newsText, date, author, title);

  let article = { newsText, date, author, title };
  return article;
};

const getNewsListPromise = (currCount, item) => {
  return new Promise((resolve, reject) => {
    const url = item.url;
    const link = item.link;
    const title = item.title;
    const date = item.date;
    const author = item.author;
    const text = item.text;

    request(url, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        const $ = cheerio.load(body);

        const newsLinkList = $(link)
          .map((i, el) => $(el).attr("href"))
          .slice(0, currCount);

        const pieces = [];
        $(newsLinkList).each((i, el) => {
          console.log("зашли в промис 2");
          pieces.push(
            new Promise((resolve, reject) => {
              request(url + el, (err, res, body) => {
                if (!err && res.statusCode === 200) {
                  const newsPieceText = getInformation(
                    body,
                    title,
                    date,
                    author,
                    text
                  );
                  resolve(newsPieceText);
                } else {
                  console.log(res.statusCode);
                }
              });
            })
          );
        });

        resolve(Promise.all(pieces));
      } else {
        console.log(res.statusCode);
      }
    });
  });
};

app.post("/settings", (req, resPost, next) => {
  const currCount = req.body.count;
  const currnName = req.body.name;

  const currItem = sourcesConfig.soureces.find(item => item.name === currnName);

  getNewsListPromise(currCount, currItem).then(newsPieceTextList => {
    console.log("render", newsPieceTextList);
    let printList = {
      count: currCount,
      header: currnName,
      articles: newsPieceTextList
    };

    resPost.render("news", printList);
  }, console.error);
});

app.get("/form", (req, res) => {
  res.render("form", sourcesConfig);
});

app.listen(4200, () => {
  console.log("started");
});
