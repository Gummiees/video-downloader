import { Readable } from 'stream';
import streamToBlob from 'stream-to-blob';
import ytdl, { chooseFormatOptions, videoInfo } from 'ytdl-core';

function downloadBlob(blob: Blob, name: string): string {
  const blobUrl: string = URL.createObjectURL(blob);
  return blobUrl;
  // const link: HTMLAnchorElement = document.createElement('a');
  // link.href = blobUrl;
  // link.download = name;
  // document.body.appendChild(link);
  // link.dispatchEvent(
  //   new MouseEvent('click', {
  //     bubbles: true,
  //     cancelable: true,
  //     view: window,
  //   })
  // );
  // document.body.removeChild(link);
}

export async function DownloadFromYoutube(url: string): Promise<string> {
  if (!ytdl.validateURL(url) || !ytdl.validateID(ytdl.getURLVideoID(url))) {
    throw 'That is not youtube URL.';
  }

  const info: videoInfo = await ytdl.getInfo(url);
  const formatOptions: chooseFormatOptions = { quality: 'highestvideo' };
  const stream: Readable = ytdl.downloadFromInfo(info, formatOptions); /*.pipe(fs.createWriteStream(videoName))*/
  const blob: Blob = await streamToBlob(stream, 'video/mp4');
  const videoName: string = `${info.videoDetails.title}.mp4`;
  return downloadBlob(blob, videoName);
}
