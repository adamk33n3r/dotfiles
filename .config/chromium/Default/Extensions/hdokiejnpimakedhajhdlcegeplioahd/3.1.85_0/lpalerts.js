var g_alert_set=0;
function rich_notification(a){var c=a.richtitle?a.richtitle:a.title,b=a.richiconurl,f=a.richtextbtn,d=a.richonclickurl,e=a.richtext;a=a.richinapp;handle_notification_click=function(a,b){1!=b&&0==g_alert_set&&(g_alert_set=1,openURL(d),setTimeout(function(){g_alert_set=0},1E3))};g_ischrome?(c={type:"basic",title:c,message:e,iconUrl:b,priority:2,buttons:[{title:f},{title:"Dismiss"}]},chrome.notifications.create("rich"+Math.random(),c,function(){chrome.notifications.onButtonClicked.addListener(handle_notification_click)})):(g_alert_set=
1,b=d,a&&(b=safari.extension.baseURI+b),handlenotifications(c,e,b))}function handle_new_alerts(a){a=JSON.parse(a.response);!0==a.rich&&rich_notification(a);!0==a.toolbar&&(g_notification_data={data:a},g_notification_type="lpalert",sendTS({cmd:"notification",type:"lpalert"}))}function get_alert(){lpMakeRequest(base_url+"alert.php","alert=1",handle_new_alerts,null)};
