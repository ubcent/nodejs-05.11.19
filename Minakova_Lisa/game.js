const readline = require("readline");
const fs = require("fs");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//состояние игры
let state = {};

const changeStatictics = value => {
  fs.readFile("statistics.json", "utf-8", (err, data) => {
    if (err) {
      throw err;
    } else {
      obj = JSON.parse(data);
      obj[value] += 1;
      json = JSON.stringify(obj);

      //перезаписываем новый json
      fs.writeFile("statistics.json", json, "utf-8", (err, data) => {
        if (err) {
          throw err;
        }
      });
    }
  });
};

new Promise((resolve, reject) => {
  rl.question("Выбери сторону монетки!\n[1-орел/2-решка]", answer => {
    if (Number(answer) === 1 || Number(answer) === 2) {
      resolve(answer);
    } else {
      reject("err");
    }
  });
})
  .then(
    answer => {
      console.log(`Ты поставил на ${answer}`);
      state.answer = answer;
      changeStatictics("numberGames");

      return new Promise(resolve => {
        setTimeout(() => {
          resolve(Math.floor(Math.random() * 2) + 1);
        }, 1000);
      });
    },
    err => {
      console.log("Выбрана неверная клавиша!");
    }
  )

  .then(coinSide => {
    if (state.answer) {
      if (coinSide === Number(state.answer)) {
        new Promise(() => {
          changeStatictics("numberWinnings");
          console.log(`Выпало ${coinSide} - ты выиграл!`);
        });
      } else {
        new Promise(() => {
          changeStatictics("numberLosses");
          console.log(`Выпало ${coinSide} - ты проиграл!`);
        });
      }
    }
  })
  .finally(() => {
    rl.pause();
  });
