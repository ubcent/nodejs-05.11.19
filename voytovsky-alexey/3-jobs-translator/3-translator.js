const readline = require('readline');
const request = require('request');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const program = () =>

	rl.question('Yandex EN-RU translator:\n\n', (data) => {
		const apiKey = 'trnsl.1.1.20190915T202449Z.94d7a5f7880c0675.592e3cc378620ec06c12022fd747b838c01086c0';
		const translator = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${apiKey}&lang=en-ru&text=${data}`;

		request({url: translator, json: true}, (err, response, body) => {	// obj instead of translator in request

			if (!err && response.statusCode === 200) {
				// const translation = JSON.parse(body);
				
				console.log(body.text[0]);
				console.log('\nПереведено сервисом «Яндекс.Переводчик»\nhttp://translate.yandex.ru/\n');

				rl.close();

			} else if (err) {
				console.error(err);
				process.exit(1);
			}
		})
	});

program();
