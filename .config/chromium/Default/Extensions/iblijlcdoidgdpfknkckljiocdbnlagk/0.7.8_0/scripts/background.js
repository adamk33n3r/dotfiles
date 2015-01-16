var url = 'https://www.googleapis.com/urlshortener/v1/url';
var key = 'AIzaSyCmN5_GBbpl1HY2cpYeFQxYAezI2dap5YA';
var timer = null;
var milliseconds = 10000;

var oauth = ChromeExOAuth.initBackgroundPage({
	'request_url' : 'https://www.google.com/accounts/OAuthGetRequestToken',
	'authorize_url' : 'https://www.google.com/accounts/OAuthAuthorizeToken',
	'access_url' : 'https://www.google.com/accounts/OAuthGetAccessToken',
	'consumer_key' : '692051292217.apps.googleusercontent.com',
	'consumer_secret' : 'V6weXcN08unD0badqVUmFVA2',
	'scope' : 'https://www.googleapis.com/auth/urlshortener',
	'app_name' : 'goo.gl URL Shortener Chrome extension',
});

function chromeExOAuthOnAuthorize(token, secret)
{
	if(typeof OnAuthorizeCallBack === 'function')
		 OnAuthorizeCallBack();
}

function copyToClipboard(text)
{
	var input = document.getElementById('url');
	
	if(input == undefined)
		return;
	
	input.value = text;					
	input.select();

	document.execCommand('copy', false, null);
}

function shortenUrl(longUrl, incognito, callback)
{	
	var auth = oauth.hasToken() && !incognito && preferencesGetter().history_enabled;
	
	var	xmlhttp = new XMLHttpRequest();
	xmlhttp.open('POST', url + '?key=' + key, true);
	xmlhttp.setRequestHeader('Content-Type', 'application/json');	
	
	if(auth)
		xmlhttp.setRequestHeader('Authorization', oauth.getAuthorizationHeader(url, 'POST', {'key': key}));
	
	xmlhttp.onreadystatechange = function()
	{
		if(xmlhttp.readyState == 4 && xmlhttp.status != 0) 
		{
			clearTimeout(timer);

			var response = JSON.parse(xmlhttp.responseText);

			if(response.id == undefined)
			{
				if(response.error.code == '401')
					oauth.clearTokens();
					
				callback({status: 'error', message: response.error.message});
			}
			else	
			{
				callback({status: 'success', message: response.id, added_to_history: auth});
			}
		}
	}

	xmlhttp.send(JSON.stringify({'longUrl': longUrl}));
	
	timer = setTimeout(function()
	{
		xmlhttp.abort();
		callback({status: 'error', message: chrome.i18n.getMessage('timeout_occurred')});
	}
	, milliseconds);
}

function onMessage(message, sender, callback) 
{		
	switch(message.type)
	{	
		case 'shortcut':
			chrome.tabs.getSelected(null, function(tab) 
			{	
				shortenUrl(tab.url, tab.incognito, function(response)
				{
					if(response.status != 'error')
					{
						if(message.shortcut == 'copy')
						{
							copyToClipboard(response.message);
						}
						else
						{
							tab.shortenedUrl = response.message;
							share(message.shortcut, tab);
						}
					}
								
					callback(response);
				});
			});
			
			return true;
			
		break;
		
		case 'preferences':	
			var shortcuts = shortcutsGetter();
			var preferences = preferencesGetter();
			shortcuts.shortcuts_enabled = preferences.shortcuts_enabled;
			
			callback(shortcuts);
		break;
	}
}

function init()
{
	createContextMenu();
	chrome.extension.onMessage.addListener(onMessage);
}

document.addEventListener('DOMContentLoaded', function () 
{
	init();
});