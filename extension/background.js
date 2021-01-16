import { downloadFromYoutube } from './bundle.js';

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
