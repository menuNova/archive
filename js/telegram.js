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