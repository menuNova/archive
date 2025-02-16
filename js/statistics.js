function getUserData() {
    let date = new Date();
    console.log(navigator.onLine);
    
    const userData = {
        'Дата': `${date.getMonth() + 1}.${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
        'Язык': navigator.language.split('-')[0],
        'Платформа': navigator.userAgentData ? navigator.userAgentData.platform : '-', // Платформа
        'Источник': document.referrer && document.referrer !== document.URL ? document.referrer : '-',
        'Моибильное устройство': /Mobi|Android/i.test(navigator.userAgent) ? 'Да' : 'Нет',
        'Временной пояс': Intl.DateTimeFormat().resolvedOptions().timeZone,
        'Номер стола': sessionStorage.getItem('table'),
        'User Agent': navigator.userAgent,
    };
    

    return userData;
};



// Переменные для хранения данных бота
let botToken = '';
let chatIds = [];

// Загрузка конфигурации из config.php
document.addEventListener("DOMContentLoaded", function () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', './php/config.php', true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = xhr.responseText.trim();
            var [token, nul, ids] = response.split('\n', 3);
            botToken = token;
            chatIds = ids.slice(1, -1).replace(/'/g, "").split(",");
        }
    };
    xhr.send();
});




function sendToTelegram(message) {
    // if (navigator.userAgent == 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Unique/96.7.5796.97') return
    const BOT_TOKEN = botToken;
    const CHAT_ID = chatIds[0];
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    console.log(message);
    
    const params = {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML',
    };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(params));
}

// Функция для отслеживания входа и выхода пользователя
function trackUserData(action) {
    const userData = getUserData();
    let message = `
<b>Пользователь ${action}</b>
`;
    for (let i = 0; i < Object.keys(userData).length; i++) {
        const el = Object.keys(userData)[i];
        
        message += el + ': ' + userData[el] + '\n';
    };
    sendToTelegram(message);
}

if (data.xType == 'premium') {
    window.onload = () => {
        setTimeout(() => {
            if (sessionStorage.getItem('table')) trackUserData('зашёл на сайт');
        }, 1000);
    };

    window.onbeforeunload = () => {
        trackUserData('вышел с сайта');
    };
};

export function waitTable () {
    if (data.xType == 'premium') {
        trackUserData('зашёл на сайт');
    };
};