/**
 *     Создать переводчик слов с английского на русский, который будет
 *   обрабатывать входящие GET запросы и возвращать ответы,
 *   полученные через API Яндекс.Переводчика. 
 **/
const clc = require('cli-color');
const request = require('request');
const { createInterface } = require('readline');
const COMMAND_EXIT = '-q';

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

class Translate {
    /** состояние приложения */
    state = {
        url: 'https://translate.yandex.net/api/v1.5/tr.json/translate',
        key: 'trnsl.1.1.20191123T035539Z.11f37bc35e92c80a.d6cf7aafb855a540ffc51a473ff508a5131eded3',
        lang: 'ru',
        text: ''
    };

    /** обновление состояния приложения */
    setState( value ) {
        this.state = { ...this.state, ...value };
    }

    /** вывод перевода в консоль */
    static print( translate ) {
        console.log( `Your word Translate as: ${ clc.yellow( translate ) }` );
    }
    
    /** данная функция обработчик, и его лучше делать стрелочной функцией ( чтобы не потерять контекст )*/
    handleResponse = (err, res) => {
        if ( err ) {
            return Translate.print( err );
        }
        const { text } = JSON.parse( res.body );
        return Translate.print( text );
    };
    
    /** функция которая запускает всю необходимую логику получения ответа от яндекса */
    getTranslate() {
        const { url , ...queryParams } = this.state;
        return request( {
            url, 
            qs: queryParams,
            headers: {
                'Content-Type': 'text/html; charset=utf-8'
            }
        }, this.handleResponse );
    }

    /** установка текста на перевод */
    setText( text ) {
        const fromRussian = /^[а-я-А-ЯёЁ]+$/g.test( text );
        this.setState({ 
            text,
            lang: fromRussian ? 'ru-en' : 'en-ru'
        });
        return this;
    }
}

const translate = new Translate();
console.log( clc.yellow( 'Type some word to translate\n Or type: "-q" to exit' ) );
rl.on('line', ( cmd ) => {
    if ( cmd === COMMAND_EXIT ) {
      return rl.close();
    }
    translate
        .setText( cmd )
        .getTranslate( cmd );
});