var keyPressManager = {
	tabId: null,
	lastSendMessageDate: null,
	
	onKeyPress: function(e) {
		var seconds = 10;
		var date = new Date();

		if (keyPressManager.lastSendMessageDate != null) {
			seconds = (date - keyPressManager.lastSendMessageDate) / 1000;
		}
		
		if (seconds > 3) {
			keyPressManager.lastSendMessageDate = date;
			e = e || window.event;
			chrome.runtime.sendMessage({tabId: keyPressManager.tabId, action: 'resetInterval'});
		}
	},
	
	remove: function() {
		document.removeEventListener('keypress', keyPressManager.onKeyPress);
	},
	
	setup: function(tabId) {
		keyPressManager.tabId = tabId;
		keyPressManager.remove();
		document.addEventListener('keypress', keyPressManager.onKeyPress);
	}
};
