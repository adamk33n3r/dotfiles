/*
 * Made in 2010 by Denis Alyanov.
 * Based on RapidShare DownloadHelper by Yevgeny Androv (yevgenyandrov@gmail.com).
 *
 */
var dfDownloadHelper = {}

dfDownloadHelper.onLoad = function() 
{

	var downloadcounter = document.getElementById("download_waiter");
	if (downloadcounter) {
		
		var f = document.links;
		
					for (i=0;i<f.length;i++) {
						if (f[i].href.indexOf("fileshare")>0) {
							window.location.href = f[i].href;
							return;
						}
					}
		
		/*
		Old code
		Searching through forms
		
		var f = document.forms;
					for (i=0;i<f.length;i++) {
						if (f[i].action.indexOf("fileshare")>0) {
							f[i].submit();
							return;
						}
					}
		*/			
	}
	else {
		//redirecting to Free Downloading
		var f = document.forms;
				for (i=0;i<f.length;i++) {
					if (f[i].action.indexOf("/files/")>0) {
						f[i].submit();
						return;
					}
				}	
	}

}
dfDownloadHelper.onLoad();
