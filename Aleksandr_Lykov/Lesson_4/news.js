const express = require('express')
const consolidate = require('consolidate')
const path = require('path')
const helpers = require('handlebars-helpers')()
const request = require('request')
const cheerio = require('cheerio')
const cookieParser = require('cookie-parser')
const app = express()

const allNews = {}, sortNews = {}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.engine('hbs', consolidate.handlebars)
app.set('view engine' , 'hbs')
app.set('views', path.resolve(__dirname, 'views'))

app.use('/clear-cookie', (req, res, next) => {
    res.clearCookie('userNews')
    res.redirect(301,'/')
})

app.post('/news', (req, resp) => {
    sortNews.type = req.body.select
    if(!req.body.select) sortNews.type = 'vardags'
    request(`https://8sidor.se/kategori/${sortNews.type}/`, (err, res, body) => {
        if(!err && res.statusCode === 200) {
            const news = cheerio.load(body)
            allNews.title = `${news('head > title').text()}`
            allNews.news = []
            news('body > div.container.main-content > div.row.row-equal-height > div.col-md-8.blog-main > article.article-medium > h2 > a').each((index, el) => {
                allNews.news.push({title: el.children[0].data})
            })
            news('body > div.container.main-content > div.row.row-equal-height > div.col-md-8.blog-main > article.article-medium > .row > .col-sm-pull-6 > .excerpt > div > p').each((ind, el) => {
                let content =''
                el.children.forEach((el, index) => { if(index%2 === 0) content += el.data })
                allNews.news[ind].content = content
            })
            sortNews.count = allNews.quantity = req.body.count
            allNews.newsType = sortNews.type
            resp.render('news', allNews)
            resp.cookie('userNews', sortNews)
        }
    })
})

app.get('/news', (req, resp) => {
    if(!req.body.select) sortNews.type = 'vardags'
    // console.log(sortNews)
    if(req.cookies.userNews) sortNews.type = req.cookies.userNews.type
    request(`https://8sidor.se/kategori/${sortNews.type}/`, (err, res, body) => {
        if(!err && res.statusCode === 200) {
            const news = cheerio.load(body)
            allNews.title = `${news('head > title').text()}`
            allNews.news = []
            news('body > div.container.main-content > div.row.row-equal-height > div.col-md-8.blog-main > article.article-medium > h2 > a').each((index, el) => {
                allNews.news.push({title: el.children[0].data})
            })
            news('body > div.container.main-content > div.row.row-equal-height > div.col-md-8.blog-main > article.article-medium > .row > .col-sm-pull-6 > .excerpt > div > p').each((ind, el) => {
                let content =''
                el.children.forEach((el, index) => { if(index%2 === 0) content += el.data })
                allNews.news[ind].content = content
            })
            req.cookies.userNews?allNews.quantity = req.cookies.userNews.count:allNews.quantity = allNews.news.length
            allNews.newsType = sortNews.type
            resp.render('news', allNews)
        }
    })
})

app.get('/', (req, res) => {
    res.send(`<a href='./news' style="text-align: center; display: block">News</a><hr><a href='./clear-cookie' style="text-align: center; display: block">clear cookie</a>`)
})

app.listen(4000, () => console.log("Example app listen on port 4000"))