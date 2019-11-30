/**
 * Функция помогает установить флаг selected на элементе массива ( пока ненаучусь при отрисовки
 *  шаблона через map это указыват в атрибутах, немогу там прописать условие )
 *  @param selected string выбранный ключь из списка обьектов парсинга
 *  @param list список обьектов для парсинга для select листа
 **/
export function setSelectedType(selected, list) {
    if ( selected ) {
        list.forEach( item => {
            let result = "";
            if ( item.id === selected ) {
                result = 'selected';
            }
            item.selected = result;
        });
    }
    return list;
}