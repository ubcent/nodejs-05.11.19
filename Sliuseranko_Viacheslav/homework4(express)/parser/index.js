import Cheerio from 'cheerio';
import request from 'request';
import { EventEmitter } from 'events';
import { CODE_OK } from './configs.js';

/** Класс парсер обновленная версия, с использованием es модулей, и небольшой переработкой логики  */
export class Parser extends EventEmitter {
    static IMG = 'img';
    data = [];
    html = null;

    constructor( params, count = null ) {
        const { mainSelector, paramsSelector, url } = params;

        super();
        this.url = url;
        this.mainSelector = mainSelector;
        this.params = paramsSelector;
        this.count = count
    }

   /** получение готовой html разметки с новостями */
    getNews = () => {
        const { url } = this;

        request( url, (error, response, html) => {
            if ( !error && response.statusCode === CODE_OK ) {
                this.html = Cheerio.load(html);
                this.data = this.parseNews();
                this.emit('success');
            } else {
                this.emit('error');
            }
        });
    };
    
    /** метод парсинга и сбора новостей по селекторам */
    parseNews = () => {
        let feeds = {};
        const { params, mainSelector } = this;
        const arrayOfSelectors = params && Array.isArray( params ) ? params: [];
        /** проходим по всем элементам массива с доп селекторами, и собираем данные*/
        arrayOfSelectors.forEach( ( params ) => {
            feeds = this.collectNewsData( feeds, mainSelector, params );
        });
        /** отдаем только новости */
        return Object.values( feeds );
    };
     
    /** метод получение данных по селекторам */
    collectNewsData( feeds, mainSelector, params ) {
        const { html, count } = this;
        const { IMG } = Parser;
        const { dataParam, key, selector } = params;
        const itemSelector = `${ mainSelector } ${ selector }`;
   
        /** поиск по селекторам */
        html( itemSelector ).each( ( idx, element ) => {
            if ( count && +count < idx + 1 ) {
                return false;
            }

            let method = () => html( element ).text();
            if ( key === IMG ) {
                method = () => html( element ).data( dataParam );
            }
            /** обновляем обьект новостей заполняя новыми данными, и сохраняя уже существующие */
            feeds[ idx ] = { ...feeds[ idx ], [ key ]: method() };
        });
        return feeds;
    }
}