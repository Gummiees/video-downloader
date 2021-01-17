import { Readable } from 'stream';
import streamToBlob from 'stream-to-blob';
import ytdl, { chooseFormatOptions, videoInfo } from 'ytdl-core';

function downloadBlob(blob: Blob): string {
  const blobUrl = URL.createObjectURL(blob);
  return blobUrl;
}

function validateUrl(url: string): boolean {
  return ytdl.validateURL(url) && ytdl.validateID(ytdl.getURLVideoID(url));
}

async function downloadFromYoutube(url: string): Promise<[string, string]> {
  if (!validateUrl(url)) {
    throw 'That is not youtube URL.';
  }

  const info: videoInfo = await ytdl.getInfo(url);
  const formatOptions: chooseFormatOptions = { quality: 'highestvideo' };
  const stream: Readable = ytdl.downloadFromInfo(info, formatOptions);
  const blob: Blob = await streamToBlob(stream, 'video/mp4');
  const fileName: string = `${info.videoDetails.title}.mp4`;
  return [downloadBlob(blob), fileName];
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'download-video') {
    const url: string = request.url;
    if (url) {
      downloadFromYoutube(url).then((values) => {
        console.log("values", values);
        chrome.downloads.download({ url: values[0], filename: values[1], saveAs: true }, function (downloadItemId) {
        });
      });
    }
  }
});
