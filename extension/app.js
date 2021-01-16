document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('dw-yt').addEventListener('click', () => {
    const url = document.getElementById('url-yt-dw').value;
    chrome.extension.sendMessage({ action: 'download-video', url: url });
  });
});
