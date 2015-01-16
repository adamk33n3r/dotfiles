var bgPage = chrome.extension.getBackgroundPage();
var isPremium = false;
var tempBackProfs = {};
var timerPayment;

function refreshOptionsTab()
{
    fillDateSelect();
    fillSelectSite($('#site_to_delete')[0]);
    loadOptions();
}

function loadOptions()    //showing loaded options on page elements
{
    var options = getOptions();
    document.getElementById("history_size").value = Number(options.history_size);
    document.getElementById("idle_time").value = Number(options.idle_time);
    document.getElementById("week_start").value = options.week_start;
    document.getElementById("day_end_time").value = options.day_end_time;
    document.getElementById("default_popup_action").value = options.default_popup_action;
    document.getElementById("date_format").value = options.date_format;
    document.getElementById("show_icon_text").checked = options.show_icon_text;
    document.getElementById("show_uncategorized").checked = options.show_uncategorized;
    document.getElementById("hidden_domains").value = options.hidden_domains.join(', ');
    document.getElementById("more_than_2_levels_domains").value = options.more_than_2_levels_domains.join(', ');

    fillSelectCategoryDelete();
    setAllTextareasHeight();
    renderStats();
    renderUpdateNotify();
}

function fillSelectCategoryDelete()
{
    fillSelectCategory($('#category_to_delete')[0]);
}

function setTextareaHeight(id)
{
    $('#' + id).css('height', Math.ceil($('#' + id).val().length / 180 + 1)  + 'em');
}

function setAllTextareasHeight()
{
    var items = ["hidden_domains", "more_than_2_levels_domains"], i;
    for (i in items)
    {
        setTextareaHeight(items[i]);
    }
}

function saveOptions(options)
{
    storage_set('options', options);

    //getting backpage link to update their options
    var backPage = chrome.extension.getBackgroundPage();
    backPage.options = options;

    notifySaved();
}

function setChecked(input)
{
    var options = getOptions();
    options[input.id] = input.checked;

    saveOptions(options);
}

function setHistory()
{
    if(confirm('Are you sure you want to change you history range? All data outside of this range will be deleted.')){
        
        var options = getOptions();
    
        var h_size = Number( document.getElementById("history_size").value ).toFixed(0);
        h_size = Math.max(h_size, 0);
        if (!isNaN(h_size)) options.history_size = h_size;
    
        document.getElementById("history_size").value = h_size;
    
        saveOptions(options);
        
    }else{
        window.location.reload();
    }
}

function setValue(id)
{
    var options = getOptions();
    options[id] = document.getElementById(id).value;
    saveOptions(options);
}

function setValueArray(id)
{
    var options = getOptions();
    var items = document.getElementById(id).value.split(',');
    var i;

    for (i in items)
    {
        items[i] = $.trim(items[i]);
    }

    items = getUnique(items);
    options[id] = items;
    saveOptions(options);

    $('#' + id).val(items.join(', '));
    setTextareaHeight(id);
}

function setIdle()
{
    var options = getOptions();

    var idle_time = Number( document.getElementById("idle_time").value ).toFixed(0);
    idle_time = Math.max(idle_time, 15);
    if (!isNaN(idle_time)) options.idle_time = idle_time;

    document.getElementById("idle_time").value = idle_time;

    saveOptions(options);
}

function deleteDate()
{
    var date = document.getElementById("date_to_delete").value;
    var options = getOptions();
    var dateObject = getDateObject(date);
    var dateText = getFormatedDate(dateObject, options.date_format);
    
    if (confirm(chrome.i18n.getMessage("delete_date_confirm", dateText)))
    {
        var visits = getVisits();
        delete visits[date];
        setVisits(visits);
        
        fillDateSelect();

        // deleted date is today
        if (date == getFormatedDate())
        {
            var backPage = chrome.extension.getBackgroundPage();
            backPage.today = {}; //clean today statistics in backpage
        }

        notify(chrome.i18n.getMessage("date_removed", dateText));
        
        bgPage.control.syncRemove('day',[date]);
    }
}

function deleteSite()
{
    var site = document.getElementById("site_to_delete").value;

    if ( confirm(chrome.i18n.getMessage("delete_site_confirm", site)) )
    {
        handleDeleteSite(site);
    }
}

