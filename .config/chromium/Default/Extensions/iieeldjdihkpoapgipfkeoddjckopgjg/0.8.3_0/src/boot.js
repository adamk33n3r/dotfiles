dojo.require('dijit.layout.BorderContainer');
dojo.require('dijit.layout.ContentPane');
dojo.require('dijit.layout.TabContainer');
dojo.require('dijit.Dialog');
dojo.require('dijit.form.Select');

var config = {
    baseUrl: "/src",
}

var deps = [
    "sourcekit/application",
];

chrome.permissions.request({
    permissions: ['tabs', 'http://*.dropbox.com/*', 'https://*.dropbox.com/*'],
}, function(granted) {
	require(config, deps, function(Application) {
    	Application.start();
	});
});
