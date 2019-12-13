const express = require('express');
const request = require('request');
// const { load } = require('cheerio');
const cheerio = require('cheerio');
const consolidate = require('consolidate');
const path = require('path');
const { promisify } = require('util');

const cities = new Map([
	['1', 'Moscow'],
	['2', 'Petersburg'],
]);

const technologies = new Map([
	['1', 'Node.js'],
	['2', 'React.js'],
]);

// https://hh.ru/search/vacancy?area=1&st=searchVacancy&text=node.js

const promisifiedRequest = promisify(request);

const app = express();

app.use(express.urlencoded({ extended: false }));

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.get('/jobs', (req, res) => {
  res.render('jobs');
});

app.post('/jobs', async (req, res) => {
	try {
		const { count = 10, source = 'hh' } = req.body;

		if (source == 'hh') {
			const url = 'https://hh.ru/search/vacancy?';

			for (let pair of cities) {
				if (city == 'moscow') {
					city = pair[0];
				} else if (city == 'petersburg') {
					city = pair[2
				];
				}
			}

			const { body } = await promisifiedRequest(url);
			const $ = cheerio.load(body);
			console.log($);

		} else if (source = 'mk') {
			// TODO:

		} else {
			res.render('jobs', {
				err: 'такой источник не поддерживается',
			});	
		};
	}
	catch(err) {
		throw Error;
	}
});

app.listen(3030, () => {
	console.log('Server has been started!');
});


// const url = 'https://moikrug.ru/vacancies?q=node.js&currency=rur&location=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0&city_id=678&with_salary=1';

    // const $ = cheerio.load(body);

		// const jobs = Array.prototype.slice.call($('.quote__body').map((_, element) => $(element).text()), 0, count);
		
		// // $('.job').each(function() {
		// // 	const job = $(this).find('.inner');
		// // 	console.log(`${job.children('.date').text()}\n${job.find('.title').text()}\n${job.find('.salary').text()}\n`);
		// // 	// 			});

    // res.render('jobs', { jobs })



// const program = () => {

// 	const url = 'https://moikrug.ru/vacancies?q=node.js&currency=rur&location=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0&city_id=678&with_salary=1';

// 	request(url, (err, response, body) => {

// 		if (!err && response.statusCode === 200) {
// 			const $ = cheerio.load(body);

// 			console.log('\nВакансии со знанием технологии Node.js в Москве по данным сервиса "Мой круг":\n\n');

// 			$('.job').each(function() {
// 				const job = $(this).find('.inner');
// 				console.log(`${job.children('.date').text()}\n${job.find('.title').text()}\n${job.find('.salary').text()}\n`);
// 			});

// 		} else if (err) {
// 			console.error(err);
// 			process.exit(1);
// 		}
// 	});
// };

// program();
