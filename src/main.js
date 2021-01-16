
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

chrome.extension.onMessage.addListener((request) => {
  if (request.action === 'download-video') {
    const url = request.url;
    if (url) {
      downloadFromYoutube(url).then((values) => {
        console.log("values", values);
        chrome.downloads.download({ url: values[0], filename: values[1], saveAs: true }, function (downloadItemId) {
        });
      });
    }
  }
});
