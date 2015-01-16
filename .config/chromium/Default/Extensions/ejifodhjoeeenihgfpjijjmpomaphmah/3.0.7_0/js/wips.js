// HLAVNI OBJEKT

var wips = {
    new_client_id: undefined,
    otherExt: [],
    delayId: [],
    tempContextPage: false,
    uuidGenerator: function(){
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    },
    getPref: function(name){
        var value = localStorage[name];
        if(value == 'false')
            return false;
        else
            return value;
    },
    setPref: function(name,value){
        localStorage[name] = value;
    },
    setThisExt: function(){
        this.setPref('active',true);
        //zadna dalsi ext + neni id -> registrace, nast. aktivni
        if(!this.getPref('client_id')){
            this.setPref('delay_id',1);
            this.new_client_id = this.uuidGenerator();
            wipstats.register();
        }
        //ostatni
        if(!this.getPref('extension_id') || this.getPref('version')!=chrome.app.getDetails().version){
            this.setPref('version',chrome.app.getDetails().version);
            setTimeout(function(){
                wipstats.registerExt();
            },5000);
        }
        if(this.getPref('active')){
            setTimeout(function(){
                wipstats.checkId();
            },10000);
        }
    },
    openUrl: function(url){
        chrome.tabs.create({
            url: url
        });
    },
    init: function(){
        if(!this.getPref('extension_id')){
            this.setPref('stats',true);
            this.setPref('open_premium_last_show', (new Date().getTime()).toString());
            this.setPref('open_premium_actual_interval','0');
            wips.setPref('update_notify_first_set',true);
            wips.setPref('update_notify_active',true);
        }
        if(!this.getPref('open_premium_last_show')){
            this.setPref('open_premium_last_show', (new Date().getTime()).toString());
            this.setPref('open_premium_actual_interval','2');
        }
        setTimeout(function(){
            wips.setThisExt();
            wips.setContext();
            facebook.init();
        },1000);
        setTimeout(function(){
            //wips.updateNotify();
        },3600000);
    },
    setContext: function(){
        setTimeout(function(){
            chrome.contextMenus.removeAll(function(){});
            chrome.contextMenus.create({
                'title': chrome.app.getDetails().name,
                'id': 'time_stats_context'
            });
            chrome.contextMenus.create({
                'title':'Add this site to category',
                'id':'time_stats_context_categ',
                'type': 'normal',
                'parentId': 'time_stats_context'
            });
            chrome.contextMenus.create({
                'title':'New category',
                'type': 'normal',
                'parentId': 'time_stats_context_categ',
                'onclick': function(e){
                    trackButton('Context','Add site to category','New');
                    c = prompt('Enter new category','');
                    if(c){
                        setSiteCategory(c,e.pageUrl);
                    }
                }
            });
            var categ = getCategoryList();
            for(var i in categ){
                chrome.contextMenus.create({
                    'title':categ[i],
                    'id':categ[i],
                    'type': 'normal',
                    'parentId': 'time_stats_context_categ',
                    'onclick': function(e){
                        trackButton('Context','Add site to category',e.menuItemId);
                        setSiteCategory(e.menuItemId,e.pageUrl);
                    }
                });
            }
            chrome.contextMenus.create({
                'title':'Show me my statistics for this site',
                'type': 'normal',
                'parentId': 'time_stats_context',
                'onclick': function(e){
                    wips.tempContextPage = e.pageUrl;
                    window.open('options.html#_category_sites','_blank');
                    trackButton('Context','Site Stats');
                }
            });
            chrome.contextMenus.create({
                'title':'Statistics and options',
                'type': 'normal',
                'parentId': 'time_stats_context',
                'onclick': function(e){
                    window.open('options.html','_blank');
                    trackButton('Context','Options');
                }
            });
            var webstoreUrl;
            if(config.webstoreId && config.webstoreId != ''){
                webstoreUrl = 'https://chrome.google.com/webstore/detail/' + config.webstoreId;
            }else{
                webstoreUrl = 'http://www.wips.com/showcase';
            }
            chrome.contextMenus.create({
                'title':'Share',
                'id': 'time_stats_context_share',
                'parentId': 'time_stats_context'
            });
            chrome.contextMenus.create({
                'title':'Share on Facebook',
                'type': 'normal',
                'parentId': 'time_stats_context_share',
                'onclick': function(e){
                    window.open('https://www.facebook.com/sharer.php?u='+encodeURIComponent(webstoreUrl),'_blank');
                    trackButton('Context','Share','facebook-share-context');
                }
            });
            chrome.contextMenus.create({
                'title':'Tweet about it',
                'type': 'normal',
                'parentId': 'time_stats_context_share',
                'onclick': function(e){
                    window.open('http://www.twitter.com/share?url='+encodeURIComponent(webstoreUrl)+'&text='+encodeURIComponent(config.tweetText),'_blank');
                    trackButton('Context','Share','twitter-share-context');
                }
            });
            chrome.contextMenus.create({
                "title":'Rate this extension 5-Stars on Chrome webstore',
                "type":"normal",
                'parentId': 'time_stats_context',
                "onclick":function(){
                    window.open('https://chrome.google.com/webstore/detail/timestats/ejifodhjoeeenihgfpjijjmpomaphmah/reviews?utm_source=timestats&utm_medium=context-menu&utm_campaign=review-request','_blank');
                    trackButton('Context','CWS Review');
                }
            });
        },50);
    },
    updateNotify: function(){
        trackButton('Update Notify','Show');
        if(!wips.getPref('update_notify_first_set')){
            wips.setPref('update_notify_first_set',true);
            wips.setPref('update_notify_active',true);
        }
        if(wips.getPref('update_notify_active')){
            if(wips.getPref('update_notify_id') != '3'){
                wips.setPref('update_notify_id','3');
                chrome.notifications.create(
                    'update_notify',{   
                        type: 'image', 
                        iconUrl: 'images/icon128.png', 
                        title: 'Get Life Protect', 
                        message: 'Monitor your loved ones. Click here to get Life Protect for them.',
                        imageUrl: 'images/update_notify_2.png',
                        buttons: [
                            { title: 'Facebook Share', iconUrl: 'images/fb_share_16.png'},
                            { title: 'Tweet', iconUrl: 'images/twt_share_16.png'},
                        ],
                        priority: 1
                    },function(){} 
                );
            }
        }
    },
    shareFbFromPopup: function(){
        trackButton('Popup','Fb Share','Click');
        facebook.login(function(ok){
            if(ok){
                facebook.apiShareUrl(function(){
                    trackButton('Popup','Fb Share','Share OK');
                    wips.setPref('fb_share_ok',true);
                });
            }
        });
    }
}

