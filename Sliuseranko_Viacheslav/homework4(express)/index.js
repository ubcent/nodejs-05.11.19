/**
    @todo 1) Cоздать на основе express и handlebars веб-сервисс HTML-интерфейсом для динамической загрузки информации с одного из нескольки хсайтов в выбранном формате.
 Зайдя на этот сервис, пользователь сможет спомощью формы настроить параметры информационной подборки (например, количество отображаемых новостей или их категорию )
 и получить ее в удобном виде. Форма должна отправляться насервер методом POST.)

 @todo 2) Реализовать запоминание спомощью cookie текущих настроек формы и призаходе на сайт показывать последние использованные настройки.
    Если cookie несуществует, можно при отображении формы дополнительно учитывать передаваемые GET-запросы(например, ?count=10&lang=ru ит.д.)
*/

/** 
 *  Для использования такого синтаксиса было мало обновить node до 13.2
 * в документации прочитал что необходимо добавить в package.json "type": "module"
 * и после все заработало
 */
import path from 'path';
import clc from 'cli-color';
import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import consolidate from 'consolidate';
import cookieParser from 'cookie-parser';
import { Parser } from './parser/index.js';                     //  Но использование этого пока что накладывает ограничения,
import { setSelectedType } from './helpers/index.js';           // без явного указания файла и расширения не видет мои експорты
import { FEEDS, FEEDS_CATEGORIES } from './parser/configs.js';  // решения пока что не нашол

/** порт нашего приложения */
const PORT = 3000;
/** url адресс нашего приложения */
const SERVER_URL = 'http://localhost';
/** кука в которой мы храним значения фильтра */
const FILTER_COOKIE = 'filter';

/**
 *  с использованием импортов, нужно создавать свою константу __dirname, а также обращение к встроенным модулям 
 * происходит немного иначе ( хочу испытать этот функционал хоть он еще экспеерментальный )
 **/
const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname( __filename );

const app = express();
app.engine('hbs', consolidate.handlebars );

app.use( cookieParser() );
app.use( express.json() );
app.use( express.urlencoded( { extended: false } ) );
app.use( express.static( `${ __dirname }/views/css` ) );

app.set( 'view engine', 'hbs' );
app.set( 'views', path.resolve( __dirname, 'views') );

/** тут будут хранится полученные новости */
let newsData = [];
/** типы новостей которые доступны для получения */
let typesList = FEEDS_CATEGORIES;
/** для удобства перенаправляю на страницу новостей */
app.get( '/', ( req, res ) => res.redirect( '/news' ) );
/** страница новостей */
app.get( '/news', ( req, res ) => {
    const { type, count } = req.query;
    const selectedNews = FEEDS[ type ];
    if ( !selectedNews ) {
        return res.render( 'news', { 
            typesList,
            newsData,
            newsCount: count,
        });
    }
    const parser = new Parser( selectedNews, count );
    parser.getNews();
    parser.on( 'success', () => {
        newsData = parser.data;
        typesList = setSelectedType( type, typesList );

        return res.render( 'news', { 
            typesList, newsData,
            newsCount: count,
        });
    });
    // в случае ошибки просто бросаем на новости ( пока что не обрабатываю ошибку. 
    // и создавать отдельный 404 файл излишне думаю на данный момент )
    parser.on( 'error', () =>  res.redirect( '/news' ) );
});
/**
 *    Обработка отправки формы, делаю редирект с гет параметрами,
 *  чтоб не дублировать логику при работе с cookies и query string, а обрабатывать все в одном месте
 **/
app.post('/news', ( req, res ) => {
    const { newsType, newsCount } = req.body;
    res.cookie( FILTER_COOKIE, { newsType, newsCount }, { maxAge: 10000 } );
    res.redirect( `/news?type=${ newsType }&count=${ newsCount }` );
});
/** запуск сервера */
app.listen( 3000, () => console.log(
    clc.yellow(`==================== Server start ====================\n`),
    clc.green(`\t${ SERVER_URL }:${ PORT }`)
));