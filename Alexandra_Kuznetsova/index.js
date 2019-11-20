var randNumber = new Number(Math.random() * 1).toFixed(0);

var readline = require('readline');
var fs = require('fs');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Enter: 0 - HEAD, 1 - TAIL, e - exit, s - statistics, c - clear');

rl.on('line', function (cmd) {
    if (cmd==='e') {
        console.log('You left the game');
        rl.close();
    } else if (cmd==='s') {
        console.log('Statistics of the Game');
        var stc = require('./stc');
        rl.close();
    } else if (cmd==='c') {
        var stc = require('./clr');
        rl.close();
    } else {
        var result;
        console.log('You typed: '+cmd+', computer make: '+randNumber);
        if ((cmd==='0') || (cmd==='1')) {
            if (cmd===randNumber) {
                console.log('You won!');
                result = 'win,';
                rl.close();
            } else {
                console.log('You lose..');
                result = 'loss,';
                rl.close();
            }
            fs.appendFile('log.txt', result, function (err) {
                if (err) {
                    throw err;
                }
            });
        }
        else {
            console.log('You entered an invalid value');
            rl.close();
        }
    }
    
});