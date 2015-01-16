// http://stackoverflow.com/questions/11661613/chrome-devpanel-extension-communicating-with-background-page

chrome.devtools.panels.create("HTML validator", "devtools.png", "devtools_panel.html", function(extensionPanel) {

    var report, _writeReport, updateIcon, _window, callbackQueue = [], port;

    _writeReport = function(data) {
        report += String.fromCharCode(data);
    };

    port = chrome.extension.connect({name:"devtools"});

    updateIcon = function(newIcon) {
        port.postMessage({
            tabId: chrome.devtools.inspectedWindow.tabId,
            path: newIcon
        });
    };

    FS.init(function() {
        return null;
    }, _writeReport, _writeReport);

    function updateHtmlReport(callback) {
        report = '';
        updateIcon('loading.gif');
        chrome.devtools.network.getHAR(function(result) {
            var toBeInspectedHarEntry;
            result.entries.forEach(function (harEntry) {
                if (toBeInspectedHarEntry === undefined) {
                    //look for the first HTML page in the entries
                    if (harEntry.response.content.size > 0 && harEntry.response.content.mimeType === 'text/html') {
                        toBeInspectedHarEntry = harEntry;
                    }
                }
            });
            if (toBeInspectedHarEntry === undefined) {
                report = 'No requests captured. Reload the page to validate the source.';
				updateIcon('html.png');
                callback(report);
            } else {
                toBeInspectedHarEntry.getContent(function (body) {
                    FS.createDataFile('/', 'input.html', body, true, true);
                    Module.run(['-qe', 'input.html']);
                    FS.deleteFile('/input.html');
                    if (report.length === 0) {
                        updateIcon('flag_green.png');
                        report = 'This page contains valid HTML';
                        callback(report);
                    } else {
                        updateIcon('flag_' + (/Error:/.test(report) ? 'red' : 'orange') + '.png');
                        callback(report);
                    }
                });
            }
        });
    }

    function makeAndWriteReport() {
        if (_window) {
            updateHtmlReport(_window.writeReport);
        } else {
            updateHtmlReport(function () { });
            callbackQueue.push(function () {
                _window.writeReport(report);
            });
        }
    };

    extensionPanel.onShown.addListener(function tmp(panelWindow) {
        extensionPanel.onShown.removeListener(tmp); // Run once only
        _window = panelWindow;

        // Release queued data
        var callback;
        while (callback = callbackQueue.shift()) {
            callback();
        }
    });

    //Update straigt away and on page refresh
    port.onMessage.addListener(makeAndWriteReport);
    makeAndWriteReport();
});

