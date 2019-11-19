const yargs = require('yargs');
const modules = require('./modules');

yargs.command({
    command: 'toss',
    describe: 'Подбросить монетку',
    handler() {
        modules.toss();
    }
})
yargs.parse();