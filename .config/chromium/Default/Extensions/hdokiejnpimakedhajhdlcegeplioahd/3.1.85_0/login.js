var reprompt_callback=null,reprompt_error_callback=null;g_fixpbkdf2=!0;var login_submitted=!1,fromcs=!1;
function do_submit(){if(login_submitted)return!1;var a=!1;-1!=window.location.search.indexOf("?securereprompt=1")&&window.location.search.indexOf("aid="!=-1)&&(a=!0);login_submitted=!0;var b=fix_username(document.getElementById("u").value),c=document.getElementById("p").value;document.getElementById("p").value="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";var d=get_key_iterations(b);!1==a?getBG().make_lp_key_hash_iterations(b,c,d,function(a,d){document.getElementById("p").blur();
if(null!=reprompt_callback){var f=getBG();if(a==f.g_local_key){var g=0;document.getElementById("donotrepromptfor").checked&&(g=document.getElementById("donotrepromptforsecs").value);f.lpPutUserPref("reprompttime",g);f.lpWriteAllPrefs();f.set_last_reprompt_time();reprompt_error_callback=null;f.select_selectedtabid();reprompt_callback();setTimeout(function(){window.close()},0)}else alert(gs("Invalid Password.")),setTimeout(function(){closePop()},0)}else(f=getBG())?(document.getElementById("rememberpassword").checked||
(document.getElementById("p").value=""),f.g_manual_login=!0,f.LP_do_login(b,c,document.getElementById("rememberemail").checked,document.getElementById("rememberpassword").checked,null,document.getElementById("showvault").checked,a,d),reprompt_error_callback=null,c="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",setTimeout(function(){closePop()},0)):alert(gs("Can't find hidden LastPass window"))}):getBG().make_lp_key_hash_iterations(b,
c,d,function(a,b){secure_reprompt_callback(b)});return!1}var passwords=[];
function load(a){try{var b="undefined"!=typeof chrome&&("undefined"!=typeof chrome.runtime||"undefined"!=typeof chrome.extension);if(!b&&!a&&("undefined"==typeof safari||"undefined"==typeof safari.extension.globalPage))get_data("login",function(){load(!0)});else{if(b){var c=window.getComputedStyle(document.body,null);100>parseInt(c.width)&&(document.body.style.minWidth="810px",document.body.style.minHeight="333px")}document.getElementById("screenkeyboard")&&(document.getElementById("screenkeyboard").title=
gs("Screen Keyboard"));getBG().LPISLOC&&(document.getElementById("forgotcontainer").style.display=document.getElementById("screenkeyboardcontainer").style.display=document.getElementById("createaccountcontainer").style.display="none");getBG().g_hidecreate&&(document.getElementById("createaccountcontainer").style.display="none");if(getBG().g_hidevault||getBG().g_hideshowvault)document.getElementById("showvaultrow").style.display="none";getBG().g_hidescreenkeyboard&&(document.getElementById("screenkeyboardcontainer").style.display=
"none");var d=getBG();can_chrome_do_math()||d.openURL(getchromeurl("mathfail.html"));if(null!=d.g_reprompt_callback){reprompt_callback=d.g_reprompt_callback;d.g_reprompt_callback=null;reprompt_error_callback=d.g_reprompt_error_callback;d.g_reprompt_error_callback=null;document.getElementById("reprompttext").style.display="block";document.getElementById("deleteicon").style.display="none";document.getElementById("rememberemailrow").style.display="none";document.getElementById("rememberpasswordrow").style.display=
"none";document.getElementById("showvaultrow").style.display="none";document.getElementById("donotrepromptforrow").style.display="block";document.getElementById("screenkeyboardcontainer").style.display="none";document.getElementById("forgotcontainer").style.display="none";document.getElementById("u").value=d.g_username;document.getElementById("u").disabled=!0;var e=d.lpGetPref("reprompttime",0);document.getElementById("donotrepromptfor").checked=0<e;document.getElementById("donotrepromptforsecs").value=
e;setTimeout(function(){document.getElementById("p").focus()},100);document.getElementById("links").style.display="none";getBG().can_allow_reprompt_skip()||(document.getElementById("donotrepromptfor").checked=!1,document.getElementById("donotrepromptfor").disabled=!0,document.getElementById("donotrepromptforsecs").disabled=!0);document.getElementById("logintitletxt").innerHTML="";setTimeout(function(){document.getElementById("p").focus()},150);0<window.location.search.indexOf("fromcs=1")&&(fromcs=
!0);var m=getBG().g_cached_hash;null!==m&&0<document.location.href.indexOf("securereprompt=1")&&(document.getElementById("p").value="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",secure_reprompt_callback(m))}else{var f=d.lpGetPref("rememberemail",1),g=d.lpGetPref("rememberpassword",-1),p=d.lpGetPref("showvault",-1);document.getElementById("rememberemail").checked=1==f?!0:!1;document.getElementById("rememberpassword").checked=1==g?!0:!1;document.getElementById("showvault").checked=
1==p?!0:!1;getBG().g_hidescreenkeyboard&&(document.getElementById("screenkeyboardcontainer").style.display="none");getBG().g_db_transaction_tested=getBG().g_db_transaction_worked=!1;populate_usernames()}}}catch(h){console_log(h.message)}}window.addEventListener("keydown",function(a){handle_keydown(a)},!1);
function populate_usernames(){getBG().get_saved_logins(function(a){for(var b=[],c=0;c<a.length;c++)b[c]=a[c].username,passwords[b[c]]=a[c].password,1==a[c]["protected"]?function(a,b){getBG().unprotect_data(b,!1,function(c){passwords[a]=c;document.getElementById("p").value==b&&(document.getElementById("p").value=c)})}(b[c],passwords[b[c]]):2==a[c]["protected"]&&(passwords[b[c]]=lpdec(passwords[b[c]],AES.hex2bin(SHA256(b[c]))));b.sort(function(a,b){return a.toLowerCase()<b.toLowerCase()?-1:1});create_combo("u",
b,!0,document,"","deleteicon",-35,g_isfirefoxsdk?6:-2);b="";c=document.location.href.indexOf("sesameusername=");-1!=c&&(b=document.location.href.substr(c+15),c=b.indexOf("&"),-1!=c&&(b=b.substring(0,c)),b=decodeURIComponent(b));0<a.length||""!=b?(a=""!=b?b:a[0].username,b="undefined"!=typeof passwords[a]?passwords[a]:"",document.getElementById("u").value=a,document.getElementById("p").focus(),""!=b&&(document.getElementById("p").value=b,-1==rememberpassword&&(document.getElementById("rememberpassword").checked=
!0),document.getElementById("login").focus())):document.getElementById("u").focus();g_ischrome&&(-1!=navigator.userAgent.indexOf("Chrome/4")||-1!=navigator.userAgent.indexOf("Chrome/5"))&&setTimeout(function(){test_db_failed(1)},5E3)})}function handle_keydown(a){if(68==(0!=a.keyCode?a.keyCode:a.charCode)&&a.ctrlKey)document.body.innerHTML="<pre>"+getBG().g_console_log+"</pre>",a.cancelBubble=!0,a.preventDefault(),a.stopPropagation()}
function test_db_failed(a){L("test_db_failed timeout: "+a);getBG().g_db_transaction_tested=!0;getBG().g_db_transaction_worked||(document.getElementById("u").focus(),create_combo("u",[],!0,document,"","deleteicon",-35,g_isfirefoxsdk?6:-2))}
function username_changed(){var a=document.getElementById("u").value;"undefined"!=typeof passwords[a]&&""!=passwords[a]?(document.getElementById("p").value=passwords[a],document.getElementById("rememberpassword").checked=!0):(document.getElementById("p").value="",document.getElementById("rememberpassword").checked=!1)}
function delete_user(){var a=document.getElementById("u").value;getBG().delete_saved_login(a);delete passwords[a];delete_combo_item("u",a);document.getElementById("u").value="";for(var b in passwords){document.getElementById("u").value=b;break}username_changed()}function retsubmit(a){return 13==a.keyCode?(do_submit(),!1):!0}function glow(a){a.className+=" glow"}function dim(a){a.className=a.className.replace(/\bglow\b/,"")}
function closePop(){"undefined"!=typeof chrome&&("undefined"!=typeof chrome.runtime||"undefined"!=typeof chrome.extension)&&parent?-1!=document.location.href.indexOf("login.html")&&-1==document.location.search.indexOf("inline")?getBG().closecurrenttab("login.html"):parent.window_close():g_ismaxthon?(window.close(),setTimeout(function(){window.external.mxGetRuntime().getActionByName("lppanel").hide()},0)):g_isfirefoxsdk?(getBG().closecurrenttab("login.html"),dispatch_message("closepop",{})):"undefined"!=
typeof getBG().closePop?getBG().closePop():window.close()}function oninitlogin(){}function onshowlogin(){parent.body&&(parent.body.style.margin="0px");-1==location.search.indexOf("foo")&&(location.href="lp_toolstrip.html?browseraction=1&foo")}function onhidelogin(){parent.body&&(parent.body.style.margin="8px")}
function secure_reprompt_callback(a){process_response=function(b){if(4==b.readyState&&200==b.status){var c=JSON.parse(b.response);if(1!==c.success)reprompt_callback();else{b=0;document.getElementById("donotrepromptfor").checked&&(b=document.getElementById("donotrepromptforsecs").value);var d=c.secret,e=c.save_all,h=c.aid,c=c.fields,j=get_record(h,!0);secure_reprompt_cached_acct=[];for(var k in j)secure_reprompt_cached_acct[k]=j[k];!0==e&&(secure_reprompt_cached_acct.save_all=!0);for(var n in c){k=
c[n][0];var e=c[n][1],l;for(l in j.fields)secure_reprompt_cached_acct.fields[l].name==k&&(secure_reprompt_cached_acct.fields[l].value=e)}"http://sn"==j.url?secure_reprompt_cached_acct.extra=d:secure_reprompt_cached_acct.password=d;getBG().SecureReprompter.add_secret(h,secure_reprompt_cached_acct,b,a);fromcs?reprompt_callback(d):reprompt_callback()}setTimeout(function(){window.close()},0)}};var b=window.location.search.slice(1),c=b.split("&"),d=null,e;for(e in c)if(0==c[e].indexOf("aid=")){d=c[e].split("=")[1];
break}c=get_record(d);typeof c.sharefolderid&&c.sharefolderid&&(b+="&sharedfolderid="+encodeURIComponent(c.sharefolderid));getBG().lpMakeRequest(base_url+"secure_reprompt.php","hash="+encodeURIComponent(a)+"&"+b,process_response,null)};
