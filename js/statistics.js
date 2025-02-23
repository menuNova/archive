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

