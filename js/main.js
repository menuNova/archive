import { calcTotal, renderCart, renderMenu, renderText } from "./render.js";
import { sendStat, submitToGoogleForm } from "./statistics.js";
import { sendBot } from './telegram.js';

let isNeedToPay = false;
let formattedCart = '';
let userFormattedCart = '';
let isPayed = false;
const cartButton = document.querySelector('.nav__cart');
const cart = document.querySelector('.cart');
const navTheme = document.querySelector('.nav__theme');
const callButton = document.querySelector('#callOfficiant');
const sendMenu = document.querySelector('#sendMenu');
const order = document.querySelector('#order');
const cancelOrder = document.querySelector('#cancelOrderSend');
const wrapper = document.querySelector('.order__wrapper pre');
const payOrder = document.querySelector('#payOrder');
const popup = document.querySelector('#popup');

const langaData = languageData[data.language];
const forJsData = langaData.forJs;

export function main() {
    sendStat();
    renderMenu();
    renderText();
    observeSections();
};

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
};

function formatCart(lang) {
    console.log(Object.entries(cartData).map(([category, categoryData]) => {
        const categoryName = categoryData.name[lang];
        const time = (new Date()).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        const items = categoryData.items
            .filter(item => item.count)
            .map((item, index) => {
                const itemName = item.name[lang] + ` (${time})`;
                const sizes = Object.entries(item.count)
                    .map(([size, count]) => `    ${size} - ${count}`)
                    .join('\n');
                return ` ${index + 1}. ${itemName}\n${sizes}`;
            })
            .join('\n');

        return `${categoryName}:\n${items}`;
    }).join('\n\n'));
    return Object.entries(cartData).map(([category, categoryData]) => {
        const categoryName = categoryData.name[lang];
        const time = (new Date()).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        const items = categoryData.items
            .filter(item => item.count)
            .map((item, index) => {
                const itemName = item.name[lang] + ` (${time})`;
                const sizes = Object.entries(item.count)
                    .map(([size, count]) => `    ${size} - ${count}`)
                    .join('\n');
                return ` ${index + 1}. ${itemName}\n${sizes}`;
            })
            .join('\n');

        return `${categoryName}:\n${items}`;
    }).join('\n\n');

};

let popupOpened = false;

export function createPopup(header) {
    popup.querySelector('#popupHeader').innerHTML = header;

    if (popupOpened) return;
    popupOpened = true;
    popup.classList.add('_active');

    let popupProps = {};
    popupProps.closePopup = function () {
        popup.classList.remove('_active');
        popupOpened = false;
        popup.querySelector('.popup__header').innerHTML = '';
        popup.querySelector('.popup__btns').innerHTML = '';
    };

    popupProps.createButtons = function (buttons = { [forJsData.understand]: popupProps.closePopup }) {
        popup.querySelector('.popup__btns').innerHTML = '';
        Object.keys(buttons).forEach(key => {
            let buttonNode = document.createElement('button');
            buttonNode.innerHTML = key;
            buttonNode.onclick = buttons[key];
            if (key.includes('fa-circle-right')) {
                let div = document.createElement('div');
                div.className = 'popup__number';
                document.querySelector('.popup__btns').insertBefore(div, document.querySelector('.popup__btns').firstChild);
                popup.querySelector('.popup__number').appendChild(buttonNode);
            } else popup.querySelector('.popup__btns').appendChild(buttonNode);
        });
    };

    setTimeout(() => {
        if (popupOpened) {
            popupProps.closePopup();
        }
    }, 60000);

    return popupProps;
};



function mergeCartData(cartData1, cartData2) {
    const merged = { ...cartData1 };
    let news = [];;
    for (const category in cartData2) {
        let newKey = false;
        if (merged.hasOwnProperty(category)) {
            let suffix = 1;
            newKey = category + suffix;
            while (merged.hasOwnProperty(newKey)) {
                suffix++;
                newKey = category + suffix;
            };
            merged[newKey] = cartData2[category];
        } else {
            merged[category] = cartData2[category];
        };
        news.push(newKey ? newKey : category);
    };
    return [merged, news];
};

