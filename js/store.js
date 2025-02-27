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

let languageData = {
    ru: {
        'title': 'Меню | ' + data.name,
        '#menuTitle': 'Меню',
        '#orderTitle': 'Ваш заказ',
        '#callOfficiant': 'Вызвать официанта',
        '#sendMenu': 'Отправить заказ',
        '#sureCall': 'Вы уверены в вызове официанта?',
        '#popup_order__confirm': 'Да',
        '#popup_order__cancel': 'Отмена',
        '.popup__button_ok': 'Да',
        '.popup__button_cancel': 'Отмена',
        '#cancelOrderSend': 'Отменить отправку заказа',
        'forJs': {
            total: 'Итого',
            cancelOrderDescription: 'Отмениться то, что вы заказали в ',
            understand: 'Понятно',
            lang: 'Сменить язык на',
            order: 'Заказ',
            orderSended: 'Заказ отправлен',
            surePortions: 'Вы хотите удалить эту порцию?',
            canceled: 'Отменено',
            cashes: 'Наличными',
            cards: 'Картой',
            portion: 'Порция',
            soonOfficiant: 'Официант скоро подойдёт',
            count: 'Количество',
            sureOrder: 'Вы уверены в отправке заказа?',
            cantSendOrder: 'Вы не можете отправить заказ с пустой корзиной, но можете нажать кнопку "Позвать официанта"',
            cantPayOrder: 'Вы ещё не сделали заказ, чтобы оплатить его',
            choosePayOrder: 'Выберите способ оплаты:',
            payOrdered: 'Сейчас к вам подойдёт официант',
            chooseTable: 'Мы не смогли определить номер вашего стола. Введите его пожалуйста',
            addToOrder: 'Добавить к заказу'
        },
        '#payOrder': 'Оплатить заказ',
    },
    en: {
        'title': 'Menu | ' + data.name,
        '#menuTitle': 'Menu',
        '#orderTitle': 'Your Order',
        '#callOfficiant': 'Call the waiter',
        '#sendMenu': 'Send Order',
        '#sureCall': 'Are you sure you want to call the waiter?',
        '#popup_order__confirm': 'Yes',
        '#popup_order__cancel': 'Cancel',
        '.popup__button_ok': 'Yes',
        '.popup__button_cancel': 'Cancel',
        '#cancelOrderSend': 'Cancel sending the order',
        'forJs': {
            total: 'Total',
            cancelOrderDescription: 'Will be canceled what you ordered in ',
            understand: 'Understand',
            lang: 'Change Language to',
            order: 'Order',
            orderSended: 'Order sent',
            surePortions: 'Do you want to remove this portion?',
            canceled: 'Cancelled',
            cashes: 'Cash',
            cards: 'Card',
            portion: 'Portion',
            soonOfficiant: 'The waiter will be with you soon',
            count: 'Count',
            sureOrder: 'Are you sure you want to send the order?',
            cantSendOrder: 'You cannot send an order with an empty cart, but you can press the "Call the waiter" button',
            cantPayOrder: 'You have not yet placed an order to pay for it',
            choosePayOrder: 'Choose a payment method:',
            payOrdered: 'A waiter will come to you now',
            chooseTable: 'We could not determine your table number. Please enter it',
            addToOrder: 'Add to order'
        },
        '#payOrder': 'Pay Order',
    },
    de: {
        'title': 'Menü | ' + data.name,
        '#menuTitle': 'Menü',
        '#orderTitle': 'Ihre Bestellung',
        '#callOfficiant': 'Kellner rufen',
        '#sendMenu': 'Bestellung senden',
        '#sureCall': 'Sind Sie sicher, dass Sie den Kellner rufen möchten?',
        '#popup_order__confirm': 'Ja',
        '#popup_order__cancel': 'Abbrechen',
        '.popup__button_ok': 'Ja',
        '.popup__button_cancel': 'Abbrechen',
        '#cancelOrderSend': 'Bestellversand abbrechen',
        'forJs': {
            total: 'Gesamt',
            cancelOrderDescription: 'Storniert wird, was Sie in ',
            understand: 'Verstanden',
            lang: 'Sprache wechseln auf',
            order: 'Bestellung',
            orderSended: 'Bestellung gesendet',
            surePortions: 'Möchten Sie diese Portion entfernen?',
            canceled: 'Abgebrochen',
            cashes: 'Bar',
            cards: 'Karte',
            portion: 'Portion',
            soonOfficiant: 'Der Kellner wird bald bei Ihnen sein',
            count: 'Anzahl',
            sureOrder: 'Sind Sie sicher, dass Sie die Bestellung senden möchten?',
            cantSendOrder: 'Sie können keine Bestellung mit einem leeren Warenkorb senden, aber Sie können die Schaltfläche "Kellner rufen" drücken',
            cantPayOrder: 'Sie haben noch keine Bestellung aufgegeben, um sie zu bezahlen',
            choosePayOrder: 'Wählen Sie eine Zahlungsmethode:',
            payOrdered: 'Ein Kellner kommt gleich zu Ihnen',
            chooseTable: 'Wir konnten Ihre Tischnummer nicht bestimmen. Bitte geben Sie sie ein',
            addToOrder: 'Zur Bestellung hinzufügen'
        },
        '#payOrder': 'Zahlung machen',
    },
};



function textToId(text) {
    return text
        .normalize('NFKD') // Приводим символы к нормальной форме
        .replace(/[\u0400-\u04FF\u0500-\u052F\u1E00-\u1EFF]/g, match => {
            return match.charCodeAt(0).toString(36); // Кодируем нестандартные символы в base36
        })
        .replace(/[^a-zA-Z0-9-]/g, '-') // Заменяем пробелы и недопустимые символы
        .replace(/-+/g, '-') // Убираем дублирующиеся дефисы
        .replace(/^-+|-+$/g, '') // Удаляем дефисы по краям
        .toLowerCase();
};


