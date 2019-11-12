const EventEmitter = require('events').EventEmitter;

class Kettle extends EventEmitter {
    constructor() {
        super();

        process.nextTick(() => {
            this.emit('init');
        });
    }

    start() {
        setTimeout(() => {
            this.emit('ready');
        }, 1000);
    }
}

const k = new Kettle();
k.start();

k.on('init', () => {
    console.log('Чайник создался!');
});

k.on('ready', () => {
    console.log('Чайник готов!');
});