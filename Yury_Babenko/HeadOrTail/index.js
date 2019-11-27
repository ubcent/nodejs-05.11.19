const minimist = require('minimist');
const readline = require('readline');
const Spinner = require('cli-spinner').Spinner;
const fs = require('fs');

const argv = minimist(process.argv.slice(2));
const logFile = argv.log ? `./HeadOrTail/${argv.log}` : './HeadOrTail/logs.txt';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const coin = new Spinner('Подбрасываем монетку... %s');
coin.setSpinnerString('|/-\\');

new Promise((resolve, reject) => {
  rl.question('Выберите сторону (1 - Орел, 2 - Решка): ', (choice) => {
    if (+choice === 1 || +choice === 2) {
      rl.close();
      resolve({ choice });
    } else {
      reject('Неверный выбор!')
    }
  });
}).then(
  (result) => {
    return new Promise((resolve) => {
      coin.start();
      setTimeout(() => {
        coin.stop();
        result.coinResult = tossCoin();
        resolve(result)
      }, 1000);
    });
  (err) => {
    console.log(err);
  }

}).then((result) => {
  const isWon = +result.choice === +result.coinResult.value;
  console.log(` Выпало: ${result.coinResult.text}`);
  console.log(isWon ? 'Вы выиграли!' : 'Вы проиграли :(');

  fs.access(logFile, fs.F_OK, (err) => {
    if (err) {
      console.error(err)
      return
    }
  
    fs.appendFile(logFile, isWon ? 'success\n' : 'fail\n', (err) => {
      if (err) throw err;
    })
  })
})

function tossCoin() {
  const result = Math.floor(Math.random() * 2) + 1;
  return result === 1
    ? { text: 'Орел', value: 1 }
    : { text: 'Решка', value: 2 };
}