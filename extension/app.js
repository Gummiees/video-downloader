document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('dw-yt-mp3').addEventListener('click', () => {
    const url = document.getElementById('url-yt-dw').value;
    chrome.runtime.sendMessage({ action: 'yt-mp3', url: url }, dealWithResponse);
  });
  document.getElementById('dw-yt-mp4').addEventListener('click', () => {
    const url = document.getElementById('url-yt-dw').value;
    chrome.runtime.sendMessage({ action: 'yt-mp4', url: url }, dealWithResponse);
  });
});

function dealWithResponse(response) {
  if (response && response.error) {
    createErrorAlert(response.error);
  }
}

function createSuccessAlert() {
  createAlert('success', 'The video was downloaded successfully.');
}
function createErrorAlert(error) {
  createAlert('danger', error);
}
function createAlert(alertType, message) {
  var alertDiv = `<div class="alert alert-${alertType} alert-dismissible fade show" role="alert">`;
  var closeButton = '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
  var closeDiv = '</div>';
  document.getElementById('alert-placeholder').innerHTML = alertDiv + message + closeButton + closeDiv;
}