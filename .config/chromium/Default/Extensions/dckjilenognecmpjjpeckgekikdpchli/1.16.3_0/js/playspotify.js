if("undefined"==typeof runningplayspotify){var runningplayspotify=!0,exports={};!function(){var e={},t={},n=2;chrome.storage.local.get(null,function(t){e=t,0==--n&&y()}),chrome.storage.sync.get(null,function(e){if(t=e,!t.test)for(var o in console)console[o]=function(){};0==--n&&y()});var o=function(n,o){if("local"==o)for(var r in n)e[r]=n[r].newValue;else if("sync"==o)for(var r in n)t[r]=n[r].newValue};chrome.storage.onChanged.addListener(o);var r=function(e,t,n){t=t||0,n=n||0;var o=document.createEvent("MouseEvents");o.initMouseEvent("mousedown",!0,!0,window,1,0,0,t,n,!1,!1,!1,!1,0,null),e.dispatchEvent(o),o=document.createEvent("MouseEvents"),o.initMouseEvent("click",!0,!0,window,1,0,0,t,n,!1,!1,!1,!1,0,null),e.dispatchEvent(o),o=document.createEvent("MouseEvents"),o.initMouseEvent("mouseup",!0,!0,window,1,0,0,t,n,!1,!1,!1,!1,0,null),e.dispatchEvent(o)};window.MutationObserver=window.MutationObserver||window.WebkitMutationObserver;var a={},i=null,u={},s={},l={},c=!1,p=function(e,t,n){return n&&t===u[e]?void 0:u[e]=t};s.isplaying=function(e){var t=!!document.querySelector("#play-pause.playing");return p("isplaying",t,e)},s.song=function(e){var t=document.querySelector("#track-name");return t=t&&!t.innerHTML.match(/\/ad\//)?t.innerText.replace(/\s/g," ").trim():"",p("song",t,e)},s.artist=function(e){var t=document.querySelector("#track-artist");return t=t?t.innerText:"",p("artist",t,e)},s.album=function(e){return p("album","",e)},s.albumart=function(e){var t=document.querySelector(".sp-image-img");return t=t?t.style.backgroundImage.replace(/^url\(|\)$/g,""):"",p("albumart",t,e)},s.songvote=function(e){return p("songvote",0,e)},s.volume=function(e){var t=parseInt(document.querySelector("#vol-position").style.left)/105;return p("volume",t,e)},s.playlists=function(e){return p("playlists",null,e)},s.playlist=function(e){return p("playlist",null,e)},s.elapsedtime=function(e){var t=document.querySelector("#track-current");return t=t?t.innerHTML.match(/^(\d?\d):(\d\d)$/):void 0,t=t?60*t[1]+1*t[2]:void 0,p("elapsedtime",t,e)},s.totaltime=function(e){var t=document.querySelector("#track-length");return t=t?t.innerHTML.match(/^(\d?\d):(\d\d)$/):void 0,t=t?60*t[1]+1*t[2]:void 0,p("totaltime",t,e)},l.play=function(){c=!1,r(document.querySelector("#play-pause"))},l.pause=function(){r(document.querySelector("#play-pause.playing"))},l.forcepaused=function(){c=!0,l.pause();var e=function(){c=!1,document.querySelector("#play-pause").removeEventListener("click",e,!0),document.querySelector("#next").removeEventListener("click",e,!0),document.querySelector("#previous").removeEventListener("click",e,!0)};document.querySelector("#play-pause").addEventListener("click",e,!0),document.querySelector("#next").addEventListener("click",e,!0),document.querySelector("#previous").addEventListener("click",e,!0)},l.prev=function(){c=!1,r(document.querySelector("#previous"))},l.next=function(){c=!1,r(document.querySelector("#next"))},l.songvote=function(){},l.volume=function(e){console.log("setvol",e);var t=document.querySelector("#volume-bar"),n=t.style.display;t.style.display="block";var o=0,a=t;do o+=a.offsetLeft;while(a=a.offsetParent);var i=document.querySelector("#volume-bar").offsetWidth,u=document.querySelector("#vol-position").offsetWidth;o+=u/2+(i-u)*e,r(t,o,0),t.style.display=n},l.seek=function(e){var t=document.querySelector("#progress"),n=0,o=t;do n+=o.offsetLeft;while(o=o.offsetParent);var a=document.querySelector("#progress").offsetWidth,i=document.querySelector("#progress #position").offsetWidth;n+=i/2+(a-i)*e,r(t,n,0)},l.playlist=function(){};var d=function(){console.log("connect"),i=chrome.extension.connect({name:JSON.stringify({name:"playerport",type:"playspotify",isplaying:s.isplaying(),song:s.song(),artist:s.artist(),album:s.album(),albumart:s.albumart(),songvote:s.songvote(),volume:s.volume(),playlists:s.playlists(),playlist:s.playlist()})}),i.onMessage.addListener(m),i.onDisconnect.addListener(v),a={},a.playpause=new MutationObserver(function(){void 0!==s.isplaying(!0)&&(c&&u.isplaying?l.forcepaused():i.postMessage({isplaying:u.isplaying}))}),a.playpause.observe(document.querySelector("#play-pause"),{attributes:!0,attributeFilter:["class"]}),a.songinfo=new MutationObserver(function(){var e={};e.song=s.song(!0),e.artist=s.artist(!0),e.album=s.album(!0),i.postMessage(e)}),a.songinfo.observe(document.querySelector("#player"),{subtree:!0,characterData:!0,childList:!0}),a.albumart=new MutationObserver(function(){void 0!==s.albumart(!0)&&i.postMessage({albumart:u.albumart})}),a.albumart.observe(document.querySelector("#cover-art"),{subtree:!0,characterData:!0,childList:!0,attributes:!0,attributeFilter:["style"]}),a.volume=new MutationObserver(function(){i.postMessage({volume:s.volume()})}),a.volume.observe(document.querySelector("#vol-position"),{attributes:!0,attributeFilter:["style"]}),a.time=new MutationObserver(function(){i.postMessage({elapsedTime:s.elapsedtime(),totalTime:s.totaltime()})}),a.time.observe(document.querySelector("#track-current"),{subtree:!0,characterData:!0,childList:!0})},v=function(){i&&i.disconnect(),i=null,runningplayspotify=void 0;for(var e in a)a[e].disconnect();chrome.storage.onChanged.removeListener(o)},m=function(e){"play"==e.action&&l.play(),"pause"==e.action&&l.pause(),"forcepaused"==e.action&&l.forcepaused(),"next"==e.action&&l.next(),"thumbup"==e.action&&l.songvote(1),"thumbdown"==e.action&&l.songvote(-1),"setvolume"==e.action&&l.volume(e.volume),"seek"==e.action&&l.seek(e.seek),"setplaylist"==e.action&&l.playlist(e.playlist)},y=function(){if(window.top==window)var e=setInterval(function(){var t=document.querySelector("iframe[src^='https://play.spotify.com/apps/player/']");t&&(clearInterval(e),setTimeout(function(){chrome.runtime.sendMessage({injecttype:"playspotify"})},500))},1e3);else if(location.href.match(/^https?:\/\/play\.spotify\.com\/apps\/player\//)){var t=function(){return document.querySelector("#play-pause")&&document.querySelector("#vol-position")?void d():setTimeout(t,500)};t()}}}()}