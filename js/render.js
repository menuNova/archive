import { createPopup } from "./main.js";

let dishesData = getDishesData();


export function calcTotal(dataDishes = cartData, checkOrder = true) {
    let dishs = 0;
    dishs = Object.keys(dataDishes).reduce((total, categoryKey) => {
        return total + dataDishes[categoryKey].items.reduce((sum, item) => {
            return sum + Object.keys(item.price).reduce((subTotal, size) => {
                const count = item.count[size] || 0;
                let priceValue = item.price[size];
                if (typeof priceValue === 'string' && priceValue.includes('</strike>')) {
                    const match = priceValue.match(/<\/strike>\s*([\d.,]+)/);
                    if (match) {
                        priceValue = parseFloat(match[1].replace(',', '.'));
                    } else {
                        priceValue = parseFloat(priceValue.replace(/<[^>]+>/g, '').trim());
                    }
                } else {
                    priceValue = parseFloat(priceValue);
                }
                return subTotal + priceValue * count;
            }, 0);
        }, 0);
    }, 0);
    if (localStorage.getItem(textToId(data.name) + '-order') && checkOrder) {
        dishs = Number(dishs);
        dishs += Number(calcTotal(JSON.parse(localStorage.getItem(textToId(data.name) + '-order')).dishes, false));
    };
    
    return dishs;
};


export function renderMenu() {
    dishesData = getDishesData();
    const dishesContainer = document.querySelector('.dishes');
    const navContainer = document.querySelector('.dishes__nav');
    navContainer.innerHTML = '';

    Object.keys(dishesData).forEach(categoryKey => {
        const category = dishesData[categoryKey];
        const navLink = document.createElement('a');
        navLink.href = `#${categoryKey}`;
        navLink.textContent = category.name[data.language];
        navLink.classList.add('dishes__link');
        navLink.onclick = (e) => {
            e.preventDefault();
            document.querySelectorAll('.dishes__link').forEach(link => link.classList.remove('_active'));
            navLink.classList.add('_active');
            document.querySelector(`#${categoryKey}`).scrollIntoView({ behavior: 'smooth', block: 'center' });
        };

        const section = document.createElement('section');
        section.classList.add('section');
        section.id = categoryKey;
        section.innerHTML = `<h2>${category.name[data.language]}</h2>`;

        const dishesList = document.createElement('div');
        dishesList.classList.add('section__list');

        category.items.forEach((item, index) => {
            if (!item.inStore) {
                return;
            };

            const card = document.createElement('div');
            card.classList.add('card', `card-num_${index}`, `${categoryKey}-${index}`);
            card.id = `dish-${index}`;

            if (cartData[categoryKey]) {
                const cartItem = cartData[categoryKey].items.find(ci => ci.name[data.language] === item.name[data.language]);
                if (cartItem && Object.values(cartItem.count).some(cnt => cnt > 0)) {
                    card.classList.add('_inCart');
                };
            };
            card.innerHTML = `
                <div class="card__img">
                    <img src="${item.img}" alt="">
                </div>
                <div class="card__content">
                    <div class="card__info">
                        <h3 class="card__name">${item.name[data.language]}</h3>
                        <p class="card__description">${item.description[data.language]}</p>
                    </div>
                    <div class="card__price">
                        ${Object.keys(item.price).map(key => {
                let value = 0;
                if (cartData[categoryKey]) {
                    const cartItem = cartData[categoryKey].items.find(ci => ci.name[data.language] === item.name[data.language]);
                    if (cartItem && cartItem.count[key]) {
                        value = cartItem.count[key];
                    };
                };
                return `
                                <div class="card__portion">
                                    <p class="portion__name">${languageData[data.language].forJs.portion} <span class="portion__size">${key}</span> — <span class="portion__price">${item.price[key]}</span>$</p>
                                    <div class="portion__management">
                                        <button class="portion__remove" data-category="${categoryKey}" data-index="${index}" data-size="${key}">-</button> 
                                        <input type="number" disabled id="_input-${categoryKey}-${index}-${key}" class="portion__count size-${key}" data-category="${categoryKey}" data-index="${index}" data-size="${key}" value="${value}">
                                        <button class="portion__add" data-category="${categoryKey}" data-index="${index}" data-size="${key}">+</button> 
                                    </div>
                                </div>`;
            }).join('')}
                    </div>
                </div>`;

            const addButtons = card.querySelectorAll('.portion__add');
            const removeButtons = card.querySelectorAll('.portion__remove');

            addButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const category = button.getAttribute('data-category');
                    const index = button.getAttribute('data-index');
                    const dishData = dishesData[category].items[index];
                    dishData.index = index;
                    const portionName = button.getAttribute('data-size');
                    updateMenu(category, dishData, index, portionName, 'add');
                });
            });

            removeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const category = button.getAttribute('data-category');
                    const index = button.getAttribute('data-index');
                    const dishData = dishesData[category].items[index];
                    dishData.index = index;
                    const portionName = button.getAttribute('data-size');
                    const input = document.querySelector(`input[data-category="${category}"][data-index="${index}"][data-size="${portionName}"]`);
                    const currentValue = parseInt(input.value, 10) || 0;
                    updateMenu(category, dishData, index, portionName, 'remove');
                });
            });

            dishesList.appendChild(card);
        });

        section.appendChild(dishesList);
        if (section.querySelector('.card')) {
            navContainer.appendChild(navLink);
            if (categoryKey.startsWith('X0-')) {
                section.classList.add('_action');
                dishesContainer.insertBefore(section, navContainer.nextSibling)
            } else dishesContainer.appendChild(section);
        };
    });

    const firstNavLink = navContainer.querySelector('.dishes__link');
    if (firstNavLink) {
        firstNavLink.classList.add('_active');
    };
};

