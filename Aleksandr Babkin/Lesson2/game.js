var readline = require('readline');
var log4js = require('log4js');
let oneOrZero;
let userValueResult;
const logger = log4js.getLogger();

log4js.configure({
    appenders: {
        everything: { type: 'file', filename: 'info.log' }
    },
    categories: {
        default: { appenders: ['everything'], level: 'debug' }
    }
});

function randomValuePromise() {
    return new Promise((resolve, reject) => {
        oneOrZero = Math.random() * 2;
        logger.debug('Старт новой партии');
        if (oneOrZero > 1) {
            oneOrZero = 2;
            logger.debug('Выпавшая сторона монеты = Решка(' + oneOrZero + ')');
            resolve(oneOrZero);
        } else {
            oneOrZero = 1;
            resolve(oneOrZero)
            logger.debug('Выпавшая сторона монеты = Орел(' + oneOrZero + ')');
        }
    })
}

function requestToUser() {
    return new Promise((resolve, reject) => {
        let requestToUser = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false
        });
        requestToUser.question("Введите орел или решка: ", function (answer) {
            console.log("Вы выбрали:", answer);
            if (answer == "Решка" || answer == "решка") {
                userValueResult = 2;
                logger.debug('Выбор пользователя = ' + answer + '(' + userValueResult + ')');
                resolve(userValueResult);
            };
            if (answer == "Орел" || answer == "орел") {
                userValueResult = 1;
                logger.debug('Выбор пользователя = ' + answer+ '(' + userValueResult + ')');
                resolve(userValueResult);
            } else {
                let reason = new Error("Сторона монеты не определена.");
                reject(reason);
            };
            requestToUser.close();
        });
    })
}

function gameHandler() {
    return new Promise((resolve, reject) => {
        if (oneOrZero == userValueResult) {
            resolve(console.log("Вы выиграли!"));
            logger.debug('Вы выиграли!');
        } else {
            resolve(console.log("Вы проиграли!"));
            logger.debug('Вы проиграли!');
        }
    })
}

function endOrContiniue() {
    let requestToUser = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    requestToUser.question("Продолжаем? (y или n)", function (answer) {
        if (answer == "y") {
            logger.debug('Перезапуск');
            return orelOrReshka();
        } else {
            console.log("До скорой встречи!");
            logger.debug('Выход из программы');
            process.exit(0);
        }
    })
}

function orelOrReshka() {
    randomValuePromise()
        .then(requestToUser)
        .catch(function (error) {
            console.log(error.message);
            logger.debug('Ошибка пользователя = ' + error.message);
        })
        .then(gameHandler)
        .then(endOrContiniue)
}

orelOrReshka();

