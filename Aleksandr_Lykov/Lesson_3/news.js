const request = require('request')
const cheerio = require('cheerio')
const ansi = require('ansi')
const cursor = ansi(process.stdout)

request('https://8sidor.se/kategori/vardags/', (err, res, body) => {
    if(!err && res.statusCode === 200) {
        const news = cheerio.load(body)
        const allNews = []
        console.log(`\nNEWS SITE: ${news('head > title').text()}\n-----------------  NEWS  -----------------\n`)
        news('body > div.container.main-content > div.row.row-equal-height > div.col-md-8.blog-main > article.article-medium > h2 > a').each((index, el) => {
            allNews.push({title: el.children[0].data})
        })
        news('body > div.container.main-content > div.row.row-equal-height > div.col-md-8.blog-main > article.article-medium > .row > .col-sm-pull-6 > .excerpt > div > p').each((ind, el) => {
            let content =''
            el.children.forEach((el, index) => { if(index%2 === 0) content += el.data })
            allNews[ind].content = content
        })
        allNews.forEach((el, ind) => {
            cursor.write(`News №${ind+1}.\n`).white().bg.red().write(`Title:`).reset().bg.reset().write(` ${el.title}\n`).bg.red().write(`News text:`).reset().bg.reset().write(` ${el.content}\n--------------------\n\n`)
        })
        
    }
})