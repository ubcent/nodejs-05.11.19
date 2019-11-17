/*
         Написать консольную игру "Орел или решка", в которой надо будет
    угадывать выпадающее число (1 или 2). В качестве аргумента
    программа может принимать имя файла для логирования
    результатов каждой партии. 
    
        В качестве более продвинутой версии
    задания можете реализовать простейшую версию игры Blackjack.
*/
const { keys } = Object;

const clc = require('cli-color');
const readline = require('readline');
const { EventEmitter } = require('events');

const { Logger } = require('../logger');
const { getRandomNumber } = require('../helpers');

/** константы которые используются для игры */
const { COMMANDS, LOG_FILE, CARTS_COUNT, USER, CPU, NO_WINNERS, MIDDLE_VALUE, VALUE_MAX } = require('./constants');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

class Game extends EventEmitter {
    /** признак начала игры */
    gameStart = false;
    /** цвета для игроков */
    colors = { [USER]: 'green', [CPU]: 'blue' };

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
    players = { [USER]: [], [CPU]: [] };

    constructor() {
        super();
        this.cardsNames = keys( this.cards);
    }
    /** Установка цвета имени игрока перед выводом в консоль
     * @param player игрок
     **/
    setUserText(player) {
        const key = this.colors[ player ];
        const cliMethod = clc[ key ];

        return cliMethod( player );
    }
    /**
     * Вывод сообщения в консоль
     * @param msg текст сообщения
     * @param style стиль если нужен ( ключь метода cli-color )
     **/
    static print(msg, style = null ) {
        const printMethod = clc[ style ] || clc.yellow;
        console.log( `${ printMethod( msg ) }` );
    }
    /**
     * Написать сообщение с указанием игрока
     * @param user
     * @param msg
     **/
    printMessageWithActiveUser(user, msg) {
        Game.print(`${ this.setUserText( user ) } ${ msg }`);
    }
    /** Вывод правил игры ( управление ) */
    static showRules() {
        const { START, EXIT, PASS, TAKE_CARD, MY_CARDS } = COMMANDS;

        Game.print(`To start game enter ${ clc.red( START ) }`, 'blue');
        Game.print(`In game press ${ clc.red( TAKE_CARD ) } to take card, or ${ clc.red( PASS ) } to pass.`, 'blue' );
        Game.print(`To see your cards enter ${ clc.red( MY_CARDS ) }`, 'blue' );
        Game.print(`To exit game enter ${ clc.red( EXIT ) }`, 'blue');
    }

    /** Игровой процесс */
    start() {
        const { START, EXIT, PASS, TAKE_CARD, MY_CARDS } = COMMANDS;
        Game.showRules();
        rl.on('line', (cmd) => {
            switch (cmd) {
                case START: {
                    return this.gamePrepare();
                }
                case MY_CARDS: {
                    return this.showCardsToPlayer();
                }
                case TAKE_CARD: {
                    if ( !this.gameStart ) {
                        return this.gamePrepare();
                    }
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
                    Game.print('Your command in invalid!', 'red');
                    return Game.showRules();
                }
            }
        });
    }
    /** Начало игры, раздача  карт, и вскрытие карты компьютера */
    gamePrepare() {
        const playersList = keys(this.players);

        Game.print('\tGame Start. Cards is given to players', 'red');
        this.gameStart = true;
        this.giveCardsToPlayers(playersList);

        this.showOneCardFromCpu();
    }
    /** Раздача рандомных карт игрокам */
    giveCardsToPlayers(playersList) {
        for ( let i = 0; i < CARTS_COUNT; i++ ) {
            playersList.forEach( player => {
                this.addCardToPlayer(player);
            });
        }
    }
    /** Простая логика робота ( cpu потому что на сеге всегда компьютера так называли ) */
    cpuInit() {
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
        const userValue = this.getPlayerCardsSum(USER);
        const cpuValue = this.getPlayerCardsSum(CPU);
        const isDraw = ( userValue === cpuValue );

        let winner = NO_WINNERS;

        if ( !isDraw ) {
            winner = ( userValue < cpuValue) ? CPU :  USER ;
        }
        this.setWinner( winner );
    }
    /**
     * Обьявление победителя и завершение игры
     * @param winner
     **/
    setWinner(winner) {
        /** данный лог очень удобный для информирования результатов игры */
        console.log({
               user: this.getPlayerCardsSum( USER ),
               cpu: this.getPlayerCardsSum( CPU )
            }
        );

        if ( winner === NO_WINNERS ) {
            Game.print(`${ winner }! No winners`);
        } else {
            Game.print(`${ this.setUserText(winner) } is win!`);
        }

        this.emit('gameEnd', { file: LOG_FILE, winner  });
    }
    /** Показать рандомную карту у компьютера */
    showOneCardFromCpu() {
        const randomCard = getRandomNumber( 1 );
        const { card } = this.players[ CPU ][ randomCard ];
        this.printMessageWithActiveUser( CPU, `show his card! it is ${ clc.red( card ) }`)
    }
    /** Метод помощник просмотра своих карт, + показывает сумму, для упрощение процесса игры */
    showCardsToPlayer() {
        const cards = this.players[ USER ];
        const userCards = cards.map( ({ card }) => card );
        const msg = clc.red( userCards.join(', ') || 'empty' );
        const totalSum = this.getPlayerCardsSum( USER );

        this.printMessageWithActiveUser( USER, `cards is ${ msg } value ${ totalSum } `);
    }
    /**
     * Получить сумму карт у игрока
     * @param player
     **/
    getPlayerCardsSum(player) {
        const cards = this.players[ player ];
        return cards.reduce((acc, { value } ) => value + acc, 0);
    }
    /**
     * Добавить карту игроку
     * @param player
     **/
    addCardToPlayer = (player) => {
        const length = this.cardsNames.length;
        const randomCard = this.cardsNames[ getRandomNumber( length - 1 ) ];
        const { value } = this.cards[ randomCard ];
        this.cards[ randomCard ].count--;

        if ( !this.cards[randomCard].count ) {
            delete this.cards[ randomCard ];
        }
        this.players[player].push( { card: randomCard, value } );

        if ( player === USER ) {
            Game.print(`You take ${ randomCard }`);
        }
        return value
    };
    /**
     * Проверка на перебор, или 21
     * @param player
     **/
    checkCards(player) {
        const value = this.getPlayerCardsSum(player);
        if ( value > VALUE_MAX ) {
            const playersList = keys( this.players );
            const winner = playersList.find((key) => key !== player );
            return this.setWinner( winner );
        } else if ( value === VALUE_MAX ) {
            return this.setWinner( player );
        }
        return true;
    }
}

/** Start game */
const game = new Game();

/** отлавливаем событие завершения игры. Записываем лог и закрываем приложение */
game.on('gameEnd', (props) => {
    const { file, winner } = props;
    rl.close();
    Logger.writeLog(file, winner );
});

/** старт игры, игроков 2 */
game.start();