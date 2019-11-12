const fs = require('fs');
const { promisify } = require('util');

// fs.readFile('./package.json', 'utf8', (err, data) => {
//     if(err) {
//         throw err;
//     }

//     console.log(data);
// });

// const data = fs.readFileSync('./package.json', 'utf8');
// console.log(data);

const promisifiedReadFile = promisify(fs.readFile);

promisifiedReadFile('./package.json', 'utf8')
    .then((data) => {
        console.log(data);
    })