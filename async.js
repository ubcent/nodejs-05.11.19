// console.log('Hello world!');

// setTimeout(() => {
//     /* очень тяжелая операция, например 10с */
// }, 100);

// setTimeout(() => {
//     console.log('setTimeout');
// }, 1000);

// console.log('after set timeout');

// function sendRequest(callback) {
//     setTimeout(() => {
//         const result = 10;

//         callback(null, result);
//     }, 1000);
// }

// sendRequest((err, res) => {
//     if (err) {
//         throw err;
//     }

//     // здесь мы можем работать с res

//     sendRequest((err, res) => {
//         if (err) {
//             throw err;
//         }
    
//         // здесь мы можем работать с res
//     });
// });

const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve({ name: 'Dmitry Bondarchuk' });
    }, 1000);
});

promise.then(
    (user) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                user.items = [];
                resolve(user);
            }, 1000);
        });
    }, // onFulfilled,
    () => {}, // onRejected
).then((user) => {
    console.log(user);
})