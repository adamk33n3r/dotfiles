$(document).ready(function(){
    
    // OBECNE FCE
    function getPref(name){
        var value = localStorage[name];
        if(value == 'false') 
            return false; 
        else  
            return value;
    }
    function setPref(name,value){
        localStorage[name] = value;
    }
    
    /*function initCheck(id){
        if(getPref(id)){
            $('#'+id).attr('checked','checked');
        }
    }
    function changeCheck(id){
        if(getPref(id)){
            setPref(id,false);
            $('#'+id).removeAttr('checked');
        }else{
            setPref(id,true);
            $('#'+id).attr('checked','checked');
        }
        notify('Settings have been saved');
    }*/
    
    // ALARM FCE
    function isURL(url){
        var RegExp = /^(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,4}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?$/; 
        if(RegExp.test(url)){ 
            return true; 
        }else{ 
            return false; 
        } 
    }
    function getWebs(){
        var awStr = getPref('alarm_webs');
        if(!awStr){
            awStr = '[]';
        }
        return JSON.parse(awStr);
    }
    function setWebs(webs){
        setPref('alarm_webs',JSON.stringify(webs));
    }
    function renderWebList(){
        var webs = getWebs();
        var webList = $('#web_list');
        webList.html('');
        for(var i in webs){
            var web = webs[i];
            var blok = $('<div class="blok" rel="'+i+'"><strong class="url">'+web.url+'</strong><span class="label">Allowed time</span></div>');
            webList.append(blok);
            var alarmTimeElm = $('<select class="time" name=""></select>');
            blok.append(alarmTimeElm);
            renderAlarmTime(alarmTimeElm,web.alarmTime);
            if(web.enableEdit){
                alarmTimeElm.change(function(e){
                    var rel = $(this).parent('.blok').attr('rel');
                    changeWeb(rel,e.target.value);
                });
            }else{
                alarmTimeElm.attr('disabled','disabled');
            }
            blok.append($('<span class="label">per day</span>'));
            var removeElm = $('<img class="remove" src="images/delete.png" alt="" />');
            blok.append(removeElm);
            removeElm.click(function(){
                var rel = $(this).parent('.blok').attr('rel');
                removeWeb(rel);
            });
        }
    }
    function addWeb(){
        var input = $('#web_add .text');
        if(isURL(input.val())){
            var webs = getWebs();
            var url = input.val().replace("http:\/\/","").replace("https:\/\/","").replace("www.","").split('/')[0].toLowerCase();
            var exists = false;
            for(var i in webs){
                if(webs[i].url == url) exists = true;
            }
            if(!exists){
                var date = new Date();
                webs.push({url: url, alarmTime: 3600, actualTime: 0, actualDay: date.getDate(), enableEdit: true});
                setWebs(webs);
                input.val('').focus();
                renderWebList();
                notify('Settings have been saved');
            }else{
                notify('Url exists!');
            }
        }else{
            notify('Invalid url!');
        }
    }
    function changeWeb(pos,alarmTime){
        var webs = getWebs();
        webs[pos].alarmTime = alarmTime;
        setWebs(webs);
        renderWebList();
        notify('Settings have been saved');
    }
    function removeWeb(pos){
        var webs = getWebs();
        if(confirm('Really want to delete "' + webs[pos].url + '"')){
            webs.splice(pos,1);
            setWebs(webs);
            renderWebList();
            notify('Settings have been saved');
        }
    }
    var alarmTimes = [['5min',300],['10min',600],['15min',900],['30min',1800],['45min',2700],['1h',3600],['1.5h',5400],['2h',7200],['2.5h',9000],['3h',10800],['4h',14400],['5h',18000],['6h',21600],['7h',25200],['10h',36000],['15h',54000]];
    function renderAlarmTime(selectElm,alarmTime){
        selectElm.html('');
        for(var i = 0; i < alarmTimes.length; i++){
        		var elm = $('<option></option>');
        		elm.html(alarmTimes[i][0]);
        		elm.attr('value',alarmTimes[i][1]);
            if(alarmTimes[i][1] == alarmTime){
                elm.attr('selected','selected');
            }
        		selectElm.append(elm);
        }
    }
    function renderMode(){
        var active = getPref('mode');
        $('#mode input[type=radio]').each(function(){
            if($(this).val() == active){
                $(this).attr('checked','checked');
            }
        });
        if(active == 'notif'){
            $('#mode .mode_notif_time').removeClass('none');
        }else{
            $('#mode .mode_notif_time').addClass('none');
        }
    }
    function changeMode(val){
        setPref('mode',val);
        notify('Settings have been saved');
        renderMode();
    }
    var notifTime = [['20s',20],['40s',40],['1min',60],['2min',120],['3min',180],['5min',300],['10min',600],['20min',1200],['30min',1800]];
    function renderNotifTime(){
        var selectElm = $('.mode_notif_time select');
        selectElm.html('');
        for(var i = 0; i < notifTime.length; i++){
        		var elm = $('<option></option>');
        		elm.html(notifTime[i][0]);
        		elm.attr('value',notifTime[i][1]);
            if(notifTime[i][1] == getPref('mode_notif_time')){
                elm.attr('selected','selected');
            }
        		selectElm.append(elm);
        }
    }
    function changeNotifTime(newTime){
        setPref('mode_notif_time',newTime);
        renderNotifTime();
        notify('Settings have been saved');
    }
    
    //reports
    
    function renderReportInterval(){
        var active = getPref('report_interval');
        $('#report_interval input[type=radio]').each(function(){
            if($(this).val() == active){
                $(this).attr('checked','checked');
            }
        });
    }
    function changeReportInterval(val){
        setPref('report_interval',val);
        setPref('report_last_time',new Date().getTime());
        notify('Settings have been saved');
        renderReportInterval();
    }
    
    // INIT
    
    //UNIV CHECK (id=pref)
    /*$('input[type=checkbox]').each(function(){
        if($(this).hasClass('univ_check')){
            initCheck($(this).attr('id'));
        }
    });
    $('input[type=checkbox]').change(function(){
        if($(this).hasClass('univ_check')){
            changeCheck($(this).attr('id'));
        }
    });*/
    
    renderWebList();
    $('#web_add .add').click(function(){
        addWeb();
    });
    $('#web_add .text').keypress(function(e){
        if(e.which == 13){
            e.preventDefault();
            addWeb();
        }
    });
    renderMode();
    $('#mode input[type=radio]').click(function(){
        changeMode($(this).val());
    });
    renderNotifTime();
    $('.mode_notif_time select').change(function(e){
        changeNotifTime(e.target.value);
    });
    
    //reports
    
    renderReportInterval();
    $('#report_interval input[type=radio]').click(function(){
        changeReportInterval($(this).val());
    });
    
});