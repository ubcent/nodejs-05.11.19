const fs = require('fs');
const minimist = require('minimist');
const argv = minimist(process.argv.slice(2));
const logFile = argv.log ? `./HeadOrTail/${argv.log}` : './HeadOrTail/logs.txt';
const { promisify } = require('util');

const promisifiedReadFile = promisify(fs.readFile);

promisifiedReadFile(logFile, 'utf8')
  .then((data) => {
    const logData = data.trim().split('\n');

    const total = logData.length;
    const wins = logData.filter(item => item === 'success').length;
    const fails = logData.filter(item => item === 'fail').length;
    const maxWinsInRow = getMaxInRow('success', logData);
    const maxFailsInRow = getMaxInRow('fail', logData);
    const winstPercent = Math.floor(wins * 100 / total);

    console.log(`Всего игр: ${total}`);
    console.log(`Побед: ${wins}`);
    console.log(`Поражений: ${fails}`);
    console.log(`Максимальное кол-во побед подряд: ${maxWinsInRow}`);
    console.log(`Максимальное кол-во поражений подряд: ${maxFailsInRow}`);
    console.log(`Успешность: ${winstPercent}%`);
  });

function getMaxInRow(entity, arr) {
  let i = 0;
  let result = 0;

  arr.forEach((item) => {
    if (item === entity) {
      i++;
    } else {
      result = i > result
        ? i
        : result;
      i = 0;
    }
  })
  
  return result;
}