function handleDeleteSite(site)
{
    deleteSiteStats(site);
    removeSiteFromCategories(site);

    notify(chrome.i18n.getMessage("site_removed", site));
    updateData();
    fillSelectSite($('#site_to_delete')[0]);
}

function deleteSiteStats(site,from_categ)
{
    var visits = getVisits();
    var today = getDateToday();
    var updateToday = false;
    var date;

    for (date in visits)
    {
        if (visits[date][site])
        {
            delete visits[date][site];
            updateToday = updateToday || date == today;
        }
    }
    
    setVisits(visits);
    
    if (updateToday == true)
    {
        var backPage = chrome.extension.getBackgroundPage();
        backPage.today = visits[today];
    }
    
    if(!from_categ){
        bgPage.control.syncRemove('domain',[site]);
    }
}

function removeSiteFromCategories(domain)
{
    var options = getOptions();
    var catNew, j, k, found = false;
    for (j in options.categories)
    {
        category = options.categories[j];
        catNew = [];
        for (k in category)
        {
            if (category[k] != domain)
            {
                catNew.push(category[k]);
            }
            else
            {
                found = true;
            }
        }

        if (found == true)
        {
            options.categories[j] = catNew;
            saveOptions(options);
            return;
        }
    }
}

function restoreDefaults()
{
    if (confirm(chrome.i18n.getMessage("restore_defaults_confirm")))
    {
        var options = getDefaultOptions();
        saveOptions(options);
        location.reload();
    }
}

function clearLocalStorage()
{
    if ( confirm(chrome.i18n.getMessage("clear_all_confirm")) )
    {
        storage_set('visits', {});

        var backPage = chrome.extension.getBackgroundPage();
        //clearing today options in backPage
        backPage.today={};
        backPage.write();

        refreshOptionsTab();

        notify(chrome.i18n.getMessage("clear_all_success"));
    }
}

function clearCategory()
{
    var category = document.getElementById('category_to_delete').value;
    var categoryName = getCategoryName(category);

    if ( confirm(chrome.i18n.getMessage("clear_category_confirm", categoryName)) )
    {
        var delSites = [];
        var options = getOptions();
        var c, d;
        for (c in options.categories)
        {
            if (c == category)
            {
                for (d in options.categories[c])
                {
                    deleteSiteStats(options.categories[c][d],true);
                    delSites.push(options.categories[c][d]);
                }
            }
        }

        refreshOptionsTab();

        notify(chrome.i18n.getMessage("category_stats_removed", categoryName));
        
        if(delSites.length > 0){
            bgPage.control.syncRemove('domain',delSites);
        }
    }
}

function getNotification()
{
    var msg = arguments[0];
    var css = '';
    if (arguments.length > 1 && arguments[1] != undefined)
    {
        css = ' ' + arguments[1];
    }

    return '<div class="notification' + css + '" title="' + chrome.i18n.getMessage('click_to_dismiss') + '">' +  msg + '</div>';
}

var timeout;
function notify(msg)
{
    clearTimeout(timeout);

    $('#detail .notification').remove();
    $('#detail').append(getNotification(msg));
    var left = (window.innerWidth - $("#detail .notification").width()) / 2;
    
    $("#detail .notification").css('left', left + 'px');
    $("#detail .notification").fadeIn("normal", function() {
        timeout = setTimeout(function() { $("#detail .notification").fadeOut("normal", function() { $(this).remove(); }); }, 3000);
    });

    updateData();
}


function notifySaved()
{
    notify(chrome.i18n.getMessage("options_saved"));    
}

function fillDateSelect()
{
    //creating string array with dates
    var dateStrings = getDateStrings();

    var options = getOptions();
    var text, date, i;
    
    var dateSelector = document.getElementById("date_to_delete");
    dateSelector.length = 0;
    
    for (i in dateStrings)
    {
        date = getDateObject(dateStrings[i]);
        text = getFormatedDate(date, options.date_format);
        dateSelector.options[dateSelector.options.length] = new Option(text, dateStrings[i]);
    }
}

function getPref(name)
{
    var value = storage_get(name);
    if(value == 'false')
        return false;
    else
        return value;
}

