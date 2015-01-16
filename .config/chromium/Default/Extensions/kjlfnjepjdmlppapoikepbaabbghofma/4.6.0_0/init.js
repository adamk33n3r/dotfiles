/**
* Init Better Battlog for chrome
*/

var ivb = setInterval(function(){
    if(!document.head || !document.body || !window || !window.postMessage) return;
    clearInterval(ivb);

    var version = '4.6.0';

    // get settings from background page and than inject
    var port = chrome.extension.connect({name: "storage"});
    port.postMessage({"action" : "get"});
    port.onMessage.addListener(function(msg) {
        if (msg.action == "get"){
            inject(window.document, version, chrome.extension.getURL("shared"), msg.BBLogStorage);
        }
    });

    window.addEventListener("message", function(event) {
        if(event.data.action == "store"){
            port.postMessage({"action" : "save", "storageObject" : event.data.data});
        }
        }, false);
}, 5);
