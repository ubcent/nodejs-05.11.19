/** Код ответа сервера */
export const CODE_OK = 200;

/** Подготовленный обьект для получения новостей по типам ресурсов */
export const FEEDS = {
    js: {
        name: 'JavaScript',
        url: 'https://jsfeeds.com',
        mainSelector: '.article_body .row',
        paramsSelector: [
            { selector: 'h3 a', key: 'title' },
            { selector: '.col-md-6 a>img', key: 'img', dataParam: 'src'},
            { selector: '.col-md-18', key: 'body' },
        ]
    },
    python: {
        name: 'Python',
        url: 'https://www.infoworld.com/category/python/',
        mainSelector: '.river-well.article',
        paramsSelector: [
            { selector: 'h3 a', key: 'title' },
            { selector: '.well-img a>img', key: 'img', dataParam: 'original'},
            { selector: 'h4', key: 'body' },
        ]
    },
    /** взял тотже сайт чтоб с селекторами снова не разбиратся */
    dotNet: {
        name: 'Microsoft .NET',
        url: 'https://www.infoworld.com/category/microsoft-net/',
        mainSelector: '.river-well.article',
        paramsSelector: [
            { selector: 'h3 a', key: 'title' },
            { selector: '.well-img a>img', key: 'img', dataParam: 'original'},
            { selector: 'h4', key: 'body' },
        ]
    }
};

/** вспомогательная функция плолучение категорий новостей */
function getCategories() {
    const keys = Object.keys( FEEDS );
    return keys.map( key => {
        const label = FEEDS[ key ].name;
        return { id: key, name: label };
    });
}

/** Получение сформированных обьектов категорий */
export const FEEDS_CATEGORIES = getCategories();