function setPref(name,value)
{
    storage_set(name, value);
}

function setStats()
{
    if (getPref('stats'))
    {
        setPref('stats',false);
        document.getElementById('stats_check').removeAttribute('checked');
    }
    else
    {
        setPref('stats',true);
        document.getElementById('stats_check').setAttribute('checked');
    }

    notifySaved();
}

function renderStats()
{
    if (getPref('stats'))
    {
        document.getElementById('stats_check').setAttribute('checked','checked');
    }
}

function setUpdateNotify()
{
    if (getPref('update_notify_active'))
    {
        setPref('update_notify_active',false);
        document.getElementById('update_notify_check').removeAttribute('checked');
    }
    else
    {
        setPref('update_notify_active',true);
        document.getElementById('update_notify_check').setAttribute('checked');
    }

    notifySaved();
}

function renderUpdateNotify()
{
    if (getPref('update_notify_active'))
    {
        document.getElementById('update_notify_check').setAttribute('checked','checked');
    }
}


function exportStats()
{
    var i, len, date, dateStats, domain, time;
    var text = chrome.i18n.getMessage('Day') + ';' + chrome.i18n.getMessage('Domain') + ';' + chrome.i18n.getMessage('Time') + "\n";

    var dateStrings = getDateStrings();
    var visits = getVisits();
    
    for (i = 0, len = dateStrings.length; i < len; i++)
    {
        date = dateStrings[i];
        dateStats = visits[date];
        for (domain in dateStats)
        {
            time = dateStats[domain];
            text += date + ';' + domain + ';' + time + "\n";
        }
    }

    var bb = new BlobBuilder([text], { "type" : "text\/csv" });
    saveAs(bb, "export.csv");
}

// NEWS
/*function renderActualNews(){
    var actual_news = {
        n01:{text:'Discover all new features in latest TimeStats.',url:'http://www.wips.com/news/detail/66/what-s-new-in-timestats'},
        n02:{text:'Read how you can submit new ideas for this extension here.',url:'http://www.wips.com/news/detail/63/submit-new-idea-with-a-5-star-review'}
    }
    var news_showed = getPref('news_showed');
    if(!news_showed){
        news_showed = {};
        setPref('news_showed',{});
    }
    var newsElm = $('#info_news').html('');
    var titleAdded = false;
    for(var id in actual_news){
        if(!news_showed[id]){
            if(!titleAdded){
                newsElm.append('<strong class="title">News</strong>');
                titleAdded = true;
            }
            var item = $('<div class="item" rel="'+id+'"></div>');
            item.append(
                $('<span class="link">'+actual_news[id].text+'</span>').click(function(){
                    var rel = $(this).parent().attr('rel');
                    var temp_news_showed = getPref('news_showed');
                    temp_news_showed[rel] = true;
                    setPref('news_showed',temp_news_showed);
                    renderActualNews();
                    window.open(actual_news[rel].url,'_blank');
                })
            );
            item.append(
                $('<span class="close">X</span>').click(function(){
                    var rel = $(this).parent().attr('rel');
                    var temp_news_showed = getPref('news_showed');
                    temp_news_showed[rel] = true;
                    setPref('news_showed',temp_news_showed);
                    renderActualNews();
                })
            );
            newsElm.append(item);
        }
    }
}*/

function getPref2(name){
    var value = localStorage[name];
    if(value == 'false')
        return false;
    else
        return value;
}
function setPref2(name,value){
    localStorage[name] = value;
}

/* BADGES */

