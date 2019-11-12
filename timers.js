const interval1 = setInterval(() => {
    console.log('interval 1');
}, 1000);

// interval1.unref();

const interval2 = setInterval(() => {
    console.log('interval 2');
}, 1000);

setTimeout(() => {
    clearInterval(interval2);
}, 5000);