const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const statisticGame = path.join(__dirname, 'statistic.json');
const monet = path.join(__dirname, 'monet.json');

const toss = () => {
    const resultToss = Math.floor(Math.random() * (2 - 1 + 1) + 1);
    fs.writeFile(monet, JSON.stringify(resultToss, err => {
        if (err) {
            throw new Error(err);
        }
    }));
    console.log(chalk.green('Монетка подброшена'));
}

module.exports = {
    toss,
}