/*var bagdesPref;

function renderBadgesList(){
    $('#badges_detail').css('display','none').html('');
    var badges_list = $('#badges_list');
    badges_list.css('display','block').html('');
    for(var id in badgesData){
        var bd = badgesData[id];
        var bp = bagdesPref[id];
        if(bd['public'] || bp){
            var item = $('<div class="item"></item>');
            badges_list.append(item);
            var src = 'default';
            if(bp){
                item.attr('id',id).addClass('active').click(function(){
                    renderBadgesDetail($(this).attr('id'));
                });
                src = id;
            }
            var image = $('<div class="image"></div>');
            item.append(image);
            image.append($('<img src="images/badges/' + src + '.png" alt="" />'));
            if(bp && bp.level){
                image.append($('<span class="level">' + bp.level + '</span>'));
            }
            var content = $('<div class="content"></div>');
            item.append(content);
            content.append($('<span class="title">' + bd.title + '</span>'));
            if(bp && bp.time){
                var timePom = new Date(bp.time);
                var time = timePom.getDate()+'.'+(timePom.getMonth()-(-1)).toString()+'.'+timePom.getFullYear()+' '+timePom.getHours()+':'+timePom.getMinutes();
                content.append($('<span class="time">' + time + '</span>'));
            }
        }
    }
    badges_list.append($('<div class="clear"></div>'));
}

function renderBadgesDetail(id){
    $('#badges_list').css('display','none').html('');
    var badges_detail = $('#badges_detail');
    badges_detail.css('display','block').html('');
    var badge = badgesData[id];
    var badgePref = bagdesPref[id];
    var left = $('<div class="left"></div>');
    left.attr('id',id);
    badges_detail.append(left);
    left.append($('<img src="images/badges/' + id + '.png" alt="" />'));
    if(badgePref.level){
        left.append($('<span class="level">' + badgePref.level + '</span>'));
    }
    var right = $('<div class="right"></div>');
    badges_detail.append(right);
    right.append($('<span class="title">' + badge.title + '</span>'));
    var timePom = new Date(badgePref.time);
    var time = timePom.getDate()+'.'+(timePom.getMonth()-(-1)).toString()+'.'+timePom.getFullYear()+' '+timePom.getHours()+':'+timePom.getMinutes();
    right.append($('<span class="time">' + time + '</span>'));
    right.append($('<span class="desc">' + badge.desc + '</span>'));
    badges_detail.append($('<div class="clear"></div>'));
    var back = $('<span class="back">&laquo; Back to badges list</span>');
    back.click(function(){
        renderBadgesList();
    });
    badges_detail.append(back);
}*/

function loader(show){
    var loader = $('.loader');
    if(show){
        loader.removeClass('none');
    }else{
        loader.addClass('none');
    }
}

// PREMIUM (zmena profilu a zobrazeni dat)

function changeProfile(id,name){
    if(id == 'main'){
        specialProfileVisits = undefined;
        $('.show_only_in_main_profile').css('display','block');
    }else{
        specialProfileVisits = 'visits__' + id;
        $('.show_only_in_main_profile').css('display','none');
        var loc = location.href;
        if(loc.indexOf('options.html#_options')!=-1 || loc.indexOf('options.html#_categories')!=-1 || loc.indexOf('options.html#_category_categories')!=-1){
            $('#dashboard').trigger('click');
        }
    }
    fullRefreshOptions();
}

function fullRefreshOptions(){
    dateStrings = getDateStrings();
    startDate = dateStrings[0];
    endDate = dateStrings[dateStrings.length-1];
    fillSelectDate();
    updateView();
    $(".daily_average_browsing").html(secondsToHourMinSec(daysAvg));
    $(".weekly_browsing_time").html(secondsToHourMinSec(weeksAvg));
    $(".monthly_browsing_time").html(secondsToHourMinSec(monthsAvg));
    $(".total_browsing_time").html(secondsToHourMinSec(getTotalTimeRange()));
    var data = makeTable(getMostVisited());
    $('.category.most_visited table').html(data);
    var data = busiestDays();
    $('.category.busiest table').html(data);
    renderSearch($('.category.search input[type=text]').val());
}

// POPUP FIRST SYNC - show select name / load exist profile
function premiumFirstPopup(){
    $('#create_profile').show(0);
    loader(true);
    //$('#loader_first_sync').removeClass('none');
    var login = bgPage.wips.getPref('premium_login');
    var password = bgPage.wips.getPref('premium_password');
    if(!login || !password){
        alert('Not authorization!');
        return;
    }
    var url = 'https://plugins.wips.com/timestats/api/v2/data?settings=1';
    var r = new XMLHttpRequest();
    r.open("GET", url, true);
    r.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    r.setRequestHeader('Authorization', 'Basic ' + bgPage.encode64(login + ':' + password).replace(/=/,'')); 
    r.onreadystatechange = function(){
        if(r.readyState == 4 && (r.status == 200 || r.status == 204)){
            loader(false);
            //$('#loader_first_sync').addClass('none');
            var data = {};
            try{
                data = JSON.parse(r.responseText);
            }catch(e){}
            if(data){
                premiumFirstPopupDo(data);
            }
        }
    }
    r.send(null);
}

