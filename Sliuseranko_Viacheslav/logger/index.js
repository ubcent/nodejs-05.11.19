/*
        Сделать программу-анализатор игровых логов. В качестве
    аргумента программа получает путь к файлу. Выведите игровую
    статистику: общее количество партий, количество выигранных /
    проигранных партий и их соотношение, максимальное число побед /
    проигрышей подряд
*/
const fs = require('fs');
const { promisify } = require('util');
const { LOG_FILE, USER, NO_WINNERS } = require('../blackjackGame/constants');
const { addValueIfNeed } = require('../helpers');
const { parse, stringify } = JSON;
const readFilePromisify = promisify(fs.readFile);

class Logger {
    handleError = (err) => {
        if ( !err ) {
           return;
        }
        console.log(err)
    };

    /** записать в лог */
    writeLog(file, content, callBack = null ) {
       fs.readFile(file, 'utf-8', (err, data) => {
            const fileNotFound = (err && err.code === 'ENOENT');
            let logValue = [];

            if ( !fileNotFound ) {
                const logData = parse(data);
                logValue = [...logData, content ];
            } else {
                logValue = [ content ];
            }
            fs.writeFile(file, stringify(logValue), callBack || this.handleError);
        });
    }
    /** прочитать лог файл */
    static readLog(file) {
        return readFilePromisify(file, 'utf-8');
    }
    /** запустить анализ лог файла */
    analyze() {
        Logger.readLog(LOG_FILE)
            .then(data => {
                const stats = parse(data);
                this.showStatistics(stats);
            });
    }
    /** статистика игры */
    showStatistics(data) {
        const statistics = this.calculateStatistics(data);
        const { wins, loses, games } = statistics;

        console.log( {
            ...statistics,
            winPercent: ( wins / games ) * 100,
            losePercent: ( loses / games ) * 100,
        })
    }
    /** заполнение данных статистики */
    calculateStatistics = ( data ) => {
        let maxWin = 0, maxLose = 0, winTricks = 0, loseTricks = 0;

        const statistics = data.reduce(( acc, result ) => {
            let { games, wins, draws, loses } = acc;
     
            const isDraw = ( result === NO_WINNERS );
            const isWin = ( result === USER );
            /** подсчет колличества побед подряд побед\проигрышей*/
            maxWin = addValueIfNeed( isWin, maxWin, 0 );
            maxLose = addValueIfNeed( !isWin && !isDraw, maxLose, 0 );
            /** сохранение максимального колличества побед\проигрышей */
            winTricks = maxWin > winTricks ? maxWin : winTricks;
            loseTricks = maxLose > loseTricks ? maxLose : loseTricks;

            return {
                prevWinner: result,
                games: ++games,
                wins: addValueIfNeed( isWin, wins ),
                loses: addValueIfNeed( !isWin && !isDraw, loses ),
                draws: addValueIfNeed( isDraw, draws ),
            };
        }, { games: 0, wins: 0, draws: 0, loses: 0, prevWinner: null });

        return { ...statistics, winTricks, loseTricks };
    }
}

module.exports = {
    Logger: new Logger()
};