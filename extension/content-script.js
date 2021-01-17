var first_load = true;
var interval = 500;
var RETRY_LIMIT = 20;
var mp3ButtonId = 'dw-yt-mp3';
var mp4ButtonId = 'dw-yt-mp4';
var mp3ButtonText = 'Download MP3';
var mp4ButtonText = 'Download MP4';
var buttonsId = [mp3ButtonId, mp4ButtonId];
var buttonsText = [mp3ButtonText, mp4ButtonText];

var buttonsMap = new Map();
buttonsId.forEach((buttonId, index) => {
    buttonsMap.set(buttonId, buttonsText[index]);
});

document.addEventListener("DOMContentLoaded", () => 
{
    start();
    youtubeListener();
});

function start() {
    var retry_count = 0;
    var checkExist = setInterval(() => {
        if (document.querySelectorAll('.title.style-scope.ytd-video-primary-info-renderer').length > 0) {
            init();
            clearInterval(checkExist);
        }
        retry_count = retry_count + 1;
        if (retry_count > RETRY_LIMIT) {
            clearInterval(checkExist);
        }
    }, interval);
}

function youtubeListener() {
    // trigger when loading new page 
    // (actually this would also trigger when first loading, that's not what we want, that's why we need to use firsr_load === false)
    // (new Material design version would trigger this "yt-navigate-finish" event. old version would not.)
    var body = document.getElementsByTagName("body")[0];
    body.addEventListener("yt-navigate-finish", (event) => {
        if (!pageIsVideo()) {
            return;
        }
        // if use click to another page, init again
        if (!first_load) {
            removeDownloadButton();
            init();
        }
    });
}

function pageIsVideo() {
    return getURLParameter('v') !== null;
}

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

Element.prototype.remove = () => {
    this.parentElement.removeChild(this);
};

function loadingButtons() {
    buttonsId.forEach(buttonId => {
        var button = document.getElementById(buttonId);
        if (button) {
            button.innerText = 'Loading...';
            button.disabled = true;
        }   
    });
}

function buttonsLoaded() {
    for (var [id, text] of buttonsMap.entries()) {
        var button = document.getElementById(id);
        if (button) {
            button.innerText = text;
            button.disabled = false;
        }
    }
}

function removeDownloadButton() {
    document.getElementById(mp4ButtonId).remove();
}

function init() {
    injectButtons();
    addEventListeners();
    first_load = false;
}

function injectButtons() {
    var title_element = document.querySelectorAll('.title.style-scope.ytd-video-primary-info-renderer');
    if (title_element) {
        for (var [id, text] of buttonsMap.entries()) {
            var button = document.createElement('button');
            var css_button = `
                background: transparent;
                border: none;
                color: var(--yt-spec-text-secondary);
                text-transform: uppercase;
                font-size: var(--ytd-tab-system_-_font-size);
                font-weight: var(--ytd-tab-system_-_font-weight);
                letter-spacing: var(--ytd-tab-system_-_letter-spacing);
                font-family: Roboto, Arial, sans-serif;
                cursor: pointer;
                margin: 5px;
                padding: 5px;
            `;
            button.setAttribute('style', css_button);
            button.id = id;
            button.innerText = text;
            title_element[0].appendChild(button);
        }
    }
}

function addEventListeners() {
    var mp3Button = document.getElementById(mp3ButtonId);
    if (mp3Button) {
        mp3Button.addEventListener('click', () => {
            if (!mp3Button.disabled) {
                loadingButtons();
                const url = window.location.href;
                chrome.runtime.sendMessage({ action: 'yt-mp3', url: url }, dealResponse);
            }
        });
    }

    var mp4button = document.getElementById(mp4ButtonId);
    if (mp4button) {
        mp4button.addEventListener('click', () => {
            if (!mp4ButtonId.disabled) {
                loadingButtons();
                const url = window.location.href;
                chrome.runtime.sendMessage({ action: 'yt-mp4', url: url }, dealResponse);
            }
        });
    }
}

function dealResponse(response) {
    buttonsLoaded();
  }