document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
});

const electron = require('electron');
const { ipcRenderer } = electron;
const Store = require('electron-store');
const store = new Store();

const wallpaper = document.getElementById('main-wallpaper');
const getNewBtn = document.getElementById('get-new');
const selectField = document.getElementById('subreddit-select');
const favouriteBtn = document.getElementById('set-favourite');

getNewBtn.addEventListener('click', e => {
    getWallpaper(selectField.value || 'wallpapers');
});

function getWallpaper(subreddit) {
    wallpaper.src = "svg/Double Ring-1.5s-200px.svg";
    let url = new URL(`https://www.reddit.com/r/${subreddit}/top/.json`);
    let params = {
        't': 'day',
    }
    url.search = new URLSearchParams(params);

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            const topPost = myJson.data.children[0];
            const imageThumbnail = topPost.data.thumbnail;
            const imageURL = topPost.data.url;
            wallpaper.src = imageURL;
        });

}

getWallpaper('wallpapers');

document.getElementById('set-wallpaper').addEventListener('click', setWallpaper);


function setWallpaper(e) {
    const imageURL = wallpaper.src;
    ipcRenderer.send('wallpaper:url', imageURL);
    document.getElementById('dl-progress').innerText = 'Please wait while wallpaper is downloading...';
    ipcRenderer.on('download-finish', event => {
        document.getElementById('dl-progress').innerText = 'Download finished!';
    })
}

favouriteBtn.addEventListener('click', e => {
    const imageURL = wallpaper.src;
    const imageName = imageURL.split('/').pop();
    // store.set(String(store.size), imageURL);
    store.set(imageName.split('.').shift(), imageURL);
    // store.set(imageName, imageURL);
})
