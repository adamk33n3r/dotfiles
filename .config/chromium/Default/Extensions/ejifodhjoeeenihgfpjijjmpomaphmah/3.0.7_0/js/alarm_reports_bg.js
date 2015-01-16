// ALARM BG
var alarm = {
    actualWeb: '',
    actualTabId: undefined,
    reportTempText: '',
    init: function(){
        if(!localStorage['alarm_webs']){
            wips.setPref('alarm_webs','[]');
            wips.setPref('mode','block');//block,text,notif
            wips.setPref('mode_notif_time','60');
        }
        if(!localStorage['report_interval']){
            wips.setPref('report_interval','none');
            wips.setPref('report_last_time',new Date().getTime());
        }
        this.resetAllTimes();
        setTimeout(function(){
            alarm.checkReportTime();
        },5000);
    },
    
    //alarm
    
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
        var awStr = wips.getPref('alarm_webs');
        if(!awStr){
            awStr = '[]';
        }
        return JSON.parse(awStr);
    },
    setWebs: function(webs){
        wips.setPref('alarm_webs',JSON.stringify(webs));
    },
    setIconText: function(text){
        //chrome.browserAction.setBadgeText({text: text.toString()});    
    },
    
    //reports
    
    checkReportTime:function(){
        var interval = wips.getPref('report_interval');
        if(interval && interval != 'none'){
            var intSec = parseInt(interval) * 24 * 3600 * 1000;
            var lastTime = wips.getPref('report_last_time');
            var actualTime = new Date().getTime();
            if((actualTime - lastTime) > intSec){
                wips.setPref('report_last_time',actualTime);
                this.createReport(interval);
            }
        }
    },
    createReport: function(interval){
        var visits = getVisits();
        var actualTime = new Date().getTime();
        var minTime = parseInt(interval) * 24 * 3600 * 1000;
        var tempTime = actualTime - minTime;
        
        var totalTime = 0;
        var topDayTime = 0;
        var topDayDate;
        
        while(tempTime <= actualTime){
            var coolDate = getFormatedDate(new Date(tempTime));
            if(visits[coolDate]){
                var thisDayTime = 0;
                for(var domain in visits[coolDate]){
                    thisDayTime += visits[coolDate][domain];
                }
                totalTime += thisDayTime;
                if(thisDayTime > topDayTime){
                    topDayTime = thisDayTime;
                    topDayDate = tempTime;
                }
            }
            tempTime += 86400000;
        }
        
        var text = 'Total browsing time: ' + secondsToHourMinSec(totalTime) + '\nDaily Average: ' + secondsToHourMinSec(Math.round(totalTime/interval)) + '\n';
        var topDayDateObj = new Date(topDayDate);
        
        var mostVisit = getMostVisited(minTime);
        if(mostVisit.length > 2){
            text += 'Top 3 websites:\n';
            for(var i=0; i<3; i++){
                text += '- ' + mostVisit[i][0] + ': ' + mostVisit[i][1] + '\n';
            }
        }
        
        text += 'Top day was ' + getDayName(topDayDateObj.getDay()) + ' ' + topDayDateObj.toLocaleDateString() + ': ' + secondsToHourMinSec(topDayTime);
        
        this.reportNotify(text,interval); 
    },
    reportNotify: function(text,interval){
        var title_time = 'month';
        if(interval == 7){
            title_time = 'week';
        }else if(interval == 14){
            title_time = 'two weeks';
        }
        this.reportTempText = 'This is my browsing summary from past ' + title_time + '\n\n' + text.replace('Top 3 websites','\nTop 3 websites').replace('Top day was','\nTop day was');
        trackButton('Report Notify','Show');
        chrome.notifications.create(
            'report_notify',{
                type: 'basic',
                iconUrl: 'images/icon128.png', 
                title: 'This is your browsing activity from last ' + title_time,
                message: text,
                buttons: [{ title: 'Click to share this on Facebook', iconUrl: 'images/fb_share_16.png'}],
                priority: 2
            },function(){} 
        );
    }
}

function getDayName(day){
    var names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return names[day];
}
function getMostVisited(minTime){
    var actualTime = new Date().getTime();
    var i, tempTime = actualTime - minTime;
    var domains = {};
    var visits = getVisits();
    while(tempTime <= actualTime){
        var coolDate = getFormatedDate(new Date(tempTime));
        for(i in visits[coolDate]){
            if(domains[i] == undefined){
                domains[i] = visits[coolDate][i];
            }else{
                domains[i] += visits[coolDate][i];
            }
        }
        tempTime += 86400000;
    }
    domains = sortObjDescAlphabet(domains);
    for(var i in domains){
        domains[i] = [domains[i][0], secondsToHourMinSec(domains[i][1])];
    }
    return domains;
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