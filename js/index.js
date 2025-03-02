
let table = new URLSearchParams(window.location.search).get('table');
if (table) {
    sessionStorage.setItem(textToId(data.name) + '-table', table)
};

for (let i = 0; i < indexData.length; i++) {
    const el = indexData[i];
    document.querySelector(el[0]).innerHTML = el[1];
};

document.title = data.name;
