//chrome.extension.sendMessage is not yet fully supported in all versions of Chrome, using deprecated sendRequest
chrome.extension.sendRequest({}, function(response) {});