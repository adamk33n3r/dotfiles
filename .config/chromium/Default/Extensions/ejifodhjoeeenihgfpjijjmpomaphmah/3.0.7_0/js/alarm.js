// ALARM BG
var alarm = {
    actualWeb: '',
    actualTabId: undefined,
    init: function(){
        if(!localStorage['alarm_webs']){
            wips.setPref('alarm_webs','[]');
            wips.setPref('mode','block');//block,text,notif
            wips.setPref('mode_notif_time','60');
        }
        this.resetAllTimes();
    },
    setActualWeb: function(url,id){
        this.actualWeb = '';
        this.setIconText('');
        if(url.indexOf("http://") != -1 || url.indexOf("https://") != -1){
            this.actualWeb = this.urlToWeb(url);
            this.actualTabId = id;
        }
    },
    checkActualWeb: function(){
        var webs = this.getWebs();
        if(webs.length > 0){
            for(var i in webs){
                var web = webs[i];
                //console.log(web.url+' | '+web.actualTime+' | '+web.alarmTime);
                if(this.actualWeb.indexOf(web.url) != -1){
                    if(web.actualTime < web.alarmTime){
                        web.actualTime++;
                        var remainTime = web.alarmTime-web.actualTime;
                        var hod = Math.floor(remainTime/3600);
                        var min = Math.floor(remainTime/60) - (hod*60);
                        var sec = remainTime - (min*60);
                        if(remainTime < 600){
                            if(sec < 10){
                                sec = '0' + sec;
                            }
                            this.setIconText(min+':'+sec);
                        }else if(remainTime >= 600 && remainTime < 3600){
                            this.setIconText(min+'m');
                        }else{
                            this.setIconText('>'+hod+'h');
                        }
                    }else{
                        this.timeExpired(web.url,web.alarmTime);
                        return;
                    }
                }
            }
            //console.log('-------------------------------');
            this.setWebs(webs);
        }
    },
    timeExpired: function(url,alarmTime){
        this.disableEdit(url);
        var mode = wips.getPref('mode');
        switch(mode){
            case 'block':
                chrome.tabs.update(alarm.actualTabId, {url: 'blocked.html'});
            break;
            case 'text':
                wips.setPref('mode_text_temp_url',url);
                chrome.tabs.update(alarm.actualTabId, {url: 'blocked_text.html'});
            break;
            case 'notif':
                var newTime = alarmTime - wips.getPref('mode_notif_time');
                if(newTime < 0){
                    newTime = 0;
                }
                this.setActualTime(url,newTime);
                this.showDeskNotify();
            break;
        }
    },
    disableEdit: function(url){
        var webs = this.getWebs();
        for(var i in webs){
            if(url == webs[i].url){
                //console.log(webs[i].enableEdit);
                webs[i].enableEdit = false;
            }
        }
        this.setWebs(webs);
    },
    textUnblocked: function(url){
        this.setActualTime(url,0);
    },
    resetAllTimes: function(){
        var webs = this.getWebs();
        var date = new Date();
        var today = date.getDate();
        for(var i in webs){
            var web = webs[i];
            if(today != web.actualDay){
                web.actualDay = today; 
                web.actualTime = 0;
                web.enableEdit = true;
            }
        }
        this.setWebs(webs);
    },
    setActualTime: function(url,time){
        var webs = this.getWebs();
        for(var i in webs){
            var web = webs[i];
            if(url == web.url){
                web.actualTime = time;
            }
        }
        this.setWebs(webs);
    },
    showDeskNotify: function(){
        var notification = webkitNotifications.createNotification('images/icon128.png','Time\'s up!','You shouldn\'t be on this website now. Go do something useful. Now!');
        notification.show();
        setTimeout(function(){
            notification.cancel();
        },10000);
    },
    urlToWeb: function(url){
        return url.replace("http:\/\/","").replace("https:\/\/","").replace("www.","").split('/')[0];
    },
    getWebs: function(){
        return JSON.parse(wips.getPref('alarm_webs'));
    },
    setWebs: function(webs){
        wips.setPref('alarm_webs',JSON.stringify(webs));
    },
    setIconText: function(text){
        //chrome.browserAction.setBadgeText({text: text.toString()});    
    }
}

// POSLUCHACE

// requesty
chrome.extension.onRequest.addListener(function(request,sender,sendResponse){
    if(request.akce == 'content'){
        if(request.focus == 'focus'){
            setTimeout(function(){
                chrome.tabs.getSelected(null, function(tab){
                    alarm.setActualWeb(tab.url,tab.id);
                });
            },200);
        }else{
            alarm.actualWeb = '';
            alarm.setIconText('');
        }
    }
});

// tabs
chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
    if(changeInfo.status == 'loading'){
        alarm.setActualWeb(tab.url,tab.id);
    }
});
chrome.tabs.onActivated.addListener(function(activeInfo){
    chrome.tabs.getSelected(null, function(tab){
        alarm.setActualWeb(tab.url,tab.id);
    });
});

// casovac
window.setInterval(function(){
    alarm.checkActualWeb();
},1000);

// load
window.addEventListener("load",function(){  
    alarm.init();  
},false);