let dishesData = {
    'category1': {
        name: {
            ru: 'Основные блюда',
            en: 'Main dishes',
            de: 'Hauptgericht',
        },
        items: [
            {
                name: {
                    ru: 'Молочный суп',
                    en: 'Milk soup',
                    de: 'Milchsuppe',
                },
                price: {
                    1: 2,
                    2: 5,
                    3: 52,
                },
                description: {
                    ru: 'Он очень молочный',
                    en: 'It is very milk',
                    de: 'Es ist sehr Milch',
                },
            },
            {
                name: {
                    ru: 'Говядина с овощами',
                    en: 'Beef with vegetables',
                    de: 'Rindfleisch mit Gemüse',
                },
                price: {
                    1: 10,
                    2: 20,
                },
                description: {
                    ru: 'Нежная говядина с гарниром из овощей.',
                    en: 'Tender beef with vegetable garnish.',
                    de: 'Zartes Rindfleisch mit Gemüsegarnitur.',
                },
            },
            {
                name: {
                    ru: 'Картофельное пюре',
                    en: 'Mashed potatoes',
                    de: 'Kartoffelpüree',
                },
                price: {
                    1: 3,
                    2: 6,
                },
                description: {
                    ru: 'Классическое картофельное пюре с маслом.',
                    en: 'Classic mashed potatoes with butter.',
                    de: 'Klassisches Kartoffelpüree mit Butter.',
                },
            },
            {
                name: {
                    ru: 'Рыба в кляре',
                    en: 'Battered fish',
                    de: 'Fisch im Teig',
                },
                price: {
                    1: 8,
                    2: 16,
                },
                description: {
                    ru: 'Золотистая рыба в хрустящем кляре.',
                    en: 'Golden fish in crispy batter.',
                    de: 'Goldener Fisch im knusprigen Teig.',
                },
            },
        ],
    },
    'category2': {
        name: {
            ru: 'Супы',
            en: 'Soups',
            de: 'Suppen',
        },
        items: [
            {
                name: {
                    ru: 'Томатный суп',
                    en: 'Tomato soup',
                    de: 'Tomatensuppe',
                },
                price: {
                    1: 4,
                    2: 8,
                },
                description: {
                    ru: 'Свежий томатный суп с базиликом.',
                    en: 'Fresh tomato soup with basil.',
                    de: 'Frische Tomatensuppe mit Basilikum.',
                },
            },
            {
                name: {
                    ru: 'Куриный бульон',
                    en: 'Chicken broth',
                    de: 'Hühnerbrühe',
                },
                price: {
                    1: 3,
                    2: 7,
                },
                description: {
                    ru: 'Легкий куриный бульон с зеленью.',
                    en: 'Light chicken broth with herbs.',
                    de: 'Leichte Hühnerbrühe mit Kräutern.',
                },
            },
            {
                name: {
                    ru: 'Грибной крем-суп',
                    en: 'Mushroom cream soup',
                    de: 'Pilzcremesuppe',
                },
                price: {
                    1: 5,
                    2: 10,
                },
                description: {
                    ru: 'Нежный крем-суп из лесных грибов.',
                    en: 'Tender cream soup made from forest mushrooms.',
                    de: 'Zarte Cremesuppe aus Waldpilzen.',
                },
            },
            {
                name: {
                    ru: 'Суп из чечевицы',
                    en: 'Lentil soup',
                    de: 'Linsensuppe',
                },
                price: {
                    1: 4,
                    2: 9,
                },
                description: {
                    ru: 'Питательный суп из красной чечевицы.',
                    en: 'Hearty soup made from red lentils.',
                    de: 'Herzhafte Suppe aus roten Linsen.',
                },
            },
        ],
    },
    'category3': {
        name: {
            ru: 'Десерты',
            en: 'Desserts',
            de: 'Nachspeisen',
        },
        items: [
            {
                name: {
                    ru: 'Шоколадный торт',
                    en: 'Chocolate cake',
                    de: 'Schokoladenkuchen',
                },
                price: {
                    1: 6,
                    2: 12,
                },
                description: {
                    ru: 'Влажный шоколадный торт с ганашем.',
                    en: 'Moist chocolate cake with ganache.',
                    de: 'Feuchter Schokoladenkuchen mit Ganache.',
                },
            },
            {
                name: {
                    ru: 'Тирамису',
                    en: 'Tiramisu',
                    de: 'Tiramisu',
                },
                price: {
                    1: 5,
                    2: 10,
                },
                description: {
                    ru: 'Классический итальянский десерт с маскарпоне.',
                    en: 'Classic Italian dessert with mascarpone.',
                    de: 'Klassisches italienisches Dessert mit Mascarpone.',
                },
            },
            {
                name: {
                    ru: 'Ягодный пирог',
                    en: 'Berry pie',
                    de: 'Beerenkuchen',
                },
                price: {
                    1: 4,
                    2: 8,
                },
                description: {
                    ru: 'Домашний пирог с лесными ягодами.',
                    en: 'Homemade pie with forest berries.',
                    de: 'Hausgemachter Kuchen mit Waldbeeren.',
                },
            },
            {
                name: {
                    ru: 'Мороженое',
                    en: 'Ice cream',
                    de: 'Eiscreme',
                },
                price: {
                    1: 3,
                    2: 6,
                },
                description: {
                    ru: 'Пломбир с клубникой.',
                    en: 'Vanilla ice cream with strawberries.',
                    de: 'Vanilleeis mit Erdbeeren.',
                },
            },
        ],
    },
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

let cartData = {};
let lastOrder = -1;
let allLasts = [];


function setCartData(newData) {
    cartData = newData;
};