# video-downloader
This extension allows you to download videos.

## How to install
1. [Download the latest version of this project](https://github.com/likefurnis/yt-dw/releases/latest)
1. Navigate to `chrome://extensions/`
2. Allow `developer mode`
3. Click `Load Unpacked Extension`
4. Navigate to the local folder where you downloaded this project
5. Click `Select folder`

You're now good to go 🎉

## I found a bug
[Create a new bug issue!](https://github.com/likefurnis/video-downloader/issues/new)

## I have a new idea
[Create a new discussion!](https://github.com/likefurnis/video-downloader/discussions/categories/ideas)

## How to use
For now, you can only download videos from YouTube either with MP3 format or MP4. It will download the best quality it can.
You can do so both from the extension icon or from the injected buttons on YouTube under the video title.

## How to modify
If you want to help me out with my TODO list, have some ideas, or found some bugs, please open a new issue, I'll be more than happy to help.
To code on this app, you need to:
1. Download the project
2. `npm i`
3. If you want to modify `main.ts`, which is basically `background.js` unpackaged, write your code, and then execute `npm start`. The result code will replace the file `background.js` from the `extension` folder.
4. If you want to modify any other file under the `extension` folder, you can just do so.
5. Do the process described before on **How to install**
6. Test your changes

## How to debug
You can print console.logs from both `app.js` and `main.ts`. The ones from `app.js` will apear on the current tab, while the ones from `background.js` (aka `main.ts`), will appear on the dedicated DevTools for the page. To access it, you have to:
1. Go to `chrome://extensions/`
2. Search the installed extension
3. Click on `inspect views background.html`

## TODO
1. Download videos from Tumblr
2. Download videos from Twitter
3. Download videos from TikTok