function premiumFirstPopupDo(data){
    var selectedOptionsId, selectedDataId, selectedDataRemove;
    var lng = 0;
    for(var i in data){lng++}
    if(lng > 0){
        // load settings
        $('#create_profile .load_options').removeClass('none2');
        $('#load_options_check').click(function(){
            if($(this).attr('checked')){
                $('#load_options_showhide').removeClass('none2');
            }else{
                $('#load_options_showhide').addClass('none2');
            }
        });
        for(var i in data){
            var item = $('<span class="item" rel="'+i+'">'+decodeURIComponent(data[i].profile.name.replace(/\+/gi,' '))+'</span>');
            item.click(function(){
                $('#load_options_showhide .select .item').removeClass('active');
                $(this).addClass('active');
                selectedOptionsId = $(this).attr('rel');
            });
            $('#load_options_showhide .select').append(item);
        }
        // load data (profile)
        for(var i in data){
            var item = $('<span class="item" rel="'+i+'">'+decodeURIComponent(data[i].profile.name.replace(/\+/gi,' '))+'<br /></span>');
            item.append(
                $('<span class="butt remove">Overwrite existing data</span>').click(function(){
                    $('#create_profile .load_profile .select .item').removeClass('active');
                    $(this).parent('.item').addClass('active');
                    $('#create_profile .load_profile .select .item .butt').removeClass('active');
                    $(this).addClass('active');
                    selectedDataId = $(this).parent('.item').attr('rel');
                    selectedDataRemove = true;
                })
            );
            item.append(
                $('<span class="butt update">Add/update existing data</span>').click(function(){
                    $('#create_profile .load_profile .select .item').removeClass('active');
                    $(this).parent('.item').addClass('active');
                    $('#create_profile .load_profile .select .item .butt').removeClass('active');
                    $(this).addClass('active');
                    selectedDataId = $(this).parent('.item').attr('rel');
                    selectedDataRemove = false;
                })
            );
            $('#create_profile .load_profile .select').append(item);
        }
        // toggle create/load
        $('#create_profile .toggle .select').removeClass('disable');
        $('#create_profile .toggle .create').click(function(){
            $('#create_profile .toggle .create').addClass('active');
            $('#create_profile .toggle .select').removeClass('active');
            $('#create_profile .new_profile').removeClass('none2');
            $('#create_profile .load_profile').addClass('none2');
        });
        $('#create_profile .toggle .select').click(function(){
            $('#create_profile .toggle .select').addClass('active');
            $('#create_profile .toggle .create').removeClass('active');
            $('#create_profile .new_profile').addClass('none2');
            $('#create_profile .load_profile').removeClass('none2');
        });
    }
    // confirm ok
    $('#create_profile .ok').click(function(){
        //save settings
        if($('#load_options_check').attr('checked') && selectedOptionsId){
            setPref2('options',decodeURIComponent(data[selectedOptionsId].profile.settings.replace(/\+/gi,' ')));
        }
        //get data - create profile
        if($('#create_profile .toggle .create').hasClass('active')){
            var name = $('#create_profile .name').val().trim();
            if(name){
                loader(true);
                $('#loader_first_sync').removeClass('none');
                setPref2('sync_profile_name',name);
                bgPage.control.checkPremiumFirstStart(function(){
                    loader(false);
                    $('#loader_first_sync').addClass('none');
                    location.reload();
                });
            }else{
                alert('Name is empty!');
                return;
            }
        //get data - load profile
        }else if($('#create_profile .toggle .select').hasClass('active')){
            if(selectedDataId){
                loadFirstSyncData(selectedDataId,data,selectedDataRemove);
            }else{
                alert('Select profile!');
            }
        }
    });
}

