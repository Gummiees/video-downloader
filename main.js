
const ytdl = require('ytdl-core');
const streamToBlob = require('stream-to-blob');

function downloadBlob(blob) {
  const blobUrl = URL.createObjectURL(blob);
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

function validateUrl(url) {
  return ytdl.validateURL(url) && ytdl.validateID(ytdl.getURLVideoID(url));
}

async function downloadFromYoutube(url) {
  if (!validateUrl(url)) {
    throw 'That is not youtube URL.';
  }

  const info = await ytdl.getInfo(url);
  const formatOptions = { quality: 'highestvideo' };
  const stream = ytdl.downloadFromInfo(info, formatOptions); /*.pipe(fs.createWriteStream(videoName))*/
  const blob = await streamToBlob(stream, 'video/mp4');
  const fileName = `${info.videoDetails.title}.mp4`;
  return [downloadBlob(blob), fileName];
}

module.downloadFromYoutube = downloadFromYoutube;