//http://stackoverflow.com/questions/11661613/chrome-devpanel-extension-communicating-with-background-page

// Function to send a message to all devtool.html views:
var ports = {}, notifyDevtools = function (msg) {
    Object.keys(ports).forEach(function(portId_) {
        ports[portId_].postMessage(msg);
    });
}

chrome.extension.onConnect.addListener(function(port) {
    if (port.name !== "devtools") return;
    ports[port.portId_] = port;
    // Remove port when destroyed (eg when devtools instance is closed)
    port.onDisconnect.addListener(function(port) {
        delete ports[port.portId_];
    });
    port.onMessage.addListener(function(newIconDetails) {
        // Whatever you wish
        chrome.pageAction.show(newIconDetails.tabId);
        chrome.pageAction.setIcon({
            tabId: newIconDetails.tabId,
            path: newIconDetails.path
        });
    });
});

chrome.extension.onRequest.addListener(function(response) {
    notifyDevtools('refresh');
});
