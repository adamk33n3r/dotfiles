function oninitchangepw(){}
function onshowchangepw(){var b=getBG();document.getElementById("changepwtld").innerHTML=g_changepwtld;var e=document.getElementById("changepwsites").contentWindow.document,c='<link rel="stylesheet" type="text/css" href="general.css"><table cellspacing="2" class="stdtext">',a=b.getsites(g_changepwtld,!0),f=[],d;for(d in a)f[f.length]=b.g_sites[d];f.sort(b.lp_sort_case_insensitive_name);for(a=0;a<f.length;a++){d=f[a].aid;var g=of(b.g_sites[d].name),h=of(b.getusernamefromacct(b.g_sites[d]));""!=h&&
(g+=" ("+h+")");c+='<tr><td valign="middle"><input type="checkbox" id="aid'+d+'" name="aid'+d+'"></td><td><label for="aid'+d+'">'+g+"</label></td></tr>"}e.body.innerHTML=c+"</table>"}function onhidechangepw(){}
function dochangepw(){for(var b=getBG(),e=[],c=document.getElementById("changepwsites").contentWindow.document.getElementsByTagName("input"),a=0;a<c.length;a++)"checkbox"==c[a].type&&(c[a].checked&&0==c[a].name.indexOf("aid"))&&(e[e.length]=c[a].name.substring(3));if("function"!=typeof b.checkmultiplefolders||b.checkmultiplefolders(e))b.changePassword(g_changepwnewpw,e),closemole()};
