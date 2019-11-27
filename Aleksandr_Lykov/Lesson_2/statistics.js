const minimist = require('minimist');
const fs = require('fs')
const path = require('path')

const argv = minimist(process.argv.slice(2), {
    string: 'file',
    alias: { f: 'file', }
})

if(!argv.f) argv.f = 'log.txt'
fs.readFile(path.normalize(`./Aleksandr_Lykov/${argv.f}`), 'utf-8', (err, file) => {
    let count = 0, max_attempts = 0, total_attempts = 0, attempts = 0
    if(err) return console.error(err)
    const lines = file.split('\n')
    for(let line of lines) {
        line.includes('Move') && total_attempts++
        if(line.includes('attempts')) {
            attempts = line.slice(line.indexOf('attempts')+9)
            max_attempts < attempts ? max_attempts = attempts : max_attempts
            count++
        }
    }
    console.log(`================================\nNumber of games: ${count}\nTotal attempts in all games: ${total_attempts}\nGame with the maximum number of attempts: ${max_attempts}\n================================`)
})