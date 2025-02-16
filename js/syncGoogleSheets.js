import { main } from "./main.js";
import { data, setDishesData, textToId } from "./store.js";

let api = "https://script.google.com/macros/s/AKfycbwTxWnjPptRmIwFxgX7cb9py5zSxJSajGx0KkuGYmO5cXDIxdutWGNsovYPCn9R-7aR/exec";
let size = 0;
let maxSize = 30;

if (data.xType == 'pro') {
    maxSize = 50;
} else if (data.xType == 'premium') {
    maxSize = Infinity;
};

export async function fetchDishesList() {
    const loadingPreloader = document.getElementById('loadingPreloader');
    loadingPreloader.classList.remove('hidden');
    try {
        const response = await fetch(api);
        if (!response.ok) {
            throw new Error('Сеть ответила с ошибкой: ' + response.status);
        };
        const dataX = await response.json();

        processData(dataX);
        document.getElementById('mainNav').classList.remove('hidden');
        document.querySelector('main.dishes').classList.remove('hidden');
        document.querySelector('section.cart').classList.remove('hidden');
        setTimeout(() => {
            loadingPreloader.classList.add('hidden');
        }, 200);
    } catch (error) {
        console.error('Ошибка:', error);
        loadingPreloader.textContent = 'Ошибка загрузки меню. Пожалуйста, попробуйте позже.';
    };
};


function transformItem(item, attribute) {
    let transformed = {};

    Object.keys(item).forEach(key => {

        const parts = key.split('-');
        if (parts.length === 2 && parts[0] === attribute) {
            const category = parts[1];
            transformed[category] = item[key];
        }
    });

    return transformed;
};

function processData(dataX) {
    const keys = dataX[0];
    const objectsArray = dataX.slice(3).map(row => {
        let obj = {};
        row.forEach((value, index) => {
            obj[keys[index]] = value;
        });
        return obj;
    });

    const dishData = {};

    objectsArray.forEach(item => {
        const categoryKey = textToId(item[`category-${data.mainLang}`])

        if (!dishData[categoryKey]) {
            dishData[categoryKey] = {
                name: transformItem(item, 'category'),
                items: [],
            };
        };

        const dish = {
            name: transformItem(item, 'name'),
            price: {},
            description: transformItem(item, 'description'),
            img: item['img'],
            inStore: item['inStore'],
        };


        for (let i = 1; i <= 3; i++) {
            const portionKey = `porirtion${i}`;
            const priceKey = `price${i}`;
            const discountKey = `discount${i}`;
            const discount = item[discountKey];
            const portion = item[portionKey];
            let price = parseFloat(item[priceKey]);

            if (portion && price) {
                if (discount) {
                    const discountPrice = item[`discPrice${i}`];
                    price = `<strike>${price}${data.valute}</strike> ${discountPrice}`;
                };
                dish.price[portion] = price;
            };
        };

        if (size < maxSize) {
            dishData[categoryKey].items.push(dish);
            size++;
            if (item['action-' + data.mainLang] != data.mainMenu) {
                const actionKey = '~' + textToId(item[`action-${data.mainLang}`]);
                if (!dishData[actionKey]) dishData[actionKey] = {name: transformItem(item, 'action'), items: []};
                dishData[actionKey].items.push(dish);
            };
        };
    });

    setDishesData(dishData);
    main();
};