function loadFirstSyncData(id,data,isRemove){
    loader(true);
    $('#loader_first_sync').removeClass('none');
    //remove
    if(isRemove){
        setPref2('visits',JSON.stringify(data[id].data));
        setPref2('sync_profile_name',decodeURIComponent(data[id].profile.name.replace(/\+/gi,' ')));
        setPref2('sync_profile_id',id);
        bgPage.control.syncPost(data[id].data,function(){
            location.reload();
        });
    //update
    }else{
        var visits = JSON.parse(getPref2('visits'));
        var newProf = data[id].data;
        for(var date in newProf){
            if(!visits[date]){
                visits[date] = {};
            }
            for(var domain in newProf[date]){
                if(visits[date][domain]){
                    visits[date][domain] += newProf[date][domain];
                }else{
                    visits[date][domain] = newProf[date][domain];
                }
            }
        }
        setPref2('visits',JSON.stringify(visits));
        setPref2('sync_profile_name',decodeURIComponent(data[id].profile.name.replace(/\+/gi,' ')));
        setPref2('sync_profile_id',id);
        bgPage.control.syncPost(visits,function(){
            location.reload();
        });
    }
}


// INIT
$(function() {
    var backPage = chrome.extension.getBackgroundPage();
    backPage.write();//saving current state in localStorage

    refreshOptionsTab();

    $('#close').click(function(e) {
        window.close();
    });

    $('#deleteDate,#deleteSite,#clearCategory,#clearLocalStorage,#restoreDefaults,#exportStats').click(function(e) {
        e.preventDefault();
        window[$(this).attr('id')]();
    });

    $('a.credits').click(function() {
        return !window.open(this.href);
    });

    $('#history_size').on('change', function() {
        setHistory();
    });

    $('#idle_time').on('change', function() {
        setIdle();
    });

    $('#week_start,#default_popup_action,#day_end_time').on('change', function() {
        setValue($(this).attr('id'));
    });
    
    $('#date_format').on('change', function() {
        setValue($(this).attr('id'));
        removeDatepicker();
        fillSelectDate();
        fillDateSelect();
        updateData();
    });

    $('#hidden_domains,#more_than_2_levels_domains').on('change', function() {
        setValueArray($(this).attr('id'));
    });

    $('#show_icon_text,#show_uncategorized').on('change', function() {
        setChecked(this);
    });

    $('#stats_check').on('change', function() {
        setStats();
    });
    
    $('#update_notify_check').on('change', function() {
        setUpdateNotify();
    });

    $('.notification').live('click', function(e) {
        e.preventDefault();
        $(this).fadeOut(function() { $(this).remove() });
    });
    
    /* BADGES */
    
    /*bagdesPref = JSON.parse(decodeURIComponent(localStorage['badges']));
    
    $('#badges').click(function(){
        renderBadgesList();
    });*/
    
    /* FB CONNECT */
    
    $('.topright_get_premium').click(function(){
        trackButton('Options','Premium','Small button');
        location.href = 'premium.html';
    });
    
    $('#topright_fb_connect').css('display','block').click(function(){
        trackButton('Options','Fb Share','Click');
        if(getPref('fb_share_ok')){
            bgPage.facebook.apiShareUrl(function(){
                notify('You have successfully shared TimeStats');
                trackButton('Options','Fb Share','Share OK');
            });
        }else{
            bgPage.facebook.login(function(ok){
                if(ok){
                    bgPage.facebook.apiShareUrl(function(){
                        notify('You have successfully shared TimeStats');
                        trackButton('Options','Fb Share','Share OK');
                    });
                }
            });
        }
    });
    //$('.special_legend_daysmonths').css('display','none');
    //$('#whats_new_link').css('display','block');
    
    // NEWS
    //renderActualNews();
    
    // visitet stats - tooltip on legend
    $('.legend_hover').live('hover',function(){
        renderPieTooltip('.chart_all',$(this).attr('rel'));
    });
    
    // visitet stats - icon to detail graph
    $('.legend_stats').live('click',function(){
        var rel = $(this).attr('rel');
        if($('#siteSelectId').val() == null){
            fillSelectSite();
        }
        $('#siteSelectId').val(rel);
        $('#category_sites').trigger('click');
    });
    
    /////////// PREMIUM /////////////
    
    if(bgPage.control.isPremium){
        isPremium = true;
    }
    
    if(isPremium){
        $('#premium').show(0);
        $('.topright_get_premium').css('display','none');
        $('#menu_premium').css('display','none');
        $('#topright_ispremium_text').css('display','block');
        //$('#top_premium').hide(0);
        var main_name = getPref2('sync_profile_name');
        if(!main_name){
            premiumFirstPopup();
        }else{
            // PROFILE SELECTED - load top bar functions
            var main_id = getPref2('sync_profile_id');
            var elmList = $('#premium .list_profiles');
            elmList.show(0);
            var profileSelect = $('<select class="profile_select"></select>');
            profileSelect.change(function(e){
                changeProfile(e.target.value,e.target.selectedOptions[0].innerHTML);
            });
            elmList.append(profileSelect);
            //all
            var profile_all = $('<option value="all">All profiles</option>');
            profileSelect.append(profile_all);
            //main
            var profile_main = $('<option value="main" selected="selected">'+main_name+'</option>');
            profileSelect.append(profile_main);
            //others
            var other_profiles_text = getPref2('sync_other_profiles');
            if(other_profiles_text){
                var other_profiles = JSON.parse(other_profiles_text);
                for(var id in other_profiles){
                    var button = $('<option value="'+id+'">'+other_profiles[id]+'</option>');
                    profileSelect.append(button);
                }
            }
            var syncNow = $('<input type="button" value="Synchronize now" class="nice_button blue" style="line-height:15px;margin:-1px 0 0 50px;" />');
            elmList.append(syncNow);
            syncNow.click(function(){
                loader(true);
                bgPage.control.syncPostPrepare(function(){
                    loader(false);
                    location.reload();
                },true);
            });
        }
        // BACKUP
        $('#backup_obal').css('display','block');
        $('#backup_show').click(function(){
            loader(true);
            var login = getPref2('premium_login');
            var password = getPref2('premium_password');
            if(!login || !password){
                alert('Not authorization!');
                return;
            }
            var url = 'https://plugins.wips.com/timestats/api/v2/data';
            var r = new XMLHttpRequest();
            r.open("GET", url, true);
            r.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            r.setRequestHeader('Authorization', 'Basic ' + bgPage.encode64(login + ':' + password).replace(/=/,'')); 
            r.onreadystatechange = function(){
                if(r.readyState == 4){
                    if(r.status == 200){
                        tempBackProfs = JSON.parse(r.responseText);
                        var profElms = $('#backup_profiles');
                        profElms.empty();
                        for(var id in tempBackProfs){
                            var block = $('<div class="block" data-id="'+id+'"></div>');
                            profElms.append(block);
                            var name = $('<span class="name">'+decodeURIComponent(tempBackProfs[id].profile.name.replace(/\+/gi,' '))+'</span>');
                            block.append(name);
                            var remove = $('<span class="remove">Overwrite existing data</span>');
                            block.append(remove);
                            //remove
                            remove.click(function(){
                                loader(true);
                                $('#loader_first_sync').removeClass('none');
                                if(confirm('Really do you want overwrite existing data?')){
                                    var id = $(this).parent('.block').attr('data-id');
                                    setPref2('visits',JSON.stringify(tempBackProfs[id].data));
                                    setPref2('sync_profile_name',decodeURIComponent(tempBackProfs[id].profile.name.replace(/\+/gi,' ')));
                                    setPref2('sync_profile_id',id);
                                    bgPage.control.syncPost(tempBackProfs[id].data,function(){
                                        location.reload();
                                    });
                                }
                            });
                            var update = $('<span class="update">Add/update existing data</span>');
                            block.append(update);
                            //update
                            update.click(function(){
                                loader(true);
                                $('#loader_first_sync').removeClass('none');
                                if(confirm('Really do you want updated existing data?')){
                                    var id = $(this).parent('.block').attr('data-id');
                                    var visits = JSON.parse(getPref2('visits'));
                                    var newProf = tempBackProfs[id].data;
                                    for(var date in newProf){
                                        if(!visits[date]){
                                            visits[date] = {};
                                        }
                                        for(var domain in newProf[date]){
                                            if(visits[date][domain]){
                                                visits[date][domain] += newProf[date][domain];
                                            }else{
                                                visits[date][domain] = newProf[date][domain];
                                            }
                                        }
                                    }
                                    setPref2('visits',JSON.stringify(visits));
                                    setPref2('sync_profile_name',decodeURIComponent(tempBackProfs[id].profile.name.replace(/\+/gi,' ')));
                                    setPref2('sync_profile_id',id);
                                    bgPage.control.syncPost(visits,function(){
                                        location.reload();
                                    });
                                }
                            });
                        }
                        loader(false);
                    }
                }
            };
            r.send(null);
        });
        // DELETE
        $('#delete_profile').click(function(){
            if(confirm('Are you sure you want to delete this profile? You will remove all premium functionality on this browser.')){
                var login = getPref2('premium_login');
                var password = getPref2('premium_password');
                var url = 'https://plugins.wips.com/timestats/api/v2/profile?id=' + getPref2('sync_profile_id');
                var r = new XMLHttpRequest();
                r.open("DELETE", url, true);
                r.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                r.setRequestHeader('Authorization', 'Basic ' + bgPage.encode64(login + ':' + password).replace(/=/,'')); 
                r.onreadystatechange = function(){
                    if(r.readyState == 4 && r.status == 200){
                        setPref2('premium_login','');
                        setPref2('premium_password','');
                        setPref2('sync_profile_id','');
                        setPref2('sync_profile_name','');
                        setPref2('sync_other_profiles','{}');
                        setPref2('visits','{}');
                        bgPage.control.isPremium = false;
                        location.reload();
                    }
                };
                r.send(null);
            }
        });
        // SETTINGS SYNC
        $('#load_settings_obal').css('display','block');
        $('#load_settings_show').click(function(){
            loader(true);
            var login = getPref2('premium_login');
            var password = getPref2('premium_password');
            if(!login || !password){
                alert('Not authorization!');
                return;
            }
            var url = 'https://plugins.wips.com/timestats/api/v2/data?settings=1';
            var r = new XMLHttpRequest();
            r.open("GET", url, true);
            r.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            r.setRequestHeader('Authorization', 'Basic ' + bgPage.encode64(login + ':' + password).replace(/=/,'')); 
            r.onreadystatechange = function(){
                if(r.readyState == 4){
                    if(r.status == 200){
                        var data = JSON.parse(r.responseText);
                        var settElms = $('#load_settings_profiles');
                        settElms.empty();
                        for(var id in data){
                            var block = $('<span class="block" data-id="'+id+'">'+decodeURIComponent(data[id].profile.name.replace(/\+/gi,' '))+'</span>');
                            settElms.append(block);
                            block.click(function(){
                                if(confirm('Really do you want overwrite existing settings?')){
                                    var id = $(this).attr('data-id');
                                    setPref2('options',decodeURIComponent(data[id].profile.settings.replace(/\+/gi,' ')));
                                    location.reload();
                                }
                            });
                        }
                        loader(false);
                    }
                }
            };
            r.send(null);
        });
    }
    
    if(bgPage.control.waitingPayment){
        $('#waiting_for_payment').css('display','block');
        timerPayment = setInterval(function(){
            checkTimerPayment();
        },3000);
    }
    
    /*$('#top_premium').click(function(){
        trackButton('Options','Premium top button');
        location.href = 'premium.html';
    });*/
    
    $('#leftmenu_share .fb').click(function(){
        trackButton('Options','Leftmenu Share','facebook-share');
    });
    
    $('#leftmenu_share .twt').click(function(){
        trackButton('Options','Leftmenu Share','twitter-share');
    });
    
    
});

function checkTimerPayment(){
    var url = 'https://plugins.wips.com/timestats/pay/check?username='+encodeURIComponent(getPref2('premium_login'))+'&password='+encodeURIComponent(getPref2('premium_password'));
    var r = new XMLHttpRequest();
    r.open("GET", url, true);
    r.onreadystatechange = function (){
        if(r.readyState == 4){
            if(r.status == 202){
                clearInterval(timerPayment);
                bgPage.control.isPremium = true;
                bgPage.control.waitingPayment = false;
                setPref2('new_check_newtab_premium_disable',true);
                setPref2('new_check_newtab_premium_disable2',true);
                location.href = 'options.html';
            } 
        }
    };
    r.send(null);
}