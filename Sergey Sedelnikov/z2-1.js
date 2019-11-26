const readline = require('readline');
const fs = require('fs');
const minimist = require('minimist');
const argv = minimist(process.argv.splice(2));

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var randomnum;
var file = argv._[0];

console.log('Добро пожаловать в орлянку!');
console.log('Введите 1 или 2. И пусть удача всегда будет на Вешей стороне.');

rl.on('line', function (num) {
    if((num !== '1')&&(num !== '2'))
        console.log('Введено некорректное значение, попробуйте снова.')
    else{
        randomnum = randomInteger(1,2); 
        
        if(num == randomnum){
            console.log('Вы победили! :)');
            if (file !== undefined) 
                writelog('1 ');
        }else{
            console.log('Вы проиграли! :(');
            if (file !== undefined) 
                writelog('-1 ');
        }
    }
});

function writelog(data){   
    fs.appendFile(file, data, 'utf8', (err) => {
        if (err) {
            console.log(err);
        }
    });
}
function randomInteger(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}