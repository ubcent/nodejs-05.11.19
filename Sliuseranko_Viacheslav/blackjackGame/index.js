/*
         Написать консольную игру "Орел или решка", в которой надо будет
    угадывать выпадающее число (1 или 2). В качестве аргумента
    программа может принимать имя файла для логирования
    результатов каждой партии. 
    
        В качестве более продвинутой версии
    задания можете реализовать простейшую версию игры Blackjack.
*/
const { getRandomNumber } = require('../helpers');
const { EventEmitter } = require('events');
const readline = require('readline');
const clc = require('cli-color');
const { keys } = Object;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

class Game extends EventEmitter {
    static USER = 'user';
    static CPU = 'cpu';
    static NO_WINNERS = 'draw';
    static CARTS_COUNT = 2;
    static VALUE_MAX = 21;
    static MIDDLE_VALUE = 16;

    /** игровые команды */
    commands = {
        START: 'r',
        EXIT: 'q',
        TAKE_CARD: 'y',
        PASS: 'p',
        MY_CARDS: 's'
    };

    /** цвета для игроков */
    colors = { [Game.USER]: 'green', [Game.CPU]: 'blue' };

    /** колода карт */
    cards = {
        6: { value: 6, count: 4 },
        7: { value: 7, count: 4 },
        8: { value: 8, count: 4 },
        9: { value: 9, count: 4 },
        10: { value: 10, count: 4 },
        J: { value: 2, count: 4 },
        Q: { value: 3, count: 4 },
        K: { value: 4, count: 4 },
        T: { value: 11, count: 4 }
    };
    /** Игроки и их карты */
    players = { [Game.USER]: [], [Game.CPU]: [] };

    constructor() {
        super();
        this.cardsNames = keys( this.cards);
    }
    /** Установка цвета имени игрока перед выводом в консоль */
    setUserText(user) {
        const key = this.colors[user];
        const cliMethod = clc[ key ]

        return cliMethod( user );
    }
    /** Вывод сообщения в консоль */
    print(msg, style = null ) {
        const printMethod = clc[ style ] || clc.yellow;
        console.log( `${ printMethod( msg ) }` );
    }
    /** Написать сообщение с указанием игрока */
    printMessageWithActiveUser(user, msg) {
        this.print(`${ this.setUserText( user ) } ${ msg }`);
    }
    /** Вывод правил игры ( управление ) */
    showRules() {
        const { START, EXIT, PASS, TAKE_CARD, MY_CARDS } = this.commands;

        this.print(`To start game enter ${ clc.red( START ) }`, 'blue');
        this.print(`In game press ${ clc.red( TAKE_CARD ) } to take card, or ${ clc.red( PASS ) } to pass.`, 'blue' );
        this.print(`To see your cards enter ${ clc.red( MY_CARDS ) }`, 'blue' );
        this.print(`To exit game enter ${ clc.red( EXIT ) }`, 'blue');
    }

