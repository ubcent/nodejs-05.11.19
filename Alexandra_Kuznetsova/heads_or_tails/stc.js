const fs = require('fs');

/** чтение файла статистики */
fs.readFile('log.txt', 'utf8', function (err, data) {
    if (err) {
        console.log('No games have been played yet'); /** сообщение об ошибке */
        return;
    }

    let mas = data.split(','); /** получаем массив данных */
    let games = mas.length - 1;
    let win = 0;
    let loss = 0;
    let maxWin = 0;
    let maxLoss = 0
    let i = 0;
    let j = 0;

    /** проходимся по массиву данных и считаем выигрыши и проигрыши */
    for (let key in mas) {
        if (mas[key] === 'win') {
            win++;
            i++;
        } else {
            if (i >= maxWin) {
                maxWin = i;
                i = 0;
            }
            i = 0;
        }
        if (mas[key] === 'loss') {
            loss++;
            j++;
        } else {
            if (j >= maxLoss) {
                maxLoss = j;
                j = 0;
            }
            j = 0;
        }
    }

    /** выводим результаты в консоль */
    console.log('All games: ' + games + '\n' +
                'Winning games: ' + win + '\n' +
                'Losing games: ' + loss + '\n' +
                'Win-loss ratio: ' + win + ':' + loss + '\n' +
                'Max number of win in a row: ' + maxWin + '\n' +
                'Max number of loss in a row: ' + maxLoss);
});