var options;

function write(){//write today stats in localstorage
    var date = getDateToday();
    var visits = getVisits();
    visits[date] = getVisits(date);
    setVisits(visits);
}

function fnGetDomain(url){
    return (url.match(/:\/\/(.[^/]+)/)[1]).replace('www.','');
}

function checkSiteInCategories(domain){
    var options = getOptions();
    var i, j, category;
    for (i in options.categories)
    {
        category = options.categories[i];
        for (j in category)
        {
            if (category[j] == domain)
            {
                return true;
            }
        }
    }
    return false;
}

function addSiteToCategory(domain){
    var options = getOptions();
    options.categories.other.push(domain);
    storage_set('options', options);
}

function getCategoryList(domain){
    var categ = getOptions().categories;
    var arr = [];
    for(var i in categ){
        arr.push(i);
    }
    return arr;
}

function setSiteCategory(category,url){
    var domain = fnGetDomain(url);
    var options = getOptions();
    for(cat in options.categories){
        for(var i in options.categories[cat]){
            if(options.categories[cat][i] == domain){
                options.categories[cat].splice(i,1);
            }
        }
    }
    if(!options.categories[category]){
        options.categories[category] = [];
    }
    options.categories[category].push(domain);
    storage_set('options', options);
    chrome.notifications.create(
        'add_site_to_categ_'+domain,{
            type: 'basic',
            iconUrl: 'images/icon128.png', 
            title: 'Added to category', 
            message: domain + ' has been succesfully added to the category ' + category,
            priority: 0
        },function(){} 
    );
}

checkHistoryLength();

chrome.browserAction.onClicked.addListener(function(tab){
	trackButton('Popup Icon','Click');
});

////////////   N E W   S Y S T E M   ///////////