if (!sessionStorage.getItem(textToId(data.name) + '-table')) {
    let tablePopup = createPopup(forJsData.chooseTable);
    let div = document.createElement('div');
    div.className = 'popup__number'
    div.innerHTML = `
<button id="popupMinus">-</button>
<input type = "number" min = 1 step = 1 value = 1>
<button id="popupPlus">+</button>`;
    let input = div.querySelector('input');

    div.querySelector('#popupMinus').onclick = function () {
        input.value = Math.max(1, Number(input.value) - 1);
    };
    div.querySelector('#popupPlus').onclick = function () {
        input.value = Number(input.value) + 1;
    };

    let ok = langaData['.popup__button_ok'];
    let buttons = {};
    buttons[ok] = function () {
        sessionStorage.setItem(textToId(data.name) + '-table', input.value);
        tablePopup.closePopup();
    };

    tablePopup.createButtons(buttons);
    popup.querySelector('.popup__btns').insertBefore(div, popup.querySelector('.popup__btns').firstChild);
};



window.addEventListener('scroll', observeSections);

function observeSections() {
    const sections = document.querySelectorAll('.section');
    const links = document.querySelectorAll('.dishes__link');
    let closestSection = null;
    let closestDistance = Infinity;

    if (!sections.length || !links.length) return;

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestSection = section;
        };
    });

    if (closestSection) {
        links.forEach(link => link.classList.remove('_active'));
        const activeLink = document.querySelector(`.dishes__link[href="#${closestSection.id}"]`);
        if (activeLink) activeLink.classList.add('_active');
    };
};



let ok = langaData['.popup__button_ok'];
let cancel = langaData['.popup__button_cancel'];