    /** Игровой процесс */
    start() {
        const { START, EXIT, PASS, TAKE_CARD, MY_CARDS } = this.commands;
        this.showRules();
        rl.on('line', (cmd) => {
            switch (cmd) {
                case START: {
                    return this.gamePrepare();
                }
                case MY_CARDS: {
                    return this.showCardsToPlayer();
                }
                case TAKE_CARD: {
                    const { USER } = Game;
                    this.addCardToPlayer( USER );
                    this.checkCards(USER);
                    return;
                }
                case PASS: {
                    return this.cpuInit();
                }
                case EXIT: {
                    return rl.close();
                }
                default: {
                    this.print('Your command in invalid!', 'red');
                    return this.showRules();
                }
            }
        });
    }
    /** Начало игры, раздача  карт, и вскрытие карты компьютера */
    gamePrepare() {
        this.print('\tGame Start. Cards is given to players', 'red');
        const playersList = keys(this.players);
        this.giveCardsToPlayers(playersList);

        this.showOneCardFromCpu();
    }
    /** Раздача рандомных карт игрокам */
    giveCardsToPlayers(playersList) {
        for ( let i = 0; i < Game.CARTS_COUNT; i++ ) {
            playersList.forEach( player => {
                this.addCardToPlayer(player);
            });
        }
    }
    /** Простая логика робота ( cpu потому что на сеге всегда компьютера так называли ) */
    cpuInit() {
        const { CPU, MIDDLE_VALUE } = Game;
        const chance = getRandomNumber(1);
        let value = this.getPlayerCardsSum( CPU );
        let take = ( value < MIDDLE_VALUE || value === MIDDLE_VALUE && chance );
        let gameBegin = true;

        while(take) {
            value += this.addCardToPlayer(CPU);
            gameBegin = this.checkCards(CPU);
            take = ( value < MIDDLE_VALUE || value === MIDDLE_VALUE && chance );
        }
        /** криво завязал логику, поэтому нужен признак что игра еще идет и просто компьютер нажал пасс */
        if (gameBegin) {
            this.showAllCards();
        }
    }
    /** Вскрытие карт и определение победителя */
    showAllCards() {
        const { CPU, USER, NO_WINNERS } = Game;
        const userValue = this.getPlayerCardsSum(USER);
        const cpuValue = this.getPlayerCardsSum(CPU);
        const isDraw = ( userValue === cpuValue );
        let winner = NO_WINNERS;

        if ( !isDraw ) {
            winner = ( userValue < cpuValue) ? CPU :  USER ;
        }
        this.setWiner( winner );
    }
    /** Обьявление победителя и завершение игры */
    setWiner(winner) {
        console.log(
            {
               user: this.getPlayerCardsSum( Game.USER ),
               cpu: this.getPlayerCardsSum(Game.CPU)
            }
        )
        if ( winner === Game.NO_WINNERS ) {
            this.print(`${ winner }! No winners`);
        } else {
            this.print(`${ this.setUserText(winner) } is win!`);
        }
        rl.close();
    }
    /** Показать рандомную карту у компьютера */
    showOneCardFromCpu() {
        const randomCard = getRandomNumber( 1 );
        const { kard } = this.players[ Game.CPU ][ randomCard ];
        this.printMessageWithActiveUser(Game.CPU, `show his card! it is ${ clc.red( kard ) }`)
    }
    /** Метод помощник просмотра своих карт, + показывает сумму, для упрощение процесса игры */
    showCardsToPlayer() {
        const kards = this.players[ Game.USER ];
        const userCards = kards.map( ({ kard }) => kard );
        const msg = clc.red( userCards.join(', ') || 'empty' );
        const totalSumm = this.getPlayerCardsSum( Game.USER );

        this.printMessageWithActiveUser(Game.USER, `cards is ${ msg } value ${ totalSumm } `);
    }
    /** Получить сумму карт у игрока */
    getPlayerCardsSum(player) {
        const cards = this.players[ player ];
        return cards.reduce((acc, { value } ) => value + acc, 0);
    }
    /** Добавить карту игроку */
    addCardToPlayer = (player) => {
        const length = this.cardsNames.length;
        const randomCard = this.cardsNames[ getRandomNumber( length - 1 ) ];
        const { value } = this.cards[ randomCard ];
        this.cards[ randomCard ].count--;

        if ( !this.cards[randomCard].count ) {
            delete this.cards[ randomCard ];
        }
        this.players[player].push( { kard: randomCard, value } );

        if ( player === Game.USER ) {
            this.print(`You take ${ randomCard }`);
        }
        return value
    }
    /** Проверка на перебор, или 21 */
    checkCards(player) {
        const { VALUE_MAX } = Game;
        const value = this.getPlayerCardsSum(player);

        if ( value > VALUE_MAX ) {
            const playersList = Object.keys( this.players );
            const winner = playersList.find((key) => key !== player );
            return this.setWiner( winner );
        } else if ( value === VALUE_MAX ) {
            return this.setWiner( player );
        }
        return true;
    }
}

/** старт игры, игроков 2 */
(new Game()).start();