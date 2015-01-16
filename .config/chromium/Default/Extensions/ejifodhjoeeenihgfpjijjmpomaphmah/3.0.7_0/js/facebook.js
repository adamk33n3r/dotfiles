var facebook = {
    apiUrl: 'https://graph.facebook.com/',
    clientId: '414751001975176',
    clientSecret: '36c3839e1ae3682783ead8a89bd872ae',
    token: undefined,
    loginTabId: undefined,
    init: function(){
        this.token = wips.getPref('facebook_token');
        if(this.token && this.token!=''){
            this.checkTokenActive();
        }else{
            this.logout();
        }
    },
    login: function(callback){
        var url = this.apiUrl + "oauth/authorize?client_id=" + this.clientId + "&redirect_uri=https://wips.com/&type=user_agent&display=page&scope=publish_stream";
    		chrome.tabs.getSelected(null,function(tab){
            chrome.tabs.create({
                url: url,
                index: tab.index
            },function(tab){
                facebook.loginTabId = tab.id;
                setTimeout(function(){
                    facebook.checkTokenUrl(function(ok){ if(ok) callback(true); });
                },1000);
            });
        });
    },
    checkTokenUrl: function(callback){
        chrome.tabs.get(this.loginTabId, function(tab){
          if(tab){
            try{
                facebook.token = tab.url.split('access_token=')[1].split('&')[0];
                wips.setPref('facebook_token',facebook.token);
                chrome.tabs.remove(tab.id, function(){});
                setTimeout(function(){
                    facebook.refreshToken();
                },5000);
                callback(true);
            }catch(e){
                setTimeout(function(){
                    facebook.checkTokenUrl(function(ok){ if(ok) callback(true); });
                },1000);
            };
          }
        });
    },
    logout: function(){
        this.token = undefined;
        wips.setPref('facebook_token','');
    },
    checkTokenActive: function(callback){
        var url = this.apiUrl + 'me?locale=' + translate('locale_fb') + '&access_token=' + this.token;
        var r = new XMLHttpRequest();
        r.open("GET", url, true);
        r.onreadystatechange = function (){
            if(r.readyState == 4){
                // token ok
                if(r.status == 200){
                    setTimeout(function(){
                        facebook.refreshToken();
                    },5000);
                    var out = JSON.parse(r.responseText);
                    //wips.setPref('my_user_id',out.id);
                // neplatny token
                }else if(r.status == 400){
                    facebook.login();
                // ostatni chyby
                }else{
                    facebook.logout();
                }
            }
        };                        
        r.send(null);
    },
    //univ share
    apiPostText: function(message,callback){
        var url = this.apiUrl + 'me/feed';
        var r = new XMLHttpRequest();
        r.open("POST", url, true);
        r.onreadystatechange = function (){
            if(r.readyState == 4){
                if(r.status == 200){
                    callback(true);
                }else{
                    callback(false);
                }
            }
        };
        var data = 'access_token=' + this.token;
        if(message){
            data += '&message=' + message + '&link=http://bit.ly/timeStats_extension';
        }
        r.send(data);
    },
    apiPostPhoto: function(message,img,callback){
        if(message){
            message += '\n';
        }else{
            message = '';
        }
        var imageData = img.split('base64,')[1];
        var blob = dataURItoBlob(imageData,'image/png');
        var fd = new FormData();
        fd.append("access_token",this.token);
        fd.append("source", blob);
        fd.append("message",message+'http://bit.ly/timeStats_extension');
        $.ajax({
            url:"https://graph.facebook.com/me/photos?access_token=" + this.token,
            type:"POST",
            data:fd,
            processData:false,
            contentType:false,
            cache:false,
            success:function(data){
                callback(true);
            },
            error:function(shr,status,data){
                callback(false);
            },
            complete:function(){
            }
        });
        function dataURItoBlob(dataURI,mime){
            var byteString = window.atob(dataURI);
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            var blob = new Blob([ia], { type: mime });
            return blob;
        }
    },
    //special fce for timestats!
    apiShareUrl: function(callback){
        var url = this.apiUrl + 'me/feed';
        var r = new XMLHttpRequest();
        r.open("POST", url, true);
        r.onreadystatechange = function (){
            if(r.status == 200 && r.readyState == 4){
                wips.setPref('fb_share_ok',true);
                callback();
            }
        };
        var data = 'access_token=' + this.token + '&message=Do you want to track your time on the internet? Try this #chrome extension&link=http://bit.ly/timeStats_extension';
        r.send(data);
    },
    refreshToken: function(){
        var url = this.apiUrl + 'oauth/access_token?client_id=' + this.clientId + '&client_secret=' + this.clientSecret + '&grant_type=fb_exchange_token&fb_exchange_token=' + this.token;
        var r = new XMLHttpRequest();
        r.open("GET", url, true);
        r.onreadystatechange = function (){
            if(r.readyState == 4 && r.status == 200){
                facebook.token = r.responseText.split('access_token=')[1].split('&expires=')[0];
                wips.setPref('facebook_token',facebook.token);
            }
        };                        
        r.send(null);
    }
}