if (window.location.pathname.includes('menu-')) {
    let cancelOrderF = function (needToNoff = true, noffPpp = false) {
        let oldOrder = JSON.parse(localStorage.getItem(textToId(data.name) + '-order'));
        let formattedOld = '';


        formattedCart = oldOrder.formatted.split('+==+\n\n');
        formattedCart.pop();
        formattedCart = formattedCart.join('+==+\n\n')
        oldOrder.formatted = formattedCart;
        formattedOld = oldOrder.formattedUser.split('+==+\n\n');
        formattedOld.pop();
        formattedOld = formattedOld.join('+==+\n\n')
        oldOrder.formattedUser = formattedOld;

        for (let i = 0; i < Object.keys(oldOrder.dishes).length; i++) {
            const el = Object.keys(oldOrder.dishes)[i];

            if (lastOrder.includes(el)) {
                delete oldOrder.dishes[el];
            };
        };
        localStorage.setItem(textToId(data.name) + '-order', JSON.stringify(oldOrder));

        if (!formattedCart) {
            wrapper.parentNode.classList.add('_hidden');
            cancelOrder.classList.add('hidden');
            order.innerHTML = `False`;
            order.classList.add('hidden');
            sendMenu.innerHTML = langaData['#sendMenu'];
            localStorage.removeItem(textToId(data.name) + '-order');
            isNeedToPay = false;
        };
        setLastOrder('delete');
        wrapper.innerHTML = formattedOld.split('\n').join('<br/>').split('+==+').join('') + `\n${forJsData.total}: ${calcTotal()}${data.valute}`;

        sendBot(`
<b><u>🔴 ОТМЕНА 🔴</u></b>

Стол N${sessionStorage.getItem(textToId(data.name) + '-table')} отменил ${formattedCart ? 'обновление' : 'отправку'} заказа.

${formattedCart ? '<b>Текущий заказ:</b>' : ''}
${formattedCart}
`);

        if (needToNoff) {
            noffPpp.closePopup();
            let nofficationPopup = createPopup(forJsData.canceled);
            nofficationPopup.createButtons();
        };

    };
    let dat = new Date();
    // --- Local check ---
    if (localStorage.getItem(textToId(data.name) + '-order')) {
        let orderParse = JSON.parse(localStorage.getItem(textToId(data.name) + '-order'));
        let datDelta = dat - new Date(orderParse.time);
        datDelta = datDelta / (1000 * 60);
        if (datDelta > 12 || orderParse.table != sessionStorage.getItem(textToId(data.name) + '-table')) {
            localStorage.removeItem(textToId(data.name) + '-order');
        };
    };

    if (localStorage.getItem(textToId(data.name) + '-cart')) {
        let cartParse = JSON.parse(localStorage.getItem(textToId(data.name) + '-cart'));
        let datDelta = dat - new Date(cartParse.time);
        datDelta = datDelta / (1000 * 60);

        if (datDelta > (60 * 3) || Object.keys(localStorage.getItem(textToId(data.name) + '-cart')) || (datDelta > 60 && !localStorage.getItem(textToId(data.name) + '-cart')) || cartParse.table != sessionStorage.getItem(textToId(data.name) + '-table')) {
            localStorage.removeItem(textToId(data.name) + '-cart');
        };
    };

    if (localStorage.getItem(textToId(data.name) + '-securi') && ! localStorage.getItem(textToId(data.name) + '-order')) {
        localStorage.removeItem(textToId(data.name) + '-securi')
    };

    if (localStorage.getItem(textToId(data.name) + '-order')) {
        let ord = JSON.parse(localStorage.getItem(textToId(data.name) + '-order'));
        order.innerHTML = `${langaData['#orderTitle']} N ${ord.id}`;
        wrapper.innerHTML = ord.formattedUser.split('\n').join('<br/>').split('+==+').join('') + `\n${forJsData.total}: ${calcTotal()}${data.valute}`;
        order.classList.remove('hidden');
        cancelOrder.classList.remove('hidden');
        isNeedToPay = true;
        let times = ord.formatted.split('(')[1].split(')')[0].split(':');
        let time = times[0] + (times[1] / 60)
        sendMenu.innerHTML = forJsData.addToOrder;
        setLastOrder(JSON.parse(localStorage.getItem(textToId(data.name) + '-lastS')));
    };

    if (localStorage.getItem(textToId(data.name) + '-cart')) {
        let dishesCart = JSON.parse(localStorage.getItem(textToId(data.name) + '-cart'));
        setCartData(dishesCart.dishes)

        renderCart();
    };

    if (localStorage.getItem(textToId(data.name) + '-securi')) {
        noffPay();
    };


    cartButton.onclick = () => {
        cartButton.classList.toggle('_active');
        console.log(cartButton.childNodes);

        cartButton.childNodes[1].classList.toggle('fa-arrow-left-long');
        cartButton.childNodes[1].classList.toggle('fa-cart-shopping');
        cart.classList.toggle('_active');
        document.body.classList.toggle('_whenCart');
    };

    navTheme.onclick = () => {
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');
    };

    let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.body.classList.add(`${theme}-theme`);

    if (theme !== 'light' && theme !== 'dark') {
        document.body.classList.add('light-theme');
    };

    let initDistance = null;

    if (data.xType != 'basic') {
        window.addEventListener('scroll', () => {
            const dishesNav = document.querySelector('.dishes__nav');
            const nav = document.querySelector('nav');

            if (dishesNav && nav) {
                const currentDistance = dishesNav.getBoundingClientRect().top + window.scrollY - nav.offsetHeight;
                if (initDistance === null) {
                    initDistance = currentDistance;
                };

                if (window.scrollY >= initDistance) {
                    dishesNav.classList.add('_fullwidth');
                } else {
                    dishesNav.classList.remove('_fullwidth');
                };
            };
        });
    };


    callButton.onclick = () => {
        let callPopup = createPopup(langaData['#sureCall']);
        let ok = langaData['.popup__button_ok'];
        let cancel = langaData['.popup__button_cancel'];
        let buttons = {};
        buttons[ok] = function () {
            sendBot(`
<b><u>Вызов официанта</u></b>

Стол N${sessionStorage.getItem(textToId(data.name) + '-table')} зовёт официанта.`);
            isNeedToPay = true;
            callPopup.closePopup();
            let nofficationPopup = createPopup(forJsData.soonOfficiant);
            let btns = {};
            btns[forJsData.understand] = nofficationPopup.closePopup;
            btns[cancel] = function () {
                sendBot(`
<b><u>🔴 ОТМЕНА 🔴</u></b>

Стол N${sessionStorage.getItem(textToId(data.name) + '-table')} отменил вызов официанта.
`);
                nofficationPopup.closePopup();
                nofficationPopup = createPopup(forJsData.canceled);
                nofficationPopup.createButtons();
            };
            nofficationPopup.createButtons(btns);
        };
        buttons[cancel] = callPopup.closePopup;
        callPopup.createButtons(buttons);
    };





    sendMenu.onclick = function () {
        if (!Object.keys(cartData).length) {
            let errPopup = createPopup(forJsData.cantSendOrder);
            errPopup.createButtons();
            return;
        };

        let menuPopup = createPopup(forJsData.sureOrder);
        let buttons2 = {};
        buttons2[ok] = function () {
            let table = sessionStorage.getItem(textToId(data.name) + '-table') ? sessionStorage.getItem(textToId(data.name) + '-table') : 'Не определён'

            wrapper.innerHTML = userFormattedCart.split('\n').join('<br/>').split('+==+').join('') + `\n${forJsData.total}: ${calcTotal()}${data.valute}`;
            isNeedToPay = true;
            menuPopup.closePopup();
            let nofficationPopup = createPopup(forJsData.orderSended);
            let btns = {};
            const orderTime = new Date().toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }).replace(',', '').replace(' ', ' ');
            let realId = `${orderTime}-${sessionStorage.getItem(textToId(data.name) + '-table')}`;
            let oldDishes = '';
            let oldArr = {};
            let oldFormattedUser = '';
            let newCartData = cartData;

            if (!localStorage.getItem(textToId(data.name) + '-order')) {
                order.innerHTML = `${langaData['#orderTitle']} N ${orderTime}-${sessionStorage.getItem(textToId(data.name) + '-table')}`;
                order.classList.remove('hidden');
            } else {
                realId = JSON.parse(localStorage.getItem(textToId(data.name) + '-order')).id;
                oldDishes = JSON.parse(localStorage.getItem(textToId(data.name) + '-order')).formatted + '+==+\n\n';
                oldArr = JSON.parse(localStorage.getItem(textToId(data.name) + '-order')).dishes;
                oldFormattedUser = JSON.parse(localStorage.getItem(textToId(data.name) + '-order')).formattedUser + '+==+\n\n';
            };
            let newCart = formatCart(data.mainLang);
            let x = oldDishes ? '🟢 + == + 🟢 \n' : '';
            sendBot(`
<b><u>${x ? 'Добавлено к заказу' : 'Заказ'}</u></b>

<i>Id: ${realId}</i>
Стол: ${table}
Язык: ${data.language}
Итого: ${calcTotal()}${data.valute}

${(oldDishes + x + newCart).split('+==+').join('')}`);
            let newUserCart = formatCart(data.language)
            let lastKeys = '0';
            if (oldArr) {
                [newCartData, lastKeys] = mergeCartData(oldArr, cartData);
            };



            setLastOrder(lastKeys);
            formattedCart = oldDishes + newCart;
            userFormattedCart = oldFormattedUser + newUserCart

            let orderJson = {
                dishes: newCartData,
                id: realId,
                time: localStorage.getItem('order') ? localStorage.getItem('order').time : new Date(),
                table: sessionStorage.getItem(textToId(data.name) + '-table'),
                language: data.language,
                formatted: formattedCart,
                formattedUser: userFormattedCart,
                total: calcTotal()
            };
            localStorage.setItem(textToId(data.name) + '-order', JSON.stringify(orderJson));
            localStorage.setItem(textToId(data.name) + '-cart', '{}');

            setCartData({});
            document.querySelector('.dishes').innerHTML = `
<h1 id="menuTitle">Меню</h1>
<div class="dishes__nav"></div>
            `;
            renderMenu();
            renderText();
            renderCart();


            sendMenu.innerHTML = forJsData.addToOrder;
            wrapper.innerHTML = userFormattedCart.split('\n').join('<br/>').split('+==+').join('') + `\n${forJsData.total}: ${calcTotal()}${data.valute}`;

            btns[forJsData.understand] = nofficationPopup.closePopup;
            btns[cancel] = () => { cancelOrderF(true, nofficationPopup) };
            cancelOrder.classList.remove('hidden');

            nofficationPopup.createButtons(btns);
        };


        buttons2[cancel] = () => {
            menuPopup.closePopup();
        };

        menuPopup.createButtons(buttons2)
    };
    function noffPay() {
        let nofficationPopup = createPopup(forJsData.payOrdered);

        let inp = document.createElement('input');
        inp.min = 1;
        inp.step = 1;
        inp.max = 999;
        inp.type = 'number';
        nofficationPopup.createButtons({
            ['<i class="fa-regular fa-circle-right"></i>']: function () {
                (async function () {
                    if (await sha256(inp.value) == localStorage.getItem(textToId(data.name) + '-securi')) {
                        localStorage.removeItem(textToId(data.name) + '-securi');
                        isPayed = true;
                        let ord = JSON.parse(localStorage.getItem(textToId(data.name) + '-order'));
                        if (data.xType == 'premium') {
                            submitToGoogleForm({
                                [formStore['id']]: ord.id,
                                [formStore['оплата']]: 'Оплата',
                                [formStore['lang']]: data.language,
                                [formStore['table']]: sessionStorage.getItem(textToId(data.name) + '-table'),
                                [formStore['order']]: ord.formatted.split('+==+').join(''),
                                [formStore['sum']]: calcTotal(),
                            });
                        };
                        localStorage.removeItem(textToId(data.name) + '-order')
                        nofficationPopup.closePopup()
                        nofficationPopup = createPopup(forJsData.paySuccess);
                        nofficationPopup.createButtons();
                        sendBot(`
Успешная оплата заказа

<i>Id: ${ord.id}</i>
<b>Стол:</b> ${sessionStorage.getItem(textToId(data.name) + '-table')}
<b>Сумма к оплате:</b> ${calcTotal()}${data.valute}
<i>Язык: ${data.language}</i>`)
                        setTimeout(() => {
                            location.reload();
                        }, 3000);

                    } else {
                        document.querySelector('.popup__header').innerHTML = forJsData.wrongCode;
                        inp.value = '';
                        inp.focus();
                    };
                })();
            }
        });
        document.querySelector('.popup__number').insertBefore(inp, document.querySelector('.popup__number').firstChild);



    };
    payOrder.onclick = () => {
        if (!isNeedToPay) {
            let errPopup = createPopup(forJsData.cantPayOrder);
            errPopup.createButtons();
            return;
        };
        let payPopup = createPopup(forJsData.choosePayOrder);
        let buttons = {};



        buttons[forJsData.cashes] = function () {
            const randomValue = Math.floor(Math.random() * 949 + 50).toString();
            sha256(randomValue).then(hash => {
                localStorage.setItem(textToId(data.name) + '-securi', hash);
            });
            sendBot(`
<b><u>Оплата заказа</u></b>

<i>Id: ${JSON.parse(localStorage.getItem(textToId(data.name) + '-order')).id}</i>
Стол: ${sessionStorage.getItem(textToId(data.name) + '-table') ? sessionStorage.getItem(textToId(data.name) + '-table') : 'Не определён'}
Сумма к оплате: ${JSON.parse(localStorage.getItem(textToId(data.name) + '-order')).total}${data.valute}
Тип оплаты: Наличными
Код: ${randomValue}
<i>Язык: ${data.language}</i>
                `);
            payPopup.closePopup();
            noffPay();
        };

        buttons[forJsData.cards] = function () {
            const randomValue = Math.floor(Math.random() * 949 + 50).toString();
            sha256(randomValue).then(hash => {
                localStorage.setItem(textToId(data.name) + '-securi', hash);
            });
            sendBot(`
<b><u>Оплата заказа</u></b>

<i>Id: ${JSON.parse(localStorage.getItem(textToId(data.name) + '-order')).id}</i>
Стол: ${sessionStorage.getItem(textToId(data.name) + '-table') ? sessionStorage.getItem(textToId(data.name) + '-table') : 'Не определён'}
Сумма к оплате: ${JSON.parse(localStorage.getItem(textToId(data.name) + '-order')).total}${data.valute}
Тип оплаты: Картой
Код: ${randomValue}
<i>Язык: ${data.language}</i>
                `);
            payPopup.closePopup();
            noffPay();
        };

        buttons[cancel] = payPopup.closePopup;

        payPopup.createButtons(buttons);
    };
    order.onclick = function () {
        order.classList.toggle('_active');
        document.querySelector('.order__wrapper').classList.toggle('_hidden');
    };
    cancelOrder.onclick = function () {
        let formattedCc = JSON.parse(localStorage.getItem(textToId(data.name) + '-order')).formatted;
        const times = formattedCc.match(/\((\d{1,2}:\d{2})\)/g).map(s => s.slice(1, -1));
        const toMinutes = t => t.split(':').reduce((sum, n, i) => sum + (i === 0 ? +n * 60 : +n), 0);
        const maxTime = times.reduce((a, b) => toMinutes(a) > toMinutes(b) ? a : b);

        let cancelDescrPopup = createPopup(forJsData.cancelOrderDescription + maxTime);
        cancelDescrPopup.createButtons({
            [langaData['.popup__button_ok']]: function () {
                cancelOrderF(true, cancelDescrPopup);
            },
            [langaData['.popup__button_cancel']]: cancelDescrPopup.closePopup
        })
    };
};  