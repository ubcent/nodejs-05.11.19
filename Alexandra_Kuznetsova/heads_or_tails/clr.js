const fs = require('fs');

/** удаляем файл с логами */
fs.unlink('log.txt', function (err) {
    if (err) {
        console.log('No games have been played yet'); /** сообщение об ошибке, если файл отсутствует */
    } else {
        console.log('Cleaning completed successfully'); /** сообщение при успешном выполнении */
    }
});