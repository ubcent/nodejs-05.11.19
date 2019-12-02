const readline = require("readline");
const request = require("request");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const urlutils = require("url");

const getTranslate = word => {
  var params = urlutils.parse(
    "https://translate.yandex.net/api/v1.5/tr.json/translate?"
  );
  delete params.search;
  params.query = {
    key:
      "trnsl.1.1.20191125T231800Z.dc3c217871349aef.6a352ace9fa47661a74002b13b00538dac4252a2",
    lang: "en-ru",
    text: `${word}`
  };
  let currURL = urlutils.format(params);

  request.get(`${currURL}`, (err, res, body) => {
    if (!err && res.statusCode === 200) {
      console.log(JSON.parse(body).text.join());
    }
  });
};

rl.on("line", word => {
  if (word === "esc") {
    rl.close();
  } else {
    getTranslate(word);
  }
});

console.log("Введите слово для перевода[esc-выход]");
