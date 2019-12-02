const minimist = require('minimist');
const readline = require('readline');
const fs = require('fs');
const { promisify } = require('util');
const existFile = promisify(fs.exists);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const argv = minimist(process.argv.slice(2));
console.log(argv);

const fileName = argv.f !== undefined ? argv.f : "log.json";
console.log(`Файл для логов - ${fileName}`);


console.log("Введите число 1 или 2. Для выхода q");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.on('line', (cmd) => {
    if(cmd === 'q') {
        rl.close();
        return;
    }

    if (cmd !== '1' && cmd !== '2') {
        console.log('Некорректный ввод.');
        return;
    }

    const guessedValue = getRandomInt(1,2);
    const inputedValue = +cmd;

    const result = (guessedValue === inputedValue);
    if (result) {
        console.log("Вы угадали!");
    }
    else {
        console.log("Вы не угадали!");
    }

    writeResult(fileName, guessedValue, inputedValue, result);
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function writeResult (fileName, guessedValue, inputedValue, result) {
    existFile(fileName).then(exist => {
            return new Promise((resolve, reject) => {
                let result = {};
                if (exist) {
                    // файл существует, прочитаем его.
                    readFile(fileName, 'utf8')
                        .then(data => {
                            // успех
                            console.log('Файл прочитан')
                            if (data.length > 0) {
                                try {
                                    result = JSON.parse(data);
                                }
                                catch (err){
                                    console.log('Не разобрать файл');
                                    reject(err);
                                }
                            }
                            resolve(result);
                        })
                        .catch(err => {
                            // не удалось прочитать файл
                            console.log('Не удалось прочитать файл');
                            reject(err);
                        });
                }
                else {
                    // вернем пустой объект
                    console.log('Файла не существовало');
                    resolve(result);
                }
            });
        
    }).then(data => {
        if (!data.games) {
            data.games = [];
        }
        data.games.push({
            guessedValue: guessedValue,
            inputedValue: inputedValue,
            result: result
        });
        return writeFile(fileName, JSON.stringify(data), 'utf8');
    
    }).then(() => {
        console.log('Файл успешно сохранен');
    })
    .catch(err => {
        console.log(err);
    })
}