let botToken = '';
let chatIds = [];

document.addEventListener("DOMContentLoaded", function () {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', './php/config.php', true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      var response = xhr.responseText.trim();
      var [token, ids] = response.split('\n', 2);
      botToken = token;
      chatIds = ids.slice(1, -1).replace(/'/g, "").split(",");
    }
  };
  xhr.send();
});




export function sendBot(message, chatId_s = chatIds) {
  chatId_s.forEach(chatId => {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const params = {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    };
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(params));
  });
};

export function sendPro(paramsPro) {
  if (!paramsPro.chatId_s) paramsPro.chatId_s = chatIds
  paramsPro.chatId_s.forEach(chatId => {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const params = {
      chat_id: chatId,
      text: paramsPro.message,
      parse_mode: 'HTML'
    };

    if (paramsPro.replyTo !== null) {
      paramsPro.reply_to_message_id = paramsPro.replyTo;
    };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
      if (xhr.status === 200) {
        if (paramsPro.callback) paramsPro.callback(JSON.parse(xhr.responseText).result.message_id)
      } else {
        console.error('Ошибка при отправке:', xhr.status, xhr.statusText);
      }
    };

    xhr.send(JSON.stringify(params));
  });
};