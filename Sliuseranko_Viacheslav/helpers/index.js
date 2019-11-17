const { random, floor, round } = Math;

module.exports = {
    /**
     * Получене рандомного числа
     * @param max int
    */
    getRandomNumber: (max) => round( random() * floor(max)),
    /**
     * Установить значение поля, если flag true вернем увеличенное значение на 1
     * @param flag bollean
     * @param value int
     * @param setAs int если оно не указанно вернется value, иначе вернется указанное значение
    */
    addValueIfNeed: ( flag, value, setAs = false ) => {
        if ( !flag && Number.isInteger( setAs ) ) {
            return setAs;
        }
        return flag ? ++value : value;
    },
    
}