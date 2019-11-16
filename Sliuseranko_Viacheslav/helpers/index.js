const { random, floor, round } = Math;

module.exports.getRandomNumber = (max) => {
    return round( random() * floor(max) );
};