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
                                reject(err);
                            }
                        }
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }
            else {
                reject('Файл не существует');
            }
        });
    
}).then(data => {
    if (data.games) {
        makeStatistic(data.games);
    }
    else {
        console.log("Файл пустой");
    }
})
.catch(err => {
    console.log(err);
})

function makeStatistic(games){
    count = games.length;
    countWin = games.filter(game => game.result === true).length;
    countNotWin = games.filter(game => game.result === false).length;
    percentWin = Math.round(countWin / count * 100);

    countWinInRow = 0;
    countNotWinInRow = 0;

    if (games.length > 0)
    {
        for (let i = 0; i < games.length; i++) {
            if (i === 0 || games[i-1].result !== games[i].result)
            {
                temp =  games[i].result;
                tempCount = 1;
            }
            else
            {
                tempCount++;
            }
            
            if (temp === true && tempCount > countWinInRow) {
                countWinInRow = tempCount;
            }
            else if (temp === false && tempCount > countNotWinInRow) {
                countNotWinInRow = tempCount;
            }
        }
    }

    console.log(`Вы сыграли ${count} партий`);
    console.log(`Выйграли ${countWin} партий`);
    console.log(`Проиграли ${countNotWin} партий`);
    console.log(`Процент побед ${percentWin}%`);
    console.log(`Самая длинная выйграшная серия ${countWinInRow}`);
    console.log(`Самая длинная проигрышная серия ${countNotWinInRow}`);
}