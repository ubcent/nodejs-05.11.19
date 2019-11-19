/** подбрасываем монетку */
const randNumber = new Number(Math.random() * 1).toFixed(0);

const readline = require('readline');
const fs = require('fs');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/** выводим сообщение в консоли с вариациями возможных действий */
console.log('Enter: 0 - HEAD, 1 - TAIL, e - exit, s - statistics, c - clear');

/** проверка на введенную команду в консоли */
rl.on('line', function (cmd) {
    if (cmd === 'e') {
        console.log('You left the game');
        rl.close();
    } else if (cmd === 's') {
        console.log('Statistics of the Game');
        let stc = require('./stc');
        rl.close();
    } else if (cmd === 'c') {
        let stc = require('./clr');
        rl.close();
    } else {
        let result; /** переменная для сбора результата исхода игры */
        console.log('You typed: ' + cmd + ', computer make: ' + randNumber);
        if ((cmd === '0') || (cmd === '1')) {
            if (cmd === randNumber) {
                console.log('You won!');
                result = 'win,';
                rl.close();
            } else {
                console.log('You lose..');
                result = 'loss,';
                rl.close();
            }
            fs.appendFile('log.txt', result, function (err) { /** запись результатов файл */
                if (err) {
                    throw err;
                }
            });
        }
        else {
            console.log('You entered an invalid value'); /** сообщение об ошибке при некорректном вводе */
            rl.close();
        }
    }
    
});