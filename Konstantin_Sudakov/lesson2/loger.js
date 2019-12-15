
//Модули для работы
const fs = require('fs');
const { promisify } = require('util');
const promisifiedReadFile = promisify(fs.readFile);
const minimist = require('minimist');
const argv = minimist(process.argv.splice(2));

//переменные для работы
let fileForWrite = argv._[0];
let wins = 0;
let losing = 0;
let games = 0;
let winsMax = 0;
let losingMax = 0;

//мои функции для вычислений
const MakeStatistics = (data) => {
    const arr = data.split("");
    console.log(arr);
    for (let i = 0; i<arr.length; i++) {
        if (arr[i] == 0) {
            losing++;
        }
        if (arr[i] == 1) {
           wins++;
        }
        games++;
    }
    getMax(data, '1');
    getMax(data, '0');
    getStatistics();

};
const getMax = (arr, index) => {
    const arr2 = arr.split(index);
    for(let i = 0 ; i < arr2.length; i++) {
        let maxArr = arr2[i].split("");
        console.log(maxArr);
        if (index === '1') {
            if (maxArr.length > losingMax) {
                losingMax = maxArr.length
            }
        } else if (index = '0') {
            if (maxArr.length > winsMax) {
                winsMax = maxArr.length
            }
        }

    }
};
const getStatistics = () => {
    const a = wins/games*100;
    console.log(`Вы сыграли ${games} партий`);
    console.log(`Выйграли ${wins} партий`);
    console.log(`Проиграли ${losing} партий`);
    console.log(`Процент побед ${Math.floor(a)}%`);
    console.log(`Самая длинная проигрышная серия ${losingMax}`);
    console.log(`Самая длинная выйграшная серия ${winsMax}`);
};

//Сам рабочий код

if (fileForWrite === undefined) {
    fileForWrite = 'statistics.json';
}
promisifiedReadFile(fileForWrite, 'utf8')
    .then((data) => {
        MakeStatistics(data);
    })
    .catch((err) => {
        console.log(err);
    });



// fs.readFile('statistics.json', 'utf-8', (err, data) => {
//     if (err) {
//         console.log(err);
//     } else {
//
//         console.log(data.split(""));
//     }
// });