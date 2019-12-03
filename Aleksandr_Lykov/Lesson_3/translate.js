const sRequest = require('request-promise')
const inquirer = require('inquirer')

let questions = [
    {
        type: 'input',
        name: 'word',
        message: "Enter the word to be translated (in English):",
    },
    {
        type: 'input',
        name: 'lang',
        message: "Enter the language you are going to translate into (two letters):",
    },
]
inquirer.prompt(questions).then(answers => {
    const options = {
        method: 'GET',
        uri: `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20191127T142748Z.41f86021f52f29b8.808051e3d6ad3017ecefef81ae91b58e098be515&text=${answers['word']}&lang=en-${answers['lang']}&format=plain&options=1`,
        json: true,
    }
    sRequest(options).then(res => console.log(`\nTranslation: ${res.text[0]}\n`)).catch(err => console.log(err))
})