const Store = require('electron-store');
const store = new Store();
const electron = require('electron');
const { ipcRenderer } = electron;

const mainContainer = document.querySelector('.container');

let rowCount = Math.ceil(store.size / 3);

function generateDOM(rows) {

    let colArr = [];
    mainContainer.innerHTML = "";
    for (let item of store) {
        let cols4 = document.createElement('div');
        cols4.classList.add('col'); cols4.classList.add('s4');

        let card = document.createElement('div');
        card.classList.add('card');

        let cardImage = document.createElement('div');
        cardImage.classList.add('card-image');
        let img = document.createElement('img');
        img.src = item[1];
        cardImage.appendChild(img);
        card.appendChild(cardImage);

        let cardAction = document.createElement('div');
        cardAction.classList.add('card-action');

        let setWallpaperBtn = document.createElement('button');
        setWallpaperBtn.classList.add('waves-effect', 'waves-light', 'btn-small');
        setWallpaperBtn.dataset.function = 'set-wallpaper';
        setWallpaperBtn.dataset.imgsrc = img.src;
        setWallpaperBtn.innerText = 'Set as wallpaper';
        setWallpaperBtn.addEventListener('click', setWallpaper);
        cardAction.appendChild(setWallpaperBtn);

        let progressText = document.createElement('p');
        progressText.classList.add('center-align');
        cardAction.appendChild(progressText);

        let deleteBtn = document.createElement('button');
        deleteBtn.classList.add('waves-effect', 'waves-light', 'btn-small');
        deleteBtn.dataset.imageName = img.src.split('/').pop().split('.')[0];
        deleteBtn.innerText = 'Delete';
        deleteBtn.dataset.function = 'delete';
        deleteBtn.addEventListener('click', deleteWallpaper);
        cardAction.appendChild(deleteBtn);

        card.appendChild(cardAction);
        cols4.appendChild(card);

        colArr.push(cols4);
    }
    for (let i = 0; i < colArr.length; i += 3) {
        let row = document.createElement('div');
        row.classList.add('row');
        if (colArr[i]) row.appendChild(colArr[i]);
        if (colArr[i + 1]) row.appendChild(colArr[i + 1]);
        if (colArr[i + 2]) row.appendChild(colArr[i + 2]);
        mainContainer.appendChild(row);
    }
}

generateDOM(rowCount);

// document.querySelectorAll('button[data-function="set-wallpaper"]').forEach(button => {
//     button.addEventListener('click', setWallpaper);
// });

// document.querySelectorAll('button[data-function="delete"]').forEach(button => {
//     button.addEventListener('click', deleteWallpaper);
// })

function deleteWallpaper(e) {
    console.log(this.dataset.imageName);
    store.delete(this.dataset.imageName);
    rowCount = Math.ceil(store.size / 3);
    generateDOM(rowCount);
}

function setWallpaper(e) {
    console.log(this);
    const imageURL = this.dataset.imgsrc;
    ipcRenderer.send('wallpaper:url', imageURL);
    this.nextSibling.innerText = "please wait..."
    ipcRenderer.on('download-finish', event => {
        this.nextSibling.innerText = '';
    })
}