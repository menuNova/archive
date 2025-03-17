let languageData = {
    ru: {
        'title': 'Меню',
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
            payOrdered: 'Сейчас к вам подойдёт официант и скажет вам код. Введите его ниже:',
            paySuccess: 'Вы успешно оплатили заказ',
            chooseTable: 'Мы не смогли определить номер вашего стола. Введите его пожалуйста',
            addToOrder: 'Добавить к заказу',
            wrongCode: 'Неверный код. Дождитесь оффицианта - он скажет вам, что вводить'
        },
        '#payOrder': 'Оплатить заказ',
    },
    en: {
        'title': 'Menu',
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
            payOrdered: 'A waiter will come to you now and give you a code. Enter it below:',
            paySuccess: 'You have successfully paid for the order',
            chooseTable: 'We could not determine your table number. Please enter it',
            addToOrder: 'Add to order',
            wrongCode: 'Wrong code. Wait for the waiter - he will tell you what to enter'
        },
        '#payOrder': 'Pay Order',
    },
    de: {
        'title': 'Menu',
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
            payOrdered: 'Ein Kellner kommt gleich zu Ihnen und gibt Ihnen einen Code. Geben Sie ihn unten ein:',
            paySuccess: 'Sie haben die Bestellung erfolgreich bezahlt',
            chooseTable: 'Wir konnten Ihre Tischnummer nicht bestimmen. Bitte geben Sie sie ein',
            addToOrder: 'Zur Bestellung hinzufügen',
            wrongCode: 'Falscher Code. Warten Sie auf den Kellner - er wird Ihnen sagen, was Sie eingeben sollen'
        },
        '#payOrder': 'Zahlung machen',
    },
};

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