export function renderCart() {
    document.querySelector('.cart__list').innerHTML = `
            <div class="cart__total">
                <h2></h2>
            </div>`;
    Object.keys(cartData).forEach(categoryKey => {
        const category = cartData[categoryKey];
        const section = document.createElement('section');
        section.classList.add('section');
        section.id = categoryKey;
        section.innerHTML = `<h2>${category.name[data.language]}</h2>`;

        const dishesList = document.createElement('div');
        dishesList.classList.add('section__list');

        category.items.forEach((item, index) => {
            const card = document.createElement('div');
            card.classList.add('card', `card-num_${index}`, `${categoryKey}-${index}`);
            card.id = `dish-${index}`;
            card.innerHTML = `
                <div class="card__img">
                    <img src="${item.img}" alt="">
                </div>
                <div class="card__content">
                    <div class="card__info">
                        <h3 class="card__name">${item.name[data.language]}</h3>
                        <p class="card__description">${item.description[data.language]}</p>
                    </div>
                    <div class="card__price">
                        ${Object.keys(item.price).map(key => {
                let value = 0;
                if (cartData[categoryKey]) {
                    const cartItem = cartData[categoryKey].items.find(ci => ci.name[data.language] === item.name[data.language]);
                    if (cartItem && cartItem.count[key]) {
                        value = cartItem.count[key];
                    };
                };
                return `
                                <div class="card__portion">
                                    <p class="portion__name">${languageData[data.language].forJs.portion} <span class="portion__size">${key}</span> — <span class="portion__price">${item.price[key]}</span>$</p>
                                    <div class="portion__management">
                                        <button class="portion__remove" data-category="${categoryKey}" data-index="${index}" data-size="${key}">-</button> 
                                        <input type="number" disabled id="_input-${categoryKey}-${index}-${key}" class="portion__count size-${key}" data-category="${categoryKey}" data-index="${index}" data-size="${key}" value="${value}">
                                        <button class="portion__add" data-category="${categoryKey}" data-index="${index}" data-size="${key}">+</button> 
                                    </div>
                                </div>`;
            }).join('')}
                    </div>
                </div>`;

            const addButtons = card.querySelectorAll('.portion__add');
            const removeButtons = card.querySelectorAll('.portion__remove');

            addButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const category = button.getAttribute('data-category');
                    const index = button.getAttribute('data-index');
                    const dishData = dishesData[category].items[index];
                    dishData.index = index;
                    const portionName = button.getAttribute('data-size');
                    updateMenu(category, dishData, index, portionName, 'add');
                });
            });

            removeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const category = button.getAttribute('data-category');
                    const index = button.getAttribute('data-index');
                    const dishData = dishesData[category].items[index];
                    dishData.index = index;
                    const portionName = button.getAttribute('data-size');
                    const input = document.querySelector(`input[data-category="${category}"][data-index="${index}"][data-size="${portionName}"]`);
                    const currentValue = parseInt(input.value, 10) || 0;
                    updateMenu(category, dishData, index, portionName, 'remove');
                });
            });

            dishesList.appendChild(card);
        });

        section.appendChild(dishesList);
        if (section.querySelector('.card')) {
            document.querySelector('.cart__list').insertBefore(section, document.querySelector('.cart__total'));
        };
    });
    const totalPrice = calcTotal();

    payData.totalPrice = totalPrice;
    const totalElement = document.querySelector('.cart__total h2');
    if (totalElement) {
        totalElement.innerHTML = `${languageData[data.language]['forJs'].total} ${totalPrice}${data.valute} `;
    };
};

