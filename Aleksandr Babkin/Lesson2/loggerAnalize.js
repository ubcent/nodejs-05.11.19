const fs = require('fs');

fs.readFile('info.log', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return
    }

    var countSession = 0;
    var countSessionWin = 0;
    var countSessionLose = 0;

    var posSession = data.indexOf('Старт новой партии');
    var posSessionWin = data.indexOf('Вы выиграли!');
    var posSessionLose = data.indexOf('Вы проиграли!');

    while (posSession !== -1) {
        countSession++;
        posSession = data.indexOf('Старт новой партии', posSession + 1);
    };
    while (posSessionWin !== -1) {
        countSessionWin++;
        posSessionWin = data.indexOf('Вы выиграли!', posSessionWin + 1);
    };
    while (posSessionLose !== -1) {
        countSessionLose++;
        posSessionLose = data.indexOf('Вы проиграли!', posSessionLose + 1);
    };
    console.log('Общее количество сыгранных партий - ' + countSession);
    console.log('Общее количество выигранных партий - ' + countSessionWin);
    console.log('Общее количество проигрышных партий - ' + countSessionLose);
})