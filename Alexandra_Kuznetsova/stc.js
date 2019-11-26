var fs = require('fs');

fs.readFile('log.txt', 'utf8', function (err, data) {
    if (err) {
        console.log('No games have been played yet');
        return;
    }
    var mas = data.split(',');
    var games = mas.length - 1;

    var win = 0, loss = 0, maxWin = 0, maxLoss = 0, i = 0, j = 0;

    for (var key in mas) {
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

    console.log('All games: ' + games + '\n' +
                'Winning games: ' + win + '\n' +
                'Losing games: ' + loss + '\n' +
                'Win-loss ratio: ' + win + ':' + loss + '\n' +
                "Max number of win in a row: " + maxWin + '\n' +
                "Max number of loss in a row: " + maxLoss);
});