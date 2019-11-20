const { red, bold, reset } = require("cli-color");
const { radar } = require('chalk-animation');
 
console.log(red(bold.italic.underline('Acquaintance with Node.js')));
radar('-------------------------', 1);

setTimeout(() => {
    // process.stdout.write(reset);
    process.exit(0);
}, 3000);