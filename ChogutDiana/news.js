const request = require('request');
const cheerio = require('cheerio');
const readline = require('readline');

 const rl = readline.createInterface({
     input: process.stdin,
     output: process.stdout,
 });


request('https://www.unian.net/curiosities', (err, res, body) => {
    if(!err && res.statusCode === 200) {
        const $ = cheerio.load(body);

        for(let i = 0; i<5; i++){

            const post = $('.publications-archive a.publication-title').eq(i).text();

            console.log(`Новость ${i + 1}`, post);
        };
    };

    console.log('Какая новость интересует? (введите номер новости)')
});


const getPost = rl.on('line', (num) => {
    const linkArray = [
        'https://www.unian.net/curiosities/10763480-eshche-i-zaplatyat-v-ssha-poyavilas-vakansiya-degustatora-konopli-za-3-tysyachi-v-mesyac.html',
        'https://www.unian.net/curiosities/10763240-propavshego-kota-spustya-pyat-let-nashli-v-2-tysyachah-kilometrov-ot-doma-video.html',
        'https://www.unian.net/curiosities/10762598-muzh-sbezhal-ot-zheny-posle-vyigrysha-v-lotereyu.html',
        'https://www.unian.net/curiosities/10762541-prihozhane-razglyadeli-v-vitrazhe-hrama-polovoy-organ-iisusa-foto.html',
        'https://www.unian.net/curiosities/10761908-vspahat-pole-za-minutu-v-anglii-paren-razognal-traktor-do-217-5-km-ch-i-popal-v-knigu-rekordov-ginnesa-video.html'
    ]

    request(`${linkArray[num - 1]}`, (err, res, body) => {
        if(!err && res.statusCode === 200) {
            const $ = cheerio.load(body);

            const postText = $('.clearfix p').eq(1).text();

            console.log(`Новость ${num + 1}`, postText)
        }
        
    })
});

