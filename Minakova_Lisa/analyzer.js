const readline = require("readline");
const fs = require("fs");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const getStatistics = () => {
  fs.readFile("statistics.json", "utf-8", (err, data) => {
    if (err) {
      throw err;
    } else {
      obj = JSON.parse(data);
      console.log(
        `Общая игровая статистика:
          всего сыграно: ${obj.numberGames},
          выиграно:  ${obj.numberWinnings},
          проиграно:  ${obj.numberLosses},
          `
      );
      rl.pause();
    }
  });
};

getStatistics();
