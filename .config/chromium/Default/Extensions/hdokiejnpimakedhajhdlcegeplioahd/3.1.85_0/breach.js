var autochange=!1;
function breach_onload(){var a=getBG(),b="undefined"!=typeof chrome&&("undefined"!=typeof chrome.runtime||"undefined"!=typeof chrome.extension);kickitoff=function(){var c=a.get_breach_data();document.getElementById("myvaultlink").onclick=function(){a.openvault();return!1};b||(c=JSON.parse(a.g_breach_data));var d=a.g_username;document.getElementById("emailaddr1").innerHTML=a.of(d);var e=[],d="",f;for(f in c)e.push(f),d=c[f].breach_date;if(0==e.length)return!1;"1"==c[e[0]].pwch&&(autochange=!0);set_breach_domain(e);
set_breach_image(e[0],c);set_breach_date(d);f=[];var d=[],g;for(g in c)d[g]=c[g],f[g]=c[g];set_news_articles(c[e[0]]);f=enumerate_sites_by_password_reuse(f);set_reuse_content(d,f);pwchange=function(b){a=getBG();a.editAid(b,window,null,a.g_sites[b].pwch)};document.getElementById("pwchange").onclick=function(){pwchange(c[e[0]].aid);return!1}};b?kickitoff():get_data("breach",function(){kickitoff()})}function set_breach_domain(a){a=hostof(a[0]);class_fill_generic("breached",a)}
function set_breach_image(a,b){"undefined"!==typeof b[a].image_urls&&(document.getElementById("breachlogo").style.width="50px");document.getElementById("breachlogo").src=b[a].image_urls[0]}function set_breach_date(a){class_fill_generic("breachdate",a)}function class_fill_generic(a,b){var c=document.getElementsByClassName(a),d;for(d in c)c[d].innerHTML=b}
function set_news_articles(a){a=a.articles;if("undefined"==typeof a||0==a.length)document.getElementById("inthenews").style.display="none";else for(var b in a){var c=a[b].split("|"),c=article_factory(c[1],c[0]);document.getElementById("media_dummy").appendChild(c)}}function article_factory(a,b){var c=document.createElement("p"),d=document.createElement("a");d.href=a;d.innerHTML=b;c.appendChild(d);return c}
function listitem_factory(a){var b=document.createElement("li");b.innerHTML=a?a:"";return b}function enumerate_sites_by_password_reuse(a){bg=getBG();var b=bg.g_sites,c;for(c in a){var d=issharedfolder(bg.g_shares,a[c].group),e=!1==d?bg.g_local_key:d.sharekey,f;for(f in b)d=issharedfolder(bg.g_shares,b[f].group),d=!1==d?bg.g_local_key:d.sharekey,a[c].aid!==b[f].aid&&bg.lpmdec(a[c].password,!0,e)==bg.lpmdec(b[f].password,!0,d)&&(a[b[f].url]=b[f])}return a}
function hostof(a){var b=document.createElement("a");b.href=a;return b.host}
function set_reuse_content(a,b){var c=!0,d=[],e;for(e in b)if(!(e in a)){var c=!1,f=listitem_factory(hostof(b[e].url)),g=document.createElement("a");g.id=of(b[e].aid);g.onclick=function(a){pwchange(a.currentTarget.id);return!1};g.innerText=of("1"==b[e].pwch?"automatically update password":"update password now");var h=listitem_factory();h.appendChild(g);document.getElementById("reused_list").appendChild(f);d.push(h)}for(e in d)document.getElementById("reused_list").appendChild(d[e]);c&&(document.getElementById("step2box").style.display=
"none")}breach_onload();
