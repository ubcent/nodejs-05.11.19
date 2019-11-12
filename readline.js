// cli, prompt

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.on('line', (cmd) => {
    console.log(`You typed: ${cmd}`);

    if(cmd === 'exit') {
        rl.close();
    }
});