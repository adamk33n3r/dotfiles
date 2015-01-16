var bgPage = chrome.extension.getBackgroundPage(), timer;
var restore_active = false;

function registration(){
    var login = $('#login').val();
    var pass1 = $('#password1').val();
    var pass2 = $('#password2').val();
    if(login && pass1){
        if(pass1 == pass2 || restore_active){
            if(login.length > 4 && pass1.length > 4){
                $('#error').text('').addClass('none');
                $('#popup_bg').fadeOut(400);
                var passMD5 = CryptoJS.MD5(pass1 + 'aa8dgj15hf1j8gd84a5dfh');
                setPref('premium_login',login);
                setPref('premium_password',passMD5);
                var url = 'https://plugins.wips.com/timestats/pay/check?username='+encodeURIComponent(login)+'&password='+encodeURIComponent(passMD5);
                var r = new XMLHttpRequest();
                r.open("GET", url, true);
                r.onreadystatechange = function (){
                    if(r.readyState == 4){
                        if(r.status == 202){
                            bgPage.control.isPremium = true;
                            bgPage.control.waitingPayment = false;
                            setPref('new_check_newtab_premium_disable',true);
                            setPref('new_check_newtab_premium_disable2',true);
                            trackButtonSpecial('Payment success');
                            location.href = 'options.html';
                        }else if(r.status == 404){
                            if(restore_active){
                                $('#error').text('Login does not exist!').removeClass('none');
                            }else{
                                $('#login').attr('disabled','disabled');
                                $('#password1').attr('disabled','disabled');
                                $('#password2').attr('disabled','disabled');
                                $('#error').text('Waiting for payment / approval of payment').removeClass('none');
                                window.open('https://plugins.wips.com/timestats/pay?username='+encodeURIComponent(login)+'&password='+encodeURIComponent(passMD5),'_blank');
                                timer = setInterval(function(){
                                    checkTimer();
                                },3000);
                                /*setTimeout(function(){
                                    location.href = 'options.html';
                                },60000);*/
                            }
                        }else if(r.status == 401){
                            if(restore_active){
                                $('#error').text('The password is wrong!').removeClass('none');
                            }else{
                                $('#error').text('This account is already registered!').removeClass('none');
                            }                                
                        }else if(r.status == 408 || r.status == 204){
                            $('#error').text('Waiting for payment / approval of payment').removeClass('none');
                            $('#reg_zone').addClass('none');
                            bgPage.control.waitingPayment = true;
                            setTimeout(function(){
                                location.href = 'options.html';
                            },30000);
                        }else if(r.status == 403){
                            $('#error').text('The account was canceled, please contact support').removeClass('none');
                        } 
                    }
                };
                r.send(null);
            }else{
                alert('Login and passwords must have minimal 5 characters!');
            }
        }else{
            alert('Passwords are not the same!');
        }
    }else{
        alert('Please fill in all fields!');
    }
}

function checkTimer(){
    var url = 'https://plugins.wips.com/timestats/pay/check?username='+encodeURIComponent(getPref('premium_login'))+'&password='+encodeURIComponent(getPref('premium_password'));
    var r = new XMLHttpRequest();
    r.open("GET", url, true);
    r.onreadystatechange = function (){
        if(r.readyState == 4){
            if(r.status == 202){
                clearInterval(timer);
                bgPage.control.isPremium = true;
                bgPage.control.waitingPayment = false;
                setPref('new_check_newtab_premium_disable',true);
                setPref('new_check_newtab_premium_disable2',true);
                trackButtonSpecial('Payment success');
                location.href = 'options.html';
                $('#error').text('Your premium account is active!').removeClass('none');
            } 
        }
    };
    r.send(null);
}

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

$(document).ready(function(){
    
    $('#open_popup').click(function(){
        trackButtonSpecial('Become premium');
        restore_active = false;
        $('#reg_ok1').removeClass('none');
        $('#reg_zone .title1').removeClass('none');
        $('#reg_ok2').addClass('none');
        $('#reg_zone .title2').addClass('none');
        $('#password2').removeClass('none');
        $('#popup_bg').fadeIn(400);
    });
    
    $('#restore').click(function(){
        trackButtonSpecial('Restore');
        restore_active = true;
        $('#reg_ok1').addClass('none');
        $('#reg_zone .title1').addClass('none');
        $('#reg_ok2').removeClass('none');
        $('#reg_zone .title2').removeClass('none');
        $('#password2').addClass('none');
        $('#popup_bg').fadeIn(400);
    });    
    
    $('#reg_ok1').click(function(){
        trackButtonSpecial('Popup','Become premium');
        registration();
    });
    
    $('#reg_ok2').click(function(){
        trackButtonSpecial('Popup','Restore');
        registration();
    });
    
    $('#foot .later').click(function(){
        trackButtonSpecial('Show later');
        window.close();
    });
    
    $('#foot .never').click(function(){
        trackButtonSpecial('Dont want');
        setPref('new_check_newtab_premium_disable',true);
        setPref('new_check_newtab_premium_disable2',true);
        window.close();
    });
    
    $('#reg_zone .close').click(function(){
        trackButtonSpecial('Close popup');
        $('#popup_bg').fadeOut(400);
    });
    
});