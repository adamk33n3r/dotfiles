if("undefined"==typeof runningpandora){var runningpandora=!0,exports={};!function(){var e={},t={},o=2;chrome.storage.local.get(null,function(t){e=t,0==--o&&v()}),chrome.storage.sync.get(null,function(e){if(t=e,!t.test)for(var n in console)console[n]=function(){};0==--o&&v()});var n=function(o,n){if("local"==n)for(var r in o)e[r]=o[r].newValue;else if("sync"==n)for(var r in o)t[r]=o[r].newValue};chrome.storage.onChanged.addListener(n);var r=function(e,t,o){t=t||0,o=o||0;var n=document.createEvent("MouseEvents");n.initMouseEvent("mousedown",!0,!0,window,1,0,0,t,o,!1,!1,!1,!1,0,null),e.dispatchEvent(n),n=document.createEvent("MouseEvents"),n.initMouseEvent("click",!0,!0,window,1,0,0,t,o,!1,!1,!1,!1,0,null),e.dispatchEvent(n),n=document.createEvent("MouseEvents"),n.initMouseEvent("mouseup",!0,!0,window,1,0,0,t,o,!1,!1,!1,!1,0,null),e.dispatchEvent(n)};window.MutationObserver=window.MutationObserver||window.WebkitMutationObserver;var a={},l=null,u={},s={},i={},c=!1,d=function(e,t,o){return o&&t===u[e]?void 0:u[e]=t};s.isplaying=function(e){var t="block"==document.querySelector("#mainContentContainer").style.display&&"block"==document.querySelector(".pauseButton").style.display;return d("isplaying",t,e)},s.song=function(o){var n=document.querySelector(".playerBarSong").innerText;return t.advolume<1&&(chrome.runtime.sendMessage({asdf:!0},function(){}),void 0===e.pandora_noadvolume&&n.match(/^(audio)?ad$/)?(e.pandora_noadvolume=s.volume(),chrome.storage.local.set({pandora_noadvolume:e.pandora_noadvolume}),i.volume(t.advolume*e.pandora_noadvolume)):void 0===e.pandora_noadvolume||n.match(/^(audio)?ad$/)||(i.volume(e.pandora_noadvolume),delete e.pandora_noadvolume,chrome.storage.local.remove("pandora_noadvolume"))),d("song",n.replace(/^(audio)?ad$/,""),o)},s.artist=function(e){return d("artist",document.querySelector(".playerBarArtist").innerText.replace(/^(audio)?ad$/,""),e)},s.album=function(e){return d("album",document.querySelector(".playerBarAlbum").innerText.replace(/^(audio)?ad$/,""),e)},s.albumart=function(e){var t=document.querySelector(".playerBarArt")?document.querySelector(".playerBarArt").src:"";return t=t.match(/\/ads\//)?"":t,d("albumart",t.match(/^\//)?"http://www.pandora.com"+t:t,e)},s.songvote=function(e){return d("songvote",document.querySelector(".thumbUpButton.indicator")?1:document.querySelector(".thumbDownButton.indicator")?-1:0,e)},s.volume=function(e){var t=document.querySelector("#playbackControl"),o=t.style.display;t.style.display="block";var n=document.querySelector(".volumeBackground"),r=n.style.display;n.style.display="block";var a=1,l=document.querySelector(".volumeBar").offsetLeft,u=document.querySelector(".volumeBar").offsetWidth,s=document.querySelector(".volumeKnob").offsetLeft,i=document.querySelector(".volumeKnob").offsetWidth;return l>10&&s>10&&u>10&&i>10&&(a=(s-l)/(u-i)),t.style.display=o,n.style.display=r,d("volume",a,e)},s.playlists=function(e){for(var t=document.querySelectorAll(".stationNameText"),o=["Shuffle"],n=0;n<t.length;n++)o.push(t[n].title);return d("playlists",o,e)},s.playlist=function(e){var t=document.querySelector(".stationListItem.selected .stationNameText, .stationListItem.selected #shuffleIcon");return d("playlist",t?t.innerText:void 0,e)},s.elapsedtime=function(e){var t=document.querySelector(".elapsedTime");return t=t?t.innerText.match(/^(\d?\d):(\d\d)$/):void 0,t=t?60*t[1]+1*t[2]:void 0,d("elapsedtime",t,e)},s.totaltime=function(e){var t=document.querySelector(".remainingTime");return t=t?t.innerText.match(/^-(\d?\d):(\d\d)$/):void 0,t=t?60*t[1]+1*t[2]+s.elapsedtime():void 0,d("totaltime",t,e)},i.play=function(){c=!1;var e=document.querySelector(".still_listening");if(e)return r(e),void setTimeout(i.play,0);var t=document.querySelector(".playButton");"block"==t.style.display&&r(t),""==t.style.display&&setTimeout(i.play,100)},i.pause=function(){var e=document.querySelector(".pauseButton");"block"==e.style.display&&r(e),""==e.style.display&&setTimeout(i.pause,100)},i.forcepaused=function(){console.log("forcepaused",c,u.isplaying,document.querySelector(".pauseButton").style.display,document.querySelector(".playButton").style.display),c=!0,i.pause();var e=function(){c=!1,document.querySelector(".playButton").removeEventListener("click",e,!0),document.querySelector(".skipButton").removeEventListener("click",e,!0)};document.querySelector(".playButton").addEventListener("click",e,!0),document.querySelector(".skipButton").addEventListener("click",e,!0)},i.next=function(){c=!1,r(document.querySelector(".skipButton"))},i.songvote=function(e){e>0&&r(document.querySelector(".thumbUpButton")),0>e&&r(document.querySelector(".thumbDownButton"))},i.tired=function(){r(document.querySelector("#cd_menu_dd .tiredOfSong"))},i.volume=function(e){console.log("setvol",e);var t=document.querySelector(".volumeBackground"),o=t.style.display;t.style.display="block";var n=0,a=t;do n+=a.offsetLeft;while(a=a.offsetParent);var l=document.querySelector(".volumeBar").offsetLeft,u=document.querySelector(".volumeBar").offsetWidth,s=document.querySelector(".volumeKnob").offsetLeft,i=document.querySelector(".volumeKnob").offsetWidth;l>10&&s>10&&u>10&&i>10&&(n+=l+i/2+(u-i)*e,r(t,n,0)),t.style.display=o},i.playlist=function(e){if("Shuffle"==e)r(document.querySelector("#shuffleIcon"));else for(var t=document.querySelectorAll(".stationNameText"),o=0;o<t.length;o++)e==t[o].title&&r(t[o])};var m=function(){console.log("]] connect");for(var o=document.querySelectorAll("#pcbuttonspan"),n=0;o&&n<o.length;n++)o[n].parentNode&&o[n].parentNode.removeChild(o[n]);var d=document.createElement("span");d.innerHTML=" | <a href='#'>SoundControl</a><style>#pcbuttonspan a:hover { text-decoration:underline; }</style>",d.id="pcbuttonspan",d.style["float"]="right",d.style.margin="0 0 0 .5em";var m=d.querySelector("a");m.style.margin="0 0 0 .5em",m.addEventListener("click",function(){l&&l.postMessage({optionsopen:!0})},!0);var v=document.querySelector("#brandingBar > .rightcolumn");v.insertBefore(d,v.childNodes[0]),void 0!==e.pandora_noadvolume&&(i.volume(e.pandora_noadvolume),delete e.pandora_noadvolume,chrome.storage.local.remove("pandora_noadvolume")),l=chrome.runtime.connect({name:JSON.stringify({name:"playerport",type:"pandora",isplaying:s.isplaying(),song:s.song(),artist:s.artist(),album:s.album(),albumart:s.albumart(),songvote:s.songvote(),volume:s.volume(),playlists:s.playlists(),playlist:s.playlist()})}),l.onMessage.addListener(p),l.onDisconnect.addListener(y),l._postMessage=l.postMessage,l.postMessage=function(){try{l._postMessage.apply(l,arguments)}catch(e){y()}},setTimeout(function(){var e=document.querySelector("#welcomeSearch");e&&"none"!=e.style.display&&l.postMessage({requestfocus:!0})},3e3),a={},a.playpause=new MutationObserver(function(){void 0!==s.isplaying(!0)&&(c&&u.isplaying?i.forcepaused():l.postMessage({isplaying:u.isplaying}))}),a.playpause.observe(document.querySelector(".pauseButton"),{attributes:!0,attributeFilter:["style"]}),a.songinfo=new MutationObserver(function(){var e={};e.song=s.song(!0),e.artist=s.artist(!0),e.album=s.album(!0),l.postMessage(e)}),a.songinfo.observe(document.querySelector(".rightcolumn .info"),{subtree:!0,childList:!0,characterData:!0}),a.albumart=new MutationObserver(function(){void 0!==s.albumart(!0)&&l.postMessage({albumart:u.albumart})}),a.albumart.observe(document.querySelector(".cd_icon"),{subtree:!0,childList:!0,attributes:!0,attributeFilter:["src"]}),a.songvote=new MutationObserver(function(){void 0!==s.songvote(!0)&&l.postMessage({songvote:u.songvote})}),a.songvote.observe(document.querySelector(".thumbDownButton"),{attributes:!0,attributeFilter:["class"]}),a.songvote.observe(document.querySelector(".thumbUpButton"),{attributes:!0,attributeFilter:["class"]}),a.volume=new MutationObserver(function(){l.postMessage({volume:s.volume()})}),a.volume.observe(document.querySelector(".volumeKnob"),{attributes:!0,attributeFilter:["style"]}),a.playlists=new MutationObserver(function(){l.postMessage({playlists:s.playlists(),playlist:s.playlist()})}),a.playlists.observe(document.querySelector("#stationList"),{subtree:!0,childList:!0,attributes:!0,attributeFilter:["class"]}),a.time=new MutationObserver(function(){l.postMessage({elapsedTime:s.elapsedtime(),totalTime:s.totaltime()})}),a.time.observe(document.querySelector(".progress"),{subtree:!0,childList:!0,characterData:!0}),a.body=new MutationObserver(function(o){console.log("body childList",o),e.license.match(/plus$/)&&t.skipvideoad.pandora&&document.querySelector(".skipHolder a")&&setTimeout(function(){console.log("click skip",document.querySelector(".skipHolder a"))},1e3);for(var n=0;n<o.length;n++)if(o[n].addedNodes)for(var r=0;r<o[n].addedNodes.length;r++){var a=o[n].addedNodes[r];if("toastContainer"==a.className){var u=a.querySelector(".toastContent").innerText;u.match(/Unfortunately our music licenses/)?(console.log("post nextdisabled"),l.postMessage({nextdisabled:!0})):a.querySelector(".toastItemReload")&&(console.log("post reloading"),l.postMessage({reloading:"error",showerror:"Pandora encountered an error and has been automatically reloaded"}),setTimeout(function(){location.reload()},0)),console.log("TOAST",u,a)}else console.log("MutationAdded",a.className,a.id,a)}}),a.body.observe(document.body,{childList:!0}),a.main=new MutationObserver(function(){if(t.listening){var e=document.querySelector("#mainContent .still_listening");e&&setTimeout(function(){var e=document.querySelector("#mainContent .still_listening");e&&(r(e),setTimeout(function(){"none"!=document.querySelector(".playButton").style.display&&r(document.querySelector(".playButton"))},0))},Math.round(2e3*Math.random()+500))}}),a.main.observe(document.querySelector("#mainContentContainer"),{subtree:!0,childList:!0})},y=function(){if(console.log("]] ondisconnect"),l)try{l.disconnect()}catch(e){}l=null,runningpandora=void 0;for(var t in a)a[t].disconnect();chrome.storage.onChanged.removeListener(n);for(var o=document.querySelectorAll("#pcbuttonspan"),r=0;o&&r<o.length;r++)o[r].parentNode&&o[r].parentNode.removeChild(o[r])},p=function(e){var t=document.querySelector("#playerBar");t&&"none"!=t.style.display&&("play"==e.action&&i.play(),"pause"==e.action&&i.pause(),"forcepaused"==e.action&&i.forcepaused(),"next"==e.action&&i.next(),"thumbup"==e.action&&i.songvote(1),"thumbdown"==e.action&&i.songvote(-1),"tired"==e.action&&i.tired(),"setvolume"==e.action&&i.volume(e.volume),"setplaylist"==e.action&&i.playlist(e.playlist))},v=function(){if(!t.active.pandora||!document.querySelector(".pauseButton"))return void(runningpandora=void 0);var e=function(){var t=document.querySelector("#brandingBar > .rightcolumn");return t&&"none"!=t.style.display&&"block"==document.querySelector("#mainContentContainer").style.display?void m():setTimeout(e,500)};setTimeout(e,10)}}()}