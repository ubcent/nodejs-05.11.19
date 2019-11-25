/**
 *  1) Создать программу для получения информации о последних
 *  новостей с выбранного вами сайта в структурированном виде
 **/
const clc = require('cli-color');
const request = require('request');
const Cheerio = require('cheerio');
const { createServer } = require('http');

/** порт нашего приложения */
const PORT = 3000;
/** url адресс нашего приложения */
const SERVER_URL = 'http://localhost';
const CODE_OK = 200;
/** url адресс сайта с новостями */
const PARSE_URL = 'https://jsfeeds.com';
/** константы для парсинга данных */
const MAIN_SELECTOR = '.article_body .row'; 
const PARAMS_SELECTOR = [
    { selector: 'h3 a', key: 'title' },
    { selector: '.col-md-6 a>img', key: 'img'},
    { selector: '.col-md-18', key: 'body' },
];

/** Класс парсер */
class Parser extends Cheerio {
    static IMG = 'img';
    static STYLES = {
        containerStyle: 'display: flex; border: 6px solid #ddd; margin: 10px;',
        imgStyle: 'width: 30%; height: 30%;',
        contentStyle: 'padding: 10px;'
    };

    constructor( html, mainSelector, params ) {
        super();
        /** Вызываем метод родителя */
        this.html = Parser.load(html);
        this.mainSelector = mainSelector;
        this.params = params;
    }

   /** получение готовой html разметки с новостями */
    getNews = () => this.buildFeedElement().join('');

    /** метод парсинга и сбора новостей по селекторам */
    parseNews = () => {
        let feeds = {};
        const { params, mainSelector } = this;
        const arrayOfSelectors = params && Array.isArray( params ) ? params: [];
        /** проходим по всем элементам массива с доп селекторами, и собираем данные*/
        arrayOfSelectors.forEach( ({ key, selector }) => {
            const itemSelector = `${ mainSelector } ${ selector }`;
            feeds = this.collectNewsData( feeds, key, itemSelector );
        });
        /** отдаем только новости */
        return Object.values( feeds );
    };
     
    /** метод получение данных по селекторам */
    collectNewsData( feeds, key, selector ) {
        const { html } = this;
        const { IMG } = Parser;
        /** поиск по селекторам */
        html( selector ).each( ( idx, element ) => {
            let method = () => html( element ).text();

            if ( [ IMG ].includes( key ) ) {
                method = () => html( element ).data('src');
            }
            /** обновляем обьект новостей заполняя новыми данными, и сохраняя уже существующие */
            feeds[ idx ] = { ...feeds[ idx ], [ key ]: method() };
        });
        return feeds;
    }

    /**  Собираем новости перед тем как отдадим на страницу */
    buildFeedElement() {
        const feeds = this.parseNews();
        const { STYLES: { containerStyle, imgStyle, contentStyle } } = Parser;
        /** делаем диструктуризацию по параметрам, чтоб не вводить лишние костанты */
        return feeds.map( ({ title, img, body }) =>
            `<div style="${ containerStyle }">
                <img style="${ imgStyle }" src="${ img }" alt="img"> 
                <div style="${ contentStyle }">
                    <h3>${ title }</h3>
                    <div>${ body }</div>  
                </div> 
            </div>`
        );
    }
}

const server = createServer( (req, res) => 
    request( PARSE_URL, (error, response, html) => {
        res.writeHeader( CODE_OK, { 'Content-Type': 'text/html' } );
        if ( !error && response.statusCode === CODE_OK ) {
            const parser = new Parser( html, MAIN_SELECTOR, PARAMS_SELECTOR );
            res.write( parser.getNews() );
        } else {
            res.write( 'Server is unavailable! Please try again later' );
        }
        res.end();
    })
).listen(PORT);

/**  просто подсказка что сервер запустился, и на каком порту */
server.on( 'listening' , () =>  console.log([
        clc.yellow(`==================== Server start ====================`),
        clc.green(`\t${ SERVER_URL }:${ PORT }`)
    ].join('\n')
));