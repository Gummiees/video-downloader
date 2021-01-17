import { Readable } from 'stream';
import ytdl, { chooseFormatOptions, videoInfo } from 'ytdl-core';

enum ActionType {
  youtubeMp3 = 'yt-mp3',
  youtubeMp4 = 'yt-mp4',

}

enum FileType {
  mp3 = 'mp3',
  mp4 = 'mp4'
}

enum MIMEType {
  mp3 = 'audio/*',
  mp4 = 'video/mp4'
}

enum YoutubeQuality {
  highestvideo = 'highestvideo',
  highestaudio = 'highestaudio'
}

function getFileType(action: ActionType): FileType {
  switch (action) {
    case ActionType.youtubeMp3:
      return FileType.mp3;
    case ActionType.youtubeMp4:
      return FileType.mp4;
    default:
      throw `There is no file type for the action '${action}'.`;
  }
}

function getMIMEType(action: ActionType): MIMEType {
  switch (action) {
    case ActionType.youtubeMp3:
      return MIMEType.mp3;
    case ActionType.youtubeMp4:
      return MIMEType.mp4;
    default:
      throw `There is no MIME type for the action '${action}'.`;
  }
}

async function downloadBlob(reader: Readable, type: MIMEType): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    reader.on('data', (chunk: Uint8Array) => chunks.push(chunk))
    .once('end', () => {
      const blob: Blob = new Blob(chunks, {type: type});
      const blobUrl = URL.createObjectURL(blob);
      resolve(blobUrl);
    })
    .once('error', (err) => reject(err));
  })
}

function validateUrl(url: string): boolean {
  return ytdl.validateURL(url) && ytdl.validateID(ytdl.getURLVideoID(url));
}

function getYoutubeQuality(action: ActionType): YoutubeQuality {
  if (!isYoutubeAction(action)) {
    throw 'The action is not a YouTube action.';
  }

  return action === ActionType.youtubeMp3 ? YoutubeQuality.highestaudio : YoutubeQuality.highestvideo;
}

async function downloadFromYoutube(url: string, action: ActionType): Promise<[string, string]> {
  if (!isYoutubeAction(action)) {
    throw 'The action required is not a YouTube action.';
  }
  if (!validateUrl(url)) {
    throw 'The URL is not a valid YouTube URL.';
  }

  const info: videoInfo = await ytdl.getInfo(url);
  const quality: YoutubeQuality = getYoutubeQuality(action);
  const formatOptions: chooseFormatOptions = { quality: quality };
  const stream: Readable = ytdl.downloadFromInfo(info, formatOptions);
  const blobUrl: string = await downloadBlob(stream, getMIMEType(action));

  const fileName: string = `${info.videoDetails.title}.${getFileType(action)}`;
  return [blobUrl, fileName];
}

function isYoutubeAction(action: string): boolean {
  return action === ActionType.youtubeMp3 || action === ActionType.youtubeMp4;
}

// Listen for app.js (popup.html) events
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    if (request.action && request.url) {
      if (!isYoutubeAction(request.action)) {
        throw 'The action required is not a YouTube action.';
      }
  
      const url: string = request.url;
      if (!validateUrl(url)) {
        throw 'The URL is not a valid YouTube URL.';
      }
  
      downloadFromYoutube(url, request.action).then((values) => {
        chrome.downloads.download({ url: values[0], filename: values[1], saveAs: true }, (downloadedItem: number) => sendResponse({ success: 'yay!' }));
      });
      return true;
    }
  } catch (e) {
    sendResponse({ error: e });
  }
});