export function updateMenu(categoryName, dishData, index, portionName, action) {
    if (!cartData[categoryName] && action === 'remove') {
        return;
    } else if (!cartData[categoryName]) {
        cartData[categoryName] = { items: [], name: dishesData[categoryName].name };
    };
    const input = document.querySelector(`input[data-category="${categoryName}"][data-index="${index}"][data-size="${portionName}"]`);
    const cardDom = input.parentNode.parentNode.parentNode.parentNode.parentNode;
    let cartItem = cartData[categoryName].items.find(item => item.name[data.language] === dishData.name[data.language]);

    const cartInput = document.querySelector(`.cart__list input[data-category="${categoryName}"][data-index="${index}"][data-size="${portionName}"]`);


    if (!cartItem && action === 'add') {
        cartItem = { ...dishData, count: {}, index };

        cartData[categoryName].items.push(cartItem);
    };



    if (cartItem) {
        if (!cartItem.count[portionName]) {
            cartItem.count[portionName] = 0;
        };

        if (action === 'add') {
            cartItem.count[portionName] += 1;
        } else if (action === 'remove' && cartItem.count[portionName] > 0) {
            cartItem.count[portionName] -= 1;
        };

        try {
            const item = cartData[categoryName].items.find(item => item.name[data.language] === dishData.name[data.language]);

            let sum = Object.values(item.count).some(cnt => cnt > 0);
            
            if (sum > 0) {
                cardDom.classList.add('_inCart');
            } else {
                cardDom.classList.remove('_inCart');
            };
        } catch (error) {
            console.log(error);

        };

        if (input) {
            input.value = cartItem.count[portionName] || 0;
        };

        if (cartInput) {
            cartInput.value = cartItem.count[portionName] || 0;
        } else if (!cartInput && cartItem.count[portionName] > 0) {
            let categorySection = document.querySelector(`.cart__list #${categoryName}`);

            if (!categorySection) {
                categorySection = document.createElement('section');
                categorySection.classList.add('section');
                categorySection.id = categoryName;
                categorySection.innerHTML = `
                    <h2>${dishesData[categoryName].name[data.language]}</h2>
                    <div class="section__list"></div>
                `;
                const cartList = document.querySelector('.cart__list');
                const totalElement = document.querySelector('.cart__total');
                cartList.insertBefore(categorySection, totalElement);
            };

            let cartCard = categorySection.querySelector(`.${categoryName}-${index}`);

            if (!cartCard) {
                cartCard = document.createElement('div');
                cartCard.classList.add('card', `card-num_${index}`, `${categoryName}-${index}`);
                cartCard.id = `dish-${index}`;
                cartCard.innerHTML = `
                    <div class="card__img">
                        <img src="${dishData.img}" alt="">
                    </div>
                    <div class="card__content">
                        <div class="card__info">
                            <h3 class="card__name">${dishData.name[data.language]}</h3>
                            <p class="card__description">${dishData.description[data.language]}</p>
                        </div>
                        <div class="card__price"></div>
                    </div>
                `;
                categorySection.querySelector('.section__list').appendChild(cartCard);
            };

            let portionElement = cartCard.querySelector(`.size-${portionName}`);
            if (!portionElement) {
                const priceContainer = cartCard.querySelector('.card__price');
                const portionDiv = document.createElement('div');
                portionDiv.classList.add('card__portion');
                if (data.xType != 'basic') {
                    portionDiv.innerHTML = `
                        <p class="portion__name">${languageData[data.language].forJs.portion} <span class="portion__size">${portionName}</span> — <span class="portion__price">${dishData.price[portionName]}</span>$</p>
                        <div class="portion__management">
                            <button class="portion__remove" data-category="${categoryName}" data-index="${index}" data-size="${portionName}">-</button> 
                            <input type="number" disabled class="portion__count size-${portionName}" data-category="${categoryName}" data-index="${index}" data-size="${portionName}" value="${cartItem.count[portionName]}">
                            <button class="portion__add" data-category="${categoryName}" data-index="${index}" data-size="${portionName}">+</button> 
                        </div>
                    `;
                } else {
                    // portionDiv.innerHTML = `
                    //     <p class="portion__name">${languageData[data.language].forJs.portion} <span class="portion__size">${portionName}</span> — ${cartItem.count[portionName]} (<span class="portion__price">${dishData.price[portionName] }</span>$)</p>
                    // `;
                    portionDiv.innerHTML = `
                        <p class="portion__name">${languageData[data.language].forJs.portion} <span class="portion__size">${portionName}</span> — <input type="number" disabled class="portion__count basic size-${portionName}" data-category="${categoryName}" data-index="${index}" data-size="${portionName}" value="${cartItem.count[portionName]}"></p>
                    `;
                };

                priceContainer.appendChild(portionDiv);

                if (data.xType != 'basic') {
                    const addButton = portionDiv.querySelector('.portion__add');
                    const removeButton = portionDiv.querySelector('.portion__remove');

                    addButton.addEventListener('click', () => {
                        updateMenu(categoryName, dishData, index, portionName, 'add');
                    });

                    removeButton.addEventListener('click', () => {
                        if (cartItem.count[portionName] === 1) {
                            showConfirmationPopup(() => {
                                updateMenu(categoryName, dishData, index, portionName, 'remove');
                            });
                        } else {
                            updateMenu(categoryName, dishData, index, portionName, 'remove');
                        };
                    });
                };
            } else {
                portionElement.value = cartItem.count[portionName];
            };
        };

        const totalPortions = Object.values(cartItem.count).reduce((sum, count) => sum + count, 0);

        if (cartInput && cartItem.count[portionName] == 0) {
            const portionElement = cartInput.closest('.card__portion');

            if (portionElement) {
                portionElement.remove();
                delete cartItem.count[portionName];
            };
        };

        if (totalPortions === 0) {
            const cartCard = document.querySelector(`.cart__list .${categoryName}-${index}`);
            if (cartCard) {
                cartCard.remove();
                cartData[categoryName].items = cartData[categoryName].items.filter(item =>
                    item.name[data.language] !== cartItem.name[data.language]
                );
            };

            if (cartData[categoryName].items.length === 0) {
                const categorySection = document.querySelector(`.cart__list #${categoryName}`);
                if (categorySection) {
                    categorySection.remove();
                };
                delete cartData[categoryName];
            };
        };
    };

    const totalPrice = calcTotal();

    payData.totalPrice = totalPrice;
    const totalElement = document.querySelector('.cart__total h2');
    if (totalElement) {
        totalElement.innerHTML = `${languageData[data.language]['forJs'].total} ${totalPrice}${data.valute} `;
    };




    let cart = {
        dishes: cartData,
        table: sessionStorage.getItem(textToId(data.name) + '-table'),
        time: new Date(),
    };
    
    if (Object.keys(cartData).length > 0) document.querySelector('.nav__cart').classList.add('_notEmpty')
    else document.querySelector('.nav__cart').classList.remove('_notEmpty')
    

    localStorage.setItem(textToId(data.name) + '-cart', JSON.stringify(cart));
};

function showConfirmationPopup(onConfirm) {
    const confirmPopup = createPopup(languageData[data.language]['forJs'].surePortions);
    let btns = {};
    btns[languageData[data.language]['.popup__button_ok']] = function () {
        onConfirm();
        confirmPopup.closePopup();
    };
    btns[languageData[data.language]['.popup__button_cancel']] = confirmPopup.closePopup;
    confirmPopup.createButtons(btns);
};


export function renderText() {
    Object.keys(languageData[data.language]).forEach(el => {
        if (el !== 'forJs') {
            const element = document.querySelector(el);
            if (element) {
                element.innerHTML = languageData[data.language][el];
            };
        };
    });
    const languages = data.languages.map(item => item.trim());
    const currentLanguage = data.language;
    const otherLanguages = languages.filter(lang => lang !== currentLanguage);
    
    let changeLangDom = document.querySelector('.nav__changeLang')

    if (otherLanguages.length == 1) {
        changeLangDom.innerHTML = `<a href="./menu-${otherLanguages[0]}.html">${otherLanguages[0].toUpperCase()}</a>`
    } else {
        changeLangDom.innerHTML = otherLanguages.map(lang => `<a href="./menu-${lang}.html">${lang.toUpperCase()}</a>`).join(' | ');
    };
};