var g_ischrome="undefined"!=typeof chrome&&("undefined"!=typeof chrome.runtime||"undefined"!=typeof chrome.extension),g_issafari="undefined"!=typeof safari&&"undefined"!=typeof safari.self,g_isopera="undefined"!=typeof opera&&"undefined"!=typeof opera.extension,close_img_src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABYklEQVR42qXTvWrCUBQHcKe+QqfundPFxT0OnTJ0MtChmw/g4NgH6FtkEwoBv8BEA8EYFGswBIIEhFCrU4V26cfp+Qe5RLlKwcAPknty/7mHe1NoNBoy9+yZJWzBcN3J3j0cuGJJt9ul0WhEYRjSfD4nz/Oo0+kQ10J2eSygyL4xcb1eyyAUIV/sWhawHY/HtFqtTvJ9HyGbw4B6r9ejNE3/ZdfOQz4gnkwmtFwuM7VajRRFIcMwyLIs3GNM1HetePmA9yAIKEkSoVqtUrlcBtzv1abTKQJe9wIwGMexgGd8GQ5rvFoEvOUDFtiqKIoEXddJVdWMpml7Ndd1EfCSD3jC3mPPoVKpUKlUItM0AavAmKi3220E1PMBF+zTcRyazWYn9ft9Qsuyc3DLfm3bRs8y2BFM/mFFWQDcsE2r1SKsZjgcZgaDATWbTUxOxSmUBwiPLGEfOzGrH/uZzlIgorP8ASYfyJK1fcokAAAAAElFTkSuQmCC",
x3_img_src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABX0lEQVR42qXTsWrCUBTGcaFroZNTwQfo1KnQN3CQblLIkD2CFIqbaEBQsGAIJBAaCIoQI4JKoeADFDpVmuCsUyE4FJyznJ4vSEjkKgWFH4R7cv/RS8zNZjORO/bMXDZkT+xWdO/hwtV+E02n0wxeg1d2eSxQYD+TyYRc1xXiGSIblhcFPnGT4zgnjUYjRBaHgaLneWSa5r+Mx2NE7tOBvmVZ1O12Y8vlkqIoovl8ToPBANdYS+a2bSPwkg58YNBsNhNBENB2uwVcZ2a9Xg+Bt0yg1WpRrVZLNBoNPBlwnZm1220E3tOBIQKKoiRWqxWFYRhbr9eZWafTQcBIBx4NwyBZlmO+79Nut8OTAd8Ca8kc54WDTwcu2He9XqdyuXySqqqEnyx6D27YLyKlUkkEB4jNISuIAnDNFpqmUaVSIUmSYtVqlXRdx2Z88uJXOeuBuexrr8+Kx/5MZ8kR0Vn+AGczfuZVuZDxAAAAAElFTkSuQmCC",
g_searchfillbox=null,g_searchloginbox=null,pass=!0;addStyle(!0);
function load(){if(0<document.location.href.indexOf("&add=1"))document.body.style.background=get_notification_add_bg();else if(0<document.location.href.indexOf("&error=1"))document.body.style.background=get_notification_error_bg();else if(0<document.location.href.indexOf("&context="))document.body.style.backgroundColor="#E8EDF9",document.body.style.margin="0px";else{if(0<document.location.href.indexOf("&cpwbot")){var a=document.location.href.indexOf("&symbolic=")+10,a=document.location.href.substr(a),
a=decodeURIComponent(a),b=document.location.href.indexOf("&cpwbot=")+8,c=document.location.href.indexOf("&symbolic=")-b,b=document.location.href.substr(b,c),b=decodeURIComponent(b);display_cpw_message_loop(document,b,a);return}document.body.style.background=get_notification_bg()}document.body.style.backgroundRepeat="repeat-x";g_ischrome?chrome_runtime_sendMessage({cmd:"getnotificationdata"},function(a){document.body.innerHTML=a.html;stylize_tags();setup_extra(a.extra);setup_event_handlers();initialize_sorttable()}):
"undefined"!=typeof safari?(safari.self.removeEventListener("message",handleMessage,!1),safari.self.addEventListener("message",handleMessage,!1),safari.self.tab.dispatchMessage("getnotificationdata",{})):g_isfirefoxsdk&&(window.addEventListener("message",handleMessage,!1),window.parent.postMessage({messagetype:"getnotificationdata"},"*"))}
function handleMessage(a){if(g_isopera||g_isfirefoxsdk)a.message=a.data,a.name=a.data.messagetype;if(("gotnotificationdata"==a.name||"gotnotificationdata"==a.message.cmd)&&setup_extra(a.message.extra))document.body.innerHTML=a.message.html,stylize_tags(),setup_event_handlers(),initialize_sorttable();("gotcpwmsg"==a.name||"gotcpwmsg"==a.message.cmd)&&a.message.msg&&display_cpw_message(document,a.message.msg)}
function setup_extra(a){a=LPJSON.parse(a);return-1!=document.location.href.indexOf("&"+a.type+"=")?(document_location_href=a.document_location_href,g_fillaid=a.g_fillaid,from=a.from,data={},"undefined"!=typeof a.notificationdata&&(data.notificationdata=a.notificationdata),!0):!1}
function setup_event_handlers(){for(var a=1;3>=a;a++)for(var b=document.getElementsByTagName(1==a?"img":2==a?"button":"tr"),c=0;c<b.length;c++)if(b[c].id)if("lpaddcreditcard"==b[c].id)b[c].addEventListener("click",function(){addcc()});else if("lpaddprofile"==b[c].id)b[c].addEventListener("click",function(){addprofile()});else if("lpaddsite"==b[c].id)b[c].addEventListener("click",function(){savethesite(utf8_to_b64(data.notificationdata))});else if("lpautofill"==b[c].id){var d=b[c].getAttribute("lptype");
d&&"autofillsingle"==d?b[c].addEventListener("click",function(){autofill(this.getAttribute("aid"))}):b[c].addEventListener("click",function(){clear_searchbox("autofill");showmenu("autofill")})}else 0==b[c].id.indexOf("lpautofill")?b[c].addEventListener("click",function(){autofill(this.id.substring(10))}):"lpautologin"==b[c].id?(d=b[c].getAttribute("lptype"))&&"autologinsingle"==d?b[c].addEventListener("click",function(){autologin(this.getAttribute("aid"))}):b[c].addEventListener("click",function(){clear_searchbox("autologin");
showmenu("autologin")}):0==b[c].id.indexOf("lpautologin")?b[c].addEventListener("click",function(){autologin(this.id.substring(11))}):"lpbasicauthmoreinfobtn"==b[c].id?b[c].addEventListener("click",function(){genericaction("basicauthmoreinfobtn",utf8_to_b64(LPJSON.stringify(data.notificationdata)))}):"lpbasicauthneverbtn"==b[c].id?b[c].addEventListener("click",function(){genericaction("basicauthneverbtn",utf8_to_b64(LPJSON.stringify(data.notificationdata)))}):"lpchooseprofilecc"==b[c].id?b[c].addEventListener("click",
function(){chooseprofilecc()}):"lpclearforms"==b[c].id?b[c].addEventListener("click",function(){clearforms()}):"lpconfirm"==b[c].id?b[c].addEventListener("click",function(){changepw(utf8_to_b64(LPJSON.stringify(data.notificationdata)))}):"lpcreateaccountbtn"==b[c].id?b[c].addEventListener("click",function(){genericaction("createaccountbtn",utf8_to_b64(LPJSON.stringify(data.notificationdata)))}):"lpdisablebtn"==b[c].id?b[c].addEventListener("click",function(){genericaction("disablebtn",utf8_to_b64(LPJSON.stringify(data.notificationdata)))}):
"lpfeedbackbtn"==b[c].id?b[c].addEventListener("click",function(){genericaction("feedbackbtn",utf8_to_b64(LPJSON.stringify(data.notificationdata)))}):"lpfillcurrent"==b[c].id?b[c].addEventListener("click",function(){showmenu("fillcurrent")}):0==b[c].id.indexOf("lpfillcurrent")?b[c].addEventListener("click",function(){fillcurrent(this.id.substring(13))}):"lpfillform"==b[c].id?b[c].addEventListener("click",function(){showmenu("fillform")}):0==b[c].id.indexOf("lpfillform")?b[c].addEventListener("click",
function(){fillform(this.id.substring(10))}):"lpgenerate"==b[c].id?b[c].addEventListener("click",function(){generate()}):"lphideoverlay"==b[c].id?(b[c].addEventListener("mouseover",function(){this.src=x3_img_src}),b[c].addEventListener("mouseout",function(){this.src=close_img_src}),b[c].addEventListener("click",function(){hideoverlay()})):"lpnever"==b[c].id?b[c].addEventListener("click",function(){showmenu("never")}):"lpneverautofill"==b[c].id?b[c].addEventListener("click",function(){never("neverautofill",
btoa(document_location_href),g_fillaid,from)}):"lpneverdomain"==b[c].id?b[c].addEventListener("click",function(){never("neverdomain",btoa(document_location_href),g_fillaid,from)}):"lpneverpage"==b[c].id?b[c].addEventListener("click",function(){never("neverpage",btoa(document_location_href),g_fillaid,from)}):"lpnotnow"==b[c].id?b[c].addEventListener("click",function(){notnow(utf8_to_b64(data.notificationdata),btoa(lp_gettld_url(document_location_href)))}):"lpsavenewsite"==b[c].id?b[c].addEventListener("click",
function(){savethesite(utf8_to_b64(LPJSON.stringify(data.notificationdata)))}):"lptryagainbtn"==b[c].id?b[c].addEventListener("click",function(){genericaction("tryagainbtn",utf8_to_b64(LPJSON.stringify(data.notificationdata)))}):"lpcustombtn"==b[c].id?b[c].addEventListener("click",function(){genericaction("custombtn",utf8_to_b64(LPJSON.stringify(data.notificationdata)))}):"autofilltabsearchboxreset"==b[c].id?(b[c].addEventListener("click",function(){clear_searchbox("autofill")}),b[c].src=x3_img_src):
"autologintabsearchboxreset"==b[c].id&&(b[c].addEventListener("click",function(){clear_searchbox("autologin")}),b[c].src=x3_img_src);g_searchfillbox=document.getElementById("autofilltabsearchbox");null!=g_searchfillbox&&g_searchfillbox.addEventListener("keyup",function(){dofilter("autofill")},!1);g_searchloginbox=document.getElementById("autologintabsearchbox");null!=g_searchloginbox&&g_searchloginbox.addEventListener("keyup",function(){dofilter("autologin")},!1)}
function clear_searchbox(a){var b;if("autofill"==a)b=g_searchfillbox;else if("autologin"==a)b=g_searchloginbox;else return;if(null!=b){b.value="";for(var c=document.getElementsByTagName("tr"),d=0;d<c.length;d++){var e=c[d].id;0==e.indexOf("lp"+a)&&(e=document.getElementById(e),"table-row"!=e.style.display&&(e.style.display="table-row"))}a=document.getElementById(a+"footer");null!=a&&(a.className="lppopupsearchbox");b.focus()}}
function sendRequest(a){g_ischrome?chrome_runtime_sendMessage(a,function(){}):g_issafari?safari.self.tab.dispatchMessage(a.cmd,a):g_isfirefoxsdk&&(a.messagetype=a.cmd,window.parent.postMessage(a,"*"))}function hideoverlay(){sendRequest({cmd:"hideoverlay"})}var g_firstmenu=!0;
function showmenu(a){!g_firstmenu&&document.getElementById("lppopup"+a)&&"none"!=document.getElementById("lppopup"+a).style.display?(hideMenus(),sendRequest({cmd:"slideupoverlay"})):(g_firstmenu=!0,hideMenus(),sendRequest({cmd:"slidedownoverlay"}),lpshowmenudiv(a))}function autofill(a){sendRequest({cmd:"autofillaid",aid:a});hideMenus();slideup()}function autologin(a){sendRequest({cmd:"autologinaid",aid:a});hideMenus();slideup()}
function fillcurrent(a){sendRequest({cmd:"fillcurrentaid",aid:a});hideMenus();slideup()}function fillform(a){sendRequest({cmd:"fillformffid",ffid:a});hideMenus();slideup()}function addprofile(){sendRequest({cmd:"addprofile"});hideMenus();hidecontext()}function addcc(){sendRequest({cmd:"addcreditcard"});hideMenus();hidecontext()}function clearforms(){sendRequest({cmd:"clearforms"});hideMenus();hidecontext()}
function never(a,b,c,d){var e=1==d?1:0,f=2==d?1:0;d=3==d?1:0;sendRequest({action:"never",cmd:a,url:atob(b),aid:c,fromsave:e,fromgenerate:f,fromformfill:d});sendRequest({cmd:"hideoverlay"})}function notnow(a,b){sendRequest({cmd:"notnow",notificationdata:b64_to_utf8(a),tld:atob(b)});sendRequest({cmd:"hideoverlay"})}function savethesite(a){sendRequest({cmd:"savethesite",notificationdata:b64_to_utf8(a)});sendRequest({cmd:"hideoverlay"})}
function changepw(a){sendRequest({cmd:"changepw",notificationdata:b64_to_utf8(a)});sendRequest({cmd:"hideoverlay"})}function genericaction(a,b){sendRequest({cmd:a,notificationdata:b64_to_utf8(b)});sendRequest({cmd:"hideoverlay"})}
function generate(){sendRequest({cmd:"generate"});document.getElementById("lastpass-notification")&&(!document.getElementById("lppopupfillform")&&!document.getElementById("lppopupfillcurrent"))&&(document.getElementById("lastpass-notification").style.display="none");hidecontext()}function chooseprofilecc(){sendRequest({cmd:"chooseprofilecc"});sendRequest({cmd:"hideoverlay"});hidecontext()}function slideup(){sendRequest({cmd:"slideupoverlay"})}
function hideMenus(){document.getElementById("lppopupautofill")&&(document.getElementById("lppopupautofill").style.display="none");document.getElementById("lppopupautologin")&&(document.getElementById("lppopupautologin").style.display="none");document.getElementById("lppopupnever")&&(document.getElementById("lppopupnever").style.display="none");document.getElementById("lppopupfillform")&&(document.getElementById("lppopupfillform").style.display="none");document.getElementById("lppopupfillcurrent")&&
(document.getElementById("lppopupfillcurrent").style.display="none")}function copyusername(a){sendRequest({cmd:"copyusername",aid:a});hidecontext()}function copypassword(a){sendRequest({cmd:"copypassword",aid:a});hidecontext()}function copyurl(a){sendRequest({cmd:"copyurl",aid:a});hidecontext()}function recheckpage(a){sendRequest({cmd:"recheckpagecontext",aid:a});hidecontext()}var g_context=null,g_ffid=null;
function showcontext(a,b){g_context=a;document.getElementById("contextmain").style.display="none";3>a?document.getElementById("contextsub").style.display="block":3==a?document.getElementById("contextff").style.display="block":5==a?document.getElementById("contextsub").style.display="block":4==a&&(document.getElementById("contextffsub").style.display="block",g_ffid=b)}
function docontextaction(a){0==g_context?autofill(a):1==g_context?copyusername(a):2==g_context?copypassword(a):5==g_context&&copyurl(a);hidecontext()}function ffsub(a){0==a?sendRequest({cmd:"fillformffid",ffid:g_ffid}):1==a&&sendRequest({cmd:"editprofile",ffid:g_ffid});hidecontext()}function hidecontext(){sendRequest({cmd:"hidecontext"})}
document.addEventListener("click",function(a){var b="autologintab autologintabfooter autologintabheader autologintabsearchlabel autofilltab autofilltabfooter autofilltabheader autofilltabsearchlabel sorttable_sortrevind sorttable_sortfwdind".split(" "),c=null,d=null;"undefined"!=typeof a.target&&(c=a.target.id,"undefined"!=typeof a.target.parentElement&&null!=a.target.parentElement&&(d=a.target.parentElement.id));var e=!1,f;for(f in b){if(null!=c&&c==b[f]){e=!0;break}if(null!=d&&d==b[f]){e=!0;break}}!e&&
"BUTTON"!=a.target.nodeName&&(hideMenus(),sendRequest({cmd:"slideupoverlay"}))},!1);var g_lastsize=-1;window.onresize=function(){g_lastsize>document.body.clientHeight&&hideMenus();g_lastsize=document.body.clientHeight};document.addEventListener("DOMContentLoaded",function(){window.addEventListener("load",function(){load()})});
function dofilter(a){var b;if("autofill"==a)b=g_searchfillbox;else if("autologin"==a)b=g_searchloginbox;else return;null!=b&&(a=document.getElementById(a+"tab"),b=b.value.toLowerCase(),sorttable.filter(a,b))}
function initialize_sorttable(){sorttable.init();var a=document.getElementById("autofilltab");null!=a&&sorttable.initial_sort(a.tHead.rows[0].cells[2]);a=document.getElementById("autologintab");null!=a&&sorttable.initial_sort(a.tHead.rows[0].cells[2]);g_searchfillbox=document.getElementById("autofilltabsearchbox");g_searchloginbox=document.getElementById("autologintabsearchbox")}function utf8_to_b64(a){return window.btoa(unescape(encodeURIComponent(a)))}
function b64_to_utf8(a){return decodeURIComponent(escape(window.atob(a)))}function stylize_tags(){if(g_ischrome)for(var a=["img","div","th","tr","td"],b=0;b<a.length;b++)for(var c=document.getElementsByTagName(a[b]),d=0;d<c.length;d++)c[d].getAttribute("data-lpstyle")&&(c[d].style.cssText=c[d].getAttribute("data-lpstyle"))};
