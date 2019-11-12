// CommonJS
const ansi = require('ansi');
const cursor = ansi(process.stdout);

cursor.white().bg.red().write('Welcome to Node.js').reset().bg.reset().write('\n');