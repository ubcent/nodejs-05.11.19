const { red, bold } = require("cli-color");
const { radar } = require('chalk-animation');

const program = () => { 
	console.log(red(bold.italic.underline('Acquaintance with Node.js')));
	radar('-------------------------', 1);

	setTimeout(() => {
		process.exit(0);
	}, 3000);
};

program();
