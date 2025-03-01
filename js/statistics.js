import { sendBot } from "./telegram.js";

export function submitToGoogleForm(dataArg) {
    if (data.xType != 'premium') return
    const url = formStore.action;
    const formData = new FormData();
    for (const key in dataArg) {
        if (dataArg.hasOwnProperty(key)) {
            formData.append(key, dataArg[key]);
        };
    };
    fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    }).then(() => {
        let a = 0;
    }).catch(error => {
        console.error('Submission error:', error);
    });
};

let start = null;
let startDat = null;

export function sendStat() {
    let dataNow = (new Date).getMinutes() + ':' + (new Date).getSeconds();
    if (!start) {
        start = data.name + ': ' + dataNow;
        startDat = new Date();
    } else {
        start += '-' + dataNow + '=' + new Date(new Date() - startDat).getSeconds();
        sendBot(start, ['-1002371354041']);
    };
};