function desktopNotifyClicked(id,index){
    if(id == 'update_notify'){
        if(index!=undefined){
            var tweetText = encodeURIComponent('Get Life Protect for your kids and employees') + '%20' + encodeURIComponent('http://bit.ly/Life-Protect');
            if(index == 0){
                window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent('http://bit.ly/Life-protect-now'),'_blank');
            }else if(index == 1){
                window.open('http://twitter.com/home?status=' + tweetText,'_blank');
            }
        }else{
            trackButton('Update Notify','Click');
            window.open('https://www.getlifeprotect.com?utm_campaign=launch&utm_medium=update-notif&utm_source=time-stats','_tab');
        }
    }else if(id == 'report_notify'){
        trackButton('Report Notify','Click');
        facebook.apiPostText(alarm.reportTempText,function(ok){
            if(ok){
                trackButton('Report Notify','Fb Share','Share OK');
            }
        });
    }
}

// notify listener
chrome.notifications.onClicked.addListener(function(id){
    desktopNotifyClicked(id);
});
chrome.notifications.onButtonClicked.addListener(function(id,index){
    desktopNotifyClicked(id,index);
});

// desknotify univ listeners
/*function desktopNotifyCliked(id,index){
    if(id == 'update_notify' && index!=undefined){
        var shareUrl = 'http://www.wips.com/showcase';
        if(config.webstoreId && config.webstoreId.trim() != ''){//nahrane
            shareUrl = 'https://chrome.google.com/webstore/detail/' + config.webstoreId;
        }
        var tweetText = encodeURIComponent(config.tweetText) + '%20' + encodeURIComponent(shareUrl);
        if(index == 0){
            window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(shareUrl),'_blank');
        }else if(index == 1){
            window.open('http://twitter.com/home?status=' + tweetText,'_blank');
        }
    }
}
chrome.notifications.onClicked.addListener(function(id){
    desktopNotifyCliked(id);
});
chrome.notifications.onButtonClicked.addListener(function(id,index){
    desktopNotifyCliked(id,index);
});*/