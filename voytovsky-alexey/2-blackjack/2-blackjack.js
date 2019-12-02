const readline = require('readline');
const minimist = require('minimist');
const argv = minimist(process.argv.splice(2));
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Создание файла логирования и запись исхода игры
let logFile = argv._[0];

const writeDownResults = (data) =>
  new Promise(async (resolve, reject) => {
    fs.appendFile('./logFile.txt', data, 'utf8', (err) => {
      try {
        if (err) {
          console.error(err);
          process.exit(1);
        }

        resolve (data);
      }
      catch (err) {
        reject(err);
        console.error(err);
        process.exit(1);
      }
    });
  })

if (!logFile) logFile = './logFile.txt';

// Реализация игровой логики
const program = async () => {
  
  const dealCards = async (hand) => {
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
      
    const randomInt = getRandomInt(0, cardDeck.length - 1);
    const randomCard = cardDeck[randomInt];
      
    cardDeck.splice(randomInt, 1);
    hand.push(randomCard);
  };

  const getSum = (hand) =>
    new Promise((resolve, reject) => {
      try {
        let sum = 0;
        
        for (const card of hand) {
          if (card != 'A') {
            if (card == 'J' || card == 'Q' || card == 'K') {
              sum += 10;
            } else {
              sum += +card;
            }
          }
        }

        for (const card of hand) {
          if (card == 'A') {
            if (sum > 10) {
              sum += 1;
            } else {
              sum += 11;
            }
          }
        }
      
        resolve(sum);
      }
      catch (err) {
        reject(err);
        console.error(err);
        process.exit(1);
      }
    });

  const getStatus = (player, dealer) => `Дилер: ${dealer.join(', ')}.\nИгрок: ${player.join(', ')}.`;

  const askQuestion = (player, dealer) =>
    new Promise(reject => {
      try {
        rl.question(`${getStatus(player, dealer)}\nЕщё одну карту? 1 - Да, иначе - нет.\n`, async response => {
          
          let sumPlayer = await getSum(player);
          let sumDealer = await getSum(dealer);

          if (response == '1') {
            await dealCards(player);
            sumPlayer = await getSum(player);
            await checkSum(sumPlayer, sumDealer, response);

          } else {
            // Цикл не работает
            while (sumDealer < 17) {
              await dealCards(dealer);
              sumDealer = await getSum(dealer);
            }

            await checkSum(sumPlayer, sumDealer, response);
          }
        });
      }
      catch(err) {
        reject(err);
        console.error(err);
        process.exit(1);
      }
    });
  
  const checkSum = (sumPlayer, sumDealer, response) =>
    new Promise (async (resolve, reject) => {
      try {
        if (sumPlayer == 21 && response == '1') {
          resolve(console.log(`Вам невероятно везёт! Вы выиграли!\n ${getStatus(player, dealer)}`));
          await writeDownResults('Victory\n');
          process.exit(0);

        } else if (sumPlayer > 21) {
          resolve(console.log(`У вас перебор! Вы проиграли!\n ${getStatus(player, dealer)}`));
          await writeDownResults('Defeat\n');
          process.exit(0);
        }
  
        if (sumDealer == 21) {
          resolve(console.log(`На этот раз удача на стороне казино! Вы проиграли!\n ${getStatus(player, dealer)}`));
          await writeDownResults('Defeat\n');
          process.exit(0);

        } else if (sumDealer > 21) {
          resolve(console.log(`У дилера перебор! Вы выиграли!\n ${getStatus(player, dealer)}`));
          await writeDownResults('Victory\n');
          process.exit(0);

        } else if (sumDealer == sumPlayer) {
          resolve(console.log(`Ничья!\n ${getStatus(player, dealer)}`));
          await writeDownResults('Draw\n');
          process.exit(0);

        } else if ((sumDealer < sumPlayer) && response != '1') {
          resolve(console.log(`Выигрыш!\n ${getStatus(player, dealer)}`));
          await writeDownResults('Victory\n');
          process.exit(0);
        }

        await askQuestion(player, dealer);
      }
      catch (err) {
        reject(err);
        console.error(err);
        process.exit(1);
      }
    });
    
  // Колода карт
  const cardDeck = [
    '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A',   // ♤ 
    '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A',   // ♡
    '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A',   // ♢
    '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'    // ♧
  ];
  
  // Карты дилера и игрока соответственно
  const dealer = [];
  const player = [];

  // Раздача карт участникам в начале игры
  await dealCards(dealer);
  await dealCards(player);
  await dealCards(player);

  // Сразу проверка на Blackjack при раздаче у игрока
  const checkOnDealBlackjack = new Promise(async (resolve, reject) => {
    try {
      const sumPlayer = await getSum(player);
      resolve(sumPlayer);
    }
    catch(err) {
      reject(err);
      console.error(err);
      process.exit(1);
    }
  });

  checkOnDealBlackjack.then(async sumPlayer => {
    try {
      if (sumPlayer == 21) {
        console.log(`Блэкджек при раздаче! Вы выиграли! ${getStatus(player, dealer)}`);
        await writeDownResults('Victory\n');
        process.exit(0);
      }
    } catch(err) {
      console.error(err);
      process.exit(1);
    }
  });

  // Игроку задаётся вопрос, нужна ли ещё карта
  await askQuestion(player, dealer);

};

program();
