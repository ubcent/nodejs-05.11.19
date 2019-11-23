var fs = require('fs');

fs.unlink('log.txt', function (err) {
    if (err) {
        console.log('No games have been played yet');
    } else {
        console.log('Cleaning completed successfully');
    }
});