function shareImage(width,height,text){
    
    removeOtherElements();
    
    setTimeout(function(){
      chrome.tabs.captureVisibleTab(null, {}, function(img){
        image = new Image();
        image.src = img;
        image.onload = function(e){
            var img_new = resizeCrop(e.target,width,height);
            setTimeout(function(){
                addOtherElements();
            },200);
            //chrome.tabs.create({"url":img_new});
            if(getPref('fb_share_ok')){
                fbSharePhoto(text,img_new,false);
            }else{
                bgPage.facebook.login(function(ok){
                    if(ok){
                        fbSharePhoto(text,img_new,true);
                    }
                });
            }
        }
      });
    },200);

}

function fbSharePhoto(text,img_new,firstShare){
    loader(true);
    bgPage.facebook.apiPostPhoto(text,img_new,function(ok){
        loader(false);
        if(ok){
            notify('You have successfully shared your statistic');
            if(firstShare){
                setPref('fb_share_ok',true);
            }
        }else{
            notify('Something went wrong, try it again please');
        }
    });
}

function resizeCrop(src,width,height){
    var canvas = document.createElement("canvas");                  
    canvas.width  = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(src,0,0);
    return canvas.toDataURL("image/jpeg");
}

function showMessage(text){
    var message = $('#hlavni .message');
    message.html(t111(text));
    message.fadeIn(300).delay(4000).fadeOut(300);
}

function removeOtherElements(){
    $('#left,h2,.enable,#fast_select_date,.tooltip,.button_share,.credits,#top_chart_site,.buttons_chart,.special_legend_daysmonths,.special_label_days_months,.busiest_text_help,#premium,#topblock,.topright_get_premium').css('display','none');
    $('html').css('background','#fff');//url('../images/options_bg.png') repeat-y 0 0;
}

function addOtherElements(){
    $('#left,h2,.enable,#fast_select_date,.tooltip,.button_share,.credits,#top_chart_site,.buttons_chart,.special_legend_daysmonths,.special_label_days_months,.busiest_text_help,#premium,#topblock,.topright_get_premium').css('display','block');
    $('html').css('background','#eee url(../images/main-back.png) repeat left center');
}