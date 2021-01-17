import { Readable } from 'stream';
import ytdl, { chooseFormatOptions, videoInfo } from 'ytdl-core';

async function downloadBlob(reader: Readable): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    reader.on('data', (chunk: Uint8Array) => chunks.push(chunk))
    .once('end', () => {
      const blob: Blob = new Blob(chunks, {type: 'video/mp4'});
      const blobUrl = URL.createObjectURL(blob);
      console.log('blob url', blobUrl);
      resolve(blobUrl);
    })
    .once('error', (err) => {
      console.error('error', err);
      reject();
    });
  })
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
  const fileName: string = `${info.videoDetails.title}.mp4`;
  const blobUrl: string = await downloadBlob(stream);
  return [blobUrl, fileName];
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
