let data = {
    valute: '$',
    language: document.documentElement.lang,
    mainLang: 'ru',
    name: 'Shakespeare',
    languages: ['ru', 'en', 'de'],
    xType: 'pro', // #DO-BASIC
    mainMenu: 'Основное',
};

let sheetsData = {
    api: 'https://script.google.com/macros/s/AKfycbwTxWnjPptRmIwFxgX7cb9py5zSxJSajGx0KkuGYmO5cXDIxdutWGNsovYPCn9R-7aR/exec'
}

let formStore = {
    action: 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSet6GN5udUclBl1MQRWiVSrMkmJrc5FCgMguDMQL-0Xz4fqXw/formResponse',
    'оплата': 'entry.1743668300',
    'id': 'entry.409673420',
    'sum': 'entry.525125625',
    'order': 'entry.1895369208',
    'table': 'entry.1937205509',
    'lang': 'entry.444114717',
} // #DO-BASIC

let indexData = [
    ['.page__title', 'shakespeare'],
    ['.page__subtitle', 'coffee & bistro'],
];

let payData = {
    totalPrice: 0,
};





let dishesData = {};




let cartData = {};
let lastOrder = -1;
let allLasts = [];



function textToId(text) {
    return text
        .normalize('NFKD') 
        .replace(/[\u0400-\u04FF\u0500-\u052F\u1E00-\u1EFF]/g, match => {
            return match.charCodeAt(0).toString(36);
        })
        .replace(/[^a-zA-Z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
};

function setCartData(newData) {
    cartData = newData;
};

let setDishesData = function (newData) {
    dishesData = newData;
};

let getDishesData = function () {
    return dishesData;
};

let setLastOrder = function (newLastOrder, isNew = true) {
    lastOrder = newLastOrder;
    if (newLastOrder != 'delete') {
        allLasts.push(lastOrder);
    } else {
        allLasts = JSON.parse(localStorage.getItem(textToId(data.name) + '-allLastS'));
        lastOrder = allLasts.pop();
    };
    localStorage.setItem(textToId(data.name) + '-allLastS', JSON.stringify(allLasts))
    localStorage.setItem(textToId(data.name) + '-lastS', JSON.stringify(lastOrder));
};
