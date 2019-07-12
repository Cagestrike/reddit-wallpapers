const electron = require('electron');
const { ipcRenderer } = electron;

const wallpaper = document.getElementById('main-wallpaper');

function getWallpaper(subreddit) {
    wallpaper.src = "Double Ring-1.5s-200px.svg";
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
            console.log(myJson)
            const topPost = myJson.data.children[0];
            console.log(topPost);
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
// let response = await fetch(url);
// let myJson = await response.json();

// params.after = myJson.data.after;

// console.log(params);

// url.search = new URLSearchParams(params);

// response = await fetch(url);
// myJson = await response.json();