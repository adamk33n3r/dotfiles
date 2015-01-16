var badges = {
    //vyhodnoceni a pridani badgets
    checkNewBadges: function(){
        var visits = this.getObjPref('visits');
        //milestones_day:
        var maxDayHits = 0;
        //milestones_all:
        var allHits = 0;
        //base,inarow:
        for(var id in badgesData){
            switch(badgesData[id].type){
                case 'base':
                    badgesData[id].tempHits = 0;
                break;
                case 'inarow':
                    badgesData[id].tempDayInRow = 0;
                    badgesData[id].tempDayInRowMax = 0;
                    badgesData[id].tempLastDay;
                break;
            }
        }
        
        // SBER DAT
        for(var day in visits){//jednotlive dny
            var dayData = visits[day];
            //milestones_day:
            var dayHits = 0;

            for(var url in dayData){//jednotlive url
                var urlHits = dayData[url];
                //milestones_day,milestones_all:
                dayHits += urlHits;
                //base,inarow:
                for(var id in badgesData){
                    if(badgesData[id].url && url.indexOf(badgesData[id].url) != -1){
                        switch(badgesData[id].type){
                            case 'base':
                                badgesData[id].tempHits += urlHits;
                            break;
                            case 'inarow':
                                var diffDayLastDay = (new Date(day)).getTime() - (new Date(badgesData[id].tempLastDay)).getTime();
                                if(!badgesData[id].tempLastDay || diffDayLastDay <= 86400000){//predchozi zaznam u teto url == predchozi den
                                    badgesData[id].tempDayInRow ++;
                                }else{
                                    badgesData[id].tempDayInRow = 1;
                                }
                                if(badgesData[id].tempDayInRow > badgesData[id].tempDayInRowMax){
                                    badgesData[id].tempDayInRowMax = badgesData[id].tempDayInRow;
                                }
                                badgesData[id].tempLastDay = day;
                            break;
                        }
                    }
                }
            }
            
            //milestones_day:
            if(dayHits > maxDayHits){
                maxDayHits = dayHits;
            }
            //milestones_all:
            allHits += dayHits;
        }
        
        // VYHODNOCENI DAT
        var badgesPref = this.getObjPref('badges',true);
        var time = new Date();
        for(var id in badgesData){
            if(badgesData[id].type=='base'){
                for(var i in badgesData[id].hits){
                    if(badgesData[id].tempHits >= badgesData[id].hits[i]){
                        var newLevel = i-(-1);
                        if(!badgesPref[id] || newLevel > badgesPref[id].level){
                            this.newBadgeAlert(badgesData[id].title+' - '+newLevel);
                            badgesPref[id] = {
                                'time': time,
                                'level': newLevel
                            };
                        }
                    }
                }
            }else if(badgesData[id].type=='inarow'){
                for(var i in badgesData[id].hits){
                    if(badgesData[id].tempDayInRowMax >= badgesData[id].hits[i]){
                        var newLevel = i-(-1);
                        if(!badgesPref[id] || newLevel > badgesPref[id].level){
                            this.newBadgeAlert(badgesData[id].title+' - '+newLevel);
                            badgesPref[id] = {
                                'time': time,
                                'level': newLevel
                            };
                        }
                    }
                }
            }else if(badgesData[id].type=='milestones_day'){
                if(maxDayHits >= badgesData[id].hits){
                    if(!badgesPref[id]){
                        this.newBadgeAlert(badgesData[id].title);
                    }
                    badgesPref[id] = {
                        'time': time
                    };
                }
            }else if(badgesData[id].type=='milestones_all'){
                if(allHits >= badgesData[id].hits){
                    if(!badgesPref[id]){
                        this.newBadgeAlert(badgesData[id].title);
                    }
                    badgesPref[id] = {
                        'time': time
                    };
                }
            }
        }
        this.setObjPref('badges',badgesPref,true);
    },
    newBadgeAlert: function(text){
        //alert(text);
    },
    getObjPref: function(name,decode){
        var pref = wips.getPref(name);
        if(!pref){
            pref = '{}';
        }else{
            if(decode){
                pref = decodeURIComponent(pref);
            }
        }
        return JSON.parse(pref);
    },
    setObjPref: function(name,data,encode){
        if(data){
            var strData = JSON.stringify(data);
            if(strData){
                if(encode){
                    strData = encodeURIComponent(strData);
                }
                wips.setPref(name,strData);
            }
        }
    }
}

setInterval(function(){
    //badges.checkNewBadges();
},10000);