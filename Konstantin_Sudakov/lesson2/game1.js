const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const fs = require('fs');
const cli_color = require('cli-color');
const minimist = require('minimist');
const argv = minimist(process.argv.splice(2));

let fileForWrite = argv._[0];
console.log(fileForWrite);


console.log(cli_color.blue('Игра орел и решка'));
console.log(cli_color.red('Компьтер загадывает либо орел, либо решка'));
console.log(cli_color.yellow('Вы должны отгадать что он загадал'));
console.log(cli_color.blue('0 - это решка 1 - это орел'));

const getRandomNumber = () => {return Math.floor(Math.random() * 2)};
const writeStatistics = (data) => {
    fs.appendFile(fileForWrite, data, 'utf8', (err) => {
        if (err) {
            console.log(err);
        }
    });
};

if (fileForWrite === undefined) {
    fileForWrite = 'statistics.json';
}

rl.on('line', (cmd) => {
    if (+cmd === 0 || +cmd === 1 ) {
        if(+cmd === getRandomNumber()) {
            console.log(cli_color.green('Ого, вы угадали!'));
            console.log(`Если больше не хотите играть введите ${cli_color.red('q')}, если хотите продолжить,то попробуйте угадать еще раз`);
            writeStatistics('1');

        } else {
            console.log(cli_color.red('Не угадали'));
            writeStatistics('0');
        }
    } else {
        console.log(cli_color.red('Некоректный ввод'));
    }
    if (cmd === 'q') {
        rl.close();
    }
});