var control = {
    savePrefActive: true,
    focusActive: true,
    tempVisits: {},
    iconCounter: 0,
    iconLastDomain: '',
    isPremium: false,
    init: function(){
        wips.init();
        options = getOptions();
        chrome.browserAction.setBadgeBackgroundColor({color:[0, 100, 0, 210]});
        this.checkPremium();
        //sync
        setTimeout(function(){
            if(control.isPremium){
                control.syncCheck();
                setInterval(function(){
                    control.syncCheck();
                },60000);
                setTimeout(function(){
                    control.checkPremiumFirstStart();//nemazat je osetreno v samotne fci - !wips.getPref('sync_profile_id')
                },1000);
            }
        },10000);
    },
    // PREMIUM - ACCOUNT
    checkPremium: function(){
        var login = wips.getPref('premium_login');
        var password = wips.getPref('premium_password');
        if(login && password){
            var url = 'https://plugins.wips.com/timestats/pay/check?username='+encodeURIComponent(login)+'&password='+encodeURIComponent(password);
            var r = new XMLHttpRequest();
            r.open("GET", url, true);
            r.onreadystatechange = function (){
                if(r.readyState == 4){
                    if(r.status == 202){
                        control.isPremium = true;
                        wips.setPref('new_check_newtab_premium_disable',true);
                    }else if(r.status == 404 || r.status == 401 || r.status == 403){
                        wips.setPref('premium_login',false);
                        wips.setPref('premium_password',false);
                    }else if(r.status == 408 || r.status == 204){
                        control.waitingPayment = true;
                    }
                    setTimeout(function(){
                        control.newtabPremium();
                    },20000);
                }
            };
            r.send(null);
        }else{
            setTimeout(function(){
                control.newtabPremium();
            },20000);
        }
    },
    newtabPremium: function(){
        if(!wips.getPref('new_check_newtab_premium_disable2')){
            // pref open_premium_actual_interval: int 0..6 ( 0 - 3dny, 1 - 7dnu, 2 - 30, 3 - 60, 4 - 90, 5 - 180, 6 - 360)
            // pref open_premium_last_show: unix time (ms)
            var open_premium_intervals = [259200000,604800000,2592000000,5184000000,7776000000,15552000000,31104000000];
            // ONLY TEST!!!!! Tvar open_premium_intervals = [30000,60000,90000,120000,150000,180000,210000];
            var lastShow = wips.getPref('open_premium_last_show');
            var actualInterval = wips.getPref('open_premium_actual_interval');
            var actualIntervalTime = open_premium_intervals[actualInterval];
            if(actualIntervalTime){
                if(lastShow < (new Date().getTime() - actualIntervalTime)){
                    wips.setPref('open_premium_last_show', (new Date().getTime()).toString());
                    wips.setPref('open_premium_actual_interval',actualInterval-(-1));
                    window.open('premium.html','_blank');
                }
            }else{
                wips.setPref('new_check_newtab_premium_disable2',true);
            }
        }    
        /* OLD **** 
        var last_check = parseInt(wips.getPref('new_check_newtab_premium'));
        if(!control.isPremium && !wips.getPref('new_check_newtab_premium_disable') && (!last_check || last_check < (new Date().getTime() - 86400000))){
            window.open('premium.html','_blank');
            wips.setPref('new_check_newtab_premium_disable',true);
            wips.setPref('new_check_newtab_premium2', (new Date().getTime()).toString());
        }
        var last_check2 = parseInt(wips.getPref('new_check_newtab_premium2'));
        if(!control.isPremium && !wips.getPref('new_check_newtab_premium_disable2') && (last_check2 && last_check2 < (new Date().getTime() - 604800000))){
            window.open('premium.html','_blank');
            wips.setPref('new_check_newtab_premium_disable2',true);
        }*/
    },
    checkPremiumFirstStart: function(callback){
        if(this.isPremium && wips.getPref('sync_profile_name') && !wips.getPref('sync_profile_id')){
            wips.setPref('sync_profile_id',wips.uuidGenerator());
            var visits = this.getPrefObject('visits');
            this.syncPost(visits,function(){
                callback();
            });
        }
    },
    // PREMIUM - SYNC
    syncCheck: function(){
        if(this.isPremium && wips.getPref('sync_profile_id') && wips.getPref('sync_profile_name')){
            var last_check = parseInt(wips.getPref('check_sync_timeout'));
            if(isNaN(last_check) || last_check < (new Date().getTime() - 3600000)){
                this.syncPostPrepare(function(){
                    wips.setPref('check_sync_timeout', (new Date().getTime()).toString());
                });
            }
        }
    },
    syncPostPrepare: function(callback,doAllways){
        var minDate = wips.getPref('check_sync_timeout');
        var visits = this.getPrefObject('visits');
        var subData = {};
        var send = false;
        for(var day in visits){
            if((new Date(day)).getTime() >= (minDate-86400000)){
                subData[day] = visits[day];
                send = true;
            }
        }
        if(doAllways){
            send = true;
        }
        if(send){
            this.syncPost(subData,function(){
                if(callback){
                    callback();
                }
            });
        }else{
            this.syncGet(function(){
                if(callback){
                    callback();
                }
            });
        }
    },
    syncPost: function(visits,callback){
        var data = {
            profile:{
                id: wips.getPref('sync_profile_id'),
                name: wips.getPref('sync_profile_name'),
                settings: wips.getPref('options')
            },
            data: visits
        };
        var login = wips.getPref('premium_login');
        var password = wips.getPref('premium_password');
        var url = 'https://plugins.wips.com/timestats/api/v2/data';
        var r = new XMLHttpRequest();
        r.open("POST", url, true);
        r.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        r.setRequestHeader('Authorization', 'Basic ' + encode64(login + ':' + password).replace(/=/,'')); 
        r.onreadystatechange = function(){
            if(r.readyState == 4){
                control.syncGet(function(){
                    callback();
                });
            }
        };
        r.send('data=' + JSON.stringify(data));
    },
    syncGet: function(callback){
        var login = wips.getPref('premium_login');
        var password = wips.getPref('premium_password');
        var url = 'https://plugins.wips.com/timestats/api/v2/data';
        var r = new XMLHttpRequest();
        r.open("GET", url, true);
        r.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        r.setRequestHeader('Authorization', 'Basic ' + encode64(login + ':' + password).replace(/=/,'')); 
        r.onreadystatechange = function(){
            if(r.readyState == 4){
                //console.log(r.status);
                if(r.status == 200){
                    control.syncSaveAllProfile(JSON.parse(r.responseText));
                    callback();
                }
            }
        };
        r.send(null);
    },
    syncSaveAllProfile: function(profiles){
        //console.log(profiles);
        var profPref = {};
        for(var id in profiles){
            if(id != wips.getPref('sync_profile_id')){
                profPref[id] = decodeURIComponent(profiles[id].profile.name.replace(/\+/gi,' '));
                control.setPrefObject('visits__'+id,profiles[id].data);
            }
        }
        control.setPrefObject('sync_other_profiles',profPref);
        control.syncJoinProfile(profiles);
    },
    syncJoinProfile: function(profiles){
        var visits_all = {};
        for(var id in profiles){
            var actuaProf = profiles[id].data;
            for(var day in actuaProf){
                if(!visits_all[day]){
                    visits_all[day] = {};
                }
                for(var domain in actuaProf[day]){
                    if(!visits_all[day][domain]){
                        visits_all[day][domain] = actuaProf[day][domain];
                    }else{
                        visits_all[day][domain] += actuaProf[day][domain];
                    }
                }
            }
        }
        control.setPrefObject('visits__all',visits_all); 
    },
    syncRemove: function(type,data_in){//type: day|domain
        var login = wips.getPref('premium_login');
        var password = wips.getPref('premium_password');
        var url = 'https://plugins.wips.com/timestats/api/v2/trash';
        var r = new XMLHttpRequest();
        r.open("POST", url, true);
        r.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        r.setRequestHeader('Authorization', 'Basic ' + encode64(login + ':' + password).replace(/=/,'')); 
        var data = {
            profile: wips.getPref('sync_profile_id'),
            type: type,
            data: data_in
        };
        r.onreadystatechange = function(){
            if(r.readyState == 4){
                //console.log(r.status);
            }
        };
        r.send('data=' + JSON.stringify(data));
    },
    // PUBLIC BG FCE
    checkActualUrl: function(url,tabId){
        var domain = get_hostname_from_url(url);
        if(this.tempVisits[domain]){
            this.tempVisits[domain] ++;
        }else{
            this.tempVisits[domain] = 1;
        }
        this.iconCounter++;
        if(this.iconCounter > 10 || this.iconLastDomain != domain){
            this.changeIconTime(domain,tabId);
            this.iconCounter = 0;
            this.iconLastDomain = domain;
        }
    },
    saveTempProfiles: function(){
        if(this.savePrefActive){
            var visits = this.getPrefObject('visits');
            var date = getDateToday();
            var day_end_time = getOptions().day_end_time;
            if(day_end_time && day_end_time!='0'){
                if((new Date()).getHours() < day_end_time){
                    date = getFormatedDate(new Date((new Date()).getTime() - 3600000));
                }
            }
            if(!visits[date]){
                visits[date] = {};
            }
            for(var domain in this.tempVisits){
                var time = this.tempVisits[domain];
                if(visits[date][domain]){
                    visits[date][domain] += time;
                }else{
                    visits[date][domain] = time;
                }
                this.tempVisits[domain] = 0;
                if(!checkSiteInCategories(domain)){
                    addSiteToCategory(domain);
                }
            }
            this.setPrefObject('visits',visits);
            this.savePrefActive = false;
        }
    },
    changeIconTime: function(domain,tabId){
        var visits = this.getPrefObject('visits');
        var date = getDateToday();
        if(visits[date] && visits[date][domain]){
            var time = visits[date][domain];
            var minutes = time/60 - ((time/60)%1);
            if (minutes<60)
            {
                chrome.browserAction.setBadgeText({"text": minutes.toString()+ chrome.i18n.getMessage("m"), "tabId": tabId});
            } else {
                if (minutes<60*24)
                {
                    var hours=time/3600 - ((time/3600)%1);
                    chrome.browserAction.setBadgeText({"text": hours.toString()+ chrome.i18n.getMessage("h"), "tabId": tabId});
                } else {
                        var days=time/(24*3600) - ((time/(24*3600))%1);
                        chrome.browserAction.setBadgeText({"text": days.toString()+ chrome.i18n.getMessage("d"), "tabId": tabId});
                }
            }
            chrome.browserAction.setTitle( {title:  chrome.i18n.getMessage("siteTitle")+" "+secondsToHourMin(time), tabId: tabId });
        }
    },
    getPrefObject: function(name){
        var visitsStr = wips.getPref(name);
        if(!visitsStr){
            visitsStr = '{}';
        }
        return JSON.parse(visitsStr);
    },
    setPrefObject: function(name,data){
        wips.setPref(name,JSON.stringify(data));
    }
}

// POSLUCHACE / INTERVALY

window.setInterval(function(){
    if(control.focusActive){
        chrome.tabs.getSelected(null, function(tab){
            if(tab.url.indexOf("http://") != -1 || tab.url.indexOf("https://") != -1){
                var options = getOptions();
                chrome.idle.queryState(options.idle_time,function(newState){
                    if(newState == 'active'){
                        control.savePrefActive = true;
                        control.checkActualUrl(tab.url,tab.id);
                    }
                });
            }
        });
    }
    //console.log(JSON.stringify(control.tempVisits));
},1000);

window.setInterval(function(){
    control.saveTempProfiles();
},10000);

chrome.windows.onFocusChanged.addListener(function(windowId) {
    if(windowId != chrome.windows.WINDOW_ID_NONE){
        setTimeout(function(){
            control.focusActive = true;
        },100);
    }else{
        control.focusActive = false;
    }
});

chrome.tabs.onActivated.addListener(function(activeInfo){
    control.focusActive = true;
});

// load
window.addEventListener("load",function(){  
    control.init();  
},false);