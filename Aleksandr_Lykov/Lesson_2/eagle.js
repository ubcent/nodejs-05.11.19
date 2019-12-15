const minimist = require('minimist');
const readline = require('readline')
const fs = require('fs')
const path = require('path')

const argv = minimist(process.argv.slice(2), {
    string: 'file',
    alias: { f: 'file', }
})
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

if(!argv.f) argv.f = 'log.txt'
fs.closeSync(fs.openSync(`./Aleksandr_Lykov/${argv.f}`, 'a+'))

const question = (i) => {
    return new Promise( res => rl.question(`What's your choice (Орел - 0 or Решка - 1)? - `, choice => {
        let coin = Math.floor(Math.random() * 2);
        fs.appendFile(path.normalize(`./Aleksandr_Lykov/${argv.f}`),`Move ${i}. Your choice: ${choice}.\n  Coin throw result: ${coin}\n\n`, err => { return })
        if(coin == choice)  { console.log('Вы выиграли!!!')
            fs.appendFile(path.normalize(`./Aleksandr_Lykov/${argv.f}`),`Number of attempts: ${i}\n----------------\n\n`, err => { return })
            res(true) }
            else { console.log('Вы проиграли!!!'); res(false) }
}))}

const main_questions = async () => {
    for(let i=1; ; i++) {
        let answer = await question(i)
        if(answer) { rl.close(); return }
    }
}
main_questions()