var g_current_version=0;function onLoad(a){if(a){a=document.location.href.indexOf("?searchstr=");if(-1!=a){a=document.location.href.substring(a+11);var b=a.indexOf("&");-1!=b&&(a=a.substring(0,b));document.getElementById("searchbox").value=decodeURIComponent(a)}populate();document.getElementById("searchbox").focus();window.addEventListener("keydown",function(a){handle_keydown(a)},!1);setTimeout(function(){checkVersion()},500)}else get_data("vault",function(){onLoad(!0)})}
function onResize(){document.getElementById("gridsite")&&(document.getElementById("gridsite").style.height=document.body.clientHeight-document.getElementById("gridsite").offsetTop+"px")}var g_selectedrow=-1,g_searchhasfocus=!1;
function handle_keydown(a){a=0!=a.keyCode?a.keyCode:a.charCode;40==a||38==a?(a=40==a?g_selectedrow+1:-1==g_selectedrow?g_ids.length:g_selectedrow-1,a+1>g_ids.length||0>a||(-1!=g_selectedrow&&(document.getElementById("site"+g_ids[g_selectedrow]).className="site"),g_selectedrow=a,document.getElementById("site"+g_ids[g_selectedrow]).className="site focus")):13==a&&-1!=g_selectedrow&&ls(g_ids[g_selectedrow])}
function clearkeyboardnav(){-1!=g_selectedrow&&(document.getElementById("site"+g_ids[g_selectedrow]).className="site",g_selectedrow=-1)}var g_ids=[],g_lastsearch=null;
function populate(){var a=getBG(),b=document.getElementById("searchbox").value.toLowerCase();g_lastsearch=b;var e=a.g_prompts.edit_sn_prompt?!1:a.get_searchNotesPref(),b=search_results(b,e,"gridsite");"undefined"!==typeof b&&b.sort(a.lp_sort_case_insensitive_name);s=[];g_ids=[];g_selectedrow=-1;event_handlers={};for(var c in b)g_ids.push(get_record_id(b[c])),s.push(getsitehtml(b,c));s.push('<div id="gridclear" class="clear"/>');document.getElementById("gridsite").innerHTML=s.join("");for(c in event_handlers)document.getElementById(c).onclick=
event_handlers[c];s=null;document.getElementById("gridsite").style.height=document.body.clientHeight-document.getElementById("gridsite").offsetTop+"px";g_current_version=a.g_local_accts_version}function checkVersion(a){(g_issafari||g_isopera||g_ismaxthon||g_isfirefoxsdk)&&!a?getBG().update_state("search"):(a=getBG(),(!a.lploggedin||g_current_version!=a.g_local_accts_version)&&populate(),setTimeout(function(){checkVersion()},500))}function search_go(){populate()}
function search_clear(){document.getElementById("searchbox").value="";populate()}function sp(a,b,e){if(a.innerHTML==gs("Show")){var c=getBG(),d=get_record(b);null!=d.sharedfromaid&&""!=d.sharedfromaid&&"0"!=d.sharedfromaid&&"null"!=d.sharedfromaid?alert(gs("This is a shared site. You are not permitted to view the password.")):!e&&(d.pwprotect||c.g_prompts.view_pw_prompt)?c.security_prompt(function(){sp(a,b,!0)}):set_innertext(a,c.getpasswordfromacct(get_record(b)))}else a.innerHTML=gs("Show")}
function os(a){getBG().editAid(a,window);return!1}function ds(a){getBG().deleteAid(a,window);return!1}function ls(a){getBG().launch(a);setTimeout(function(){window_close("home.html")},0);return!1}function search_keyup(a){a=a.charCode?a.charCode:a.keyCode?a.keyCode:a.which?a.which:0;var b=document.getElementById("searchbox").value;g_searchhasfocus&&(40!=a&&38!=a&&13!=a&&2<b.length)&&populate()}var MAX_GROUPNAME_LEN=80,MAX_SITENAME_LEN=30,MAX_SITEUSERNAME_LEN=15;
function getsitehtml(a,b){id=get_record_id(a[b]);name=trunc(a[b].name,MAX_SITENAME_LEN);username="undefined"!=typeof a[b].unencryptedUsername?trunc(a[b].unencryptedUsername,MAX_SITEUSERNAME_LEN):"";event_handlers["launch"+id]=function(){return ls(this.id.substring(6))};event_handlers["show"+id]=function(){return sp(this,this.id.substring(4))};event_handlers["edit"+id]=function(){return os(this.id.substring(4))};event_handlers["delete"+id]=function(){return ds(this.id.substring(6))};return'<div class="site" id="site'+
id+'"><div class="border"><div class="sitename"><span class="content">'+sprite_gethtmlfromrecord(a[b])+'<a target="_blank" href="#" id="launch'+id+'">'+name+'</a></span></div><div class="siteusername"><span class="content">'+username+'</span></div><div class="sitepassword"><span class="content"><a href="#" id="show'+id+'">'+gs("Show")+'</a></span></div><div class="sitefavorite"><span class="content">'+("1"==a[b].fav?'<img src="images/icon_favorite.png"/>':"")+'</span></div><div class="sitenote"><span class="content">'+
(""!=a[b].extra?'<img src="images/icon_note.png"/>':"")+'</span></div><div class="siteprotected"><span class="content">'+(a[b].pwprotect?'<img src="images/icon_protected.png"/>':"")+'</span></div><div class="siteautologin"><span class="content">'+(a[b].autologin?'<img src="images/icon_autologin.png"/>':"")+'</span></div><div class="siteaction"><a href="#" id="edit'+id+'">'+gs("Edit")+'</a><span>|</span><a id="delete'+id+'" href="#">'+gs("Delete")+"</a>&nbsp;&nbsp;&nbsp;</div></div></div>"}
function sprite_gethtmlfromrecord(a){return getBG().geticonhtmlfromrecord(a)}function trunc(a,b){return a.length<=b?of(a):of(a.substr(0,b))+"..."};
