function trackButtonSpecial(param2,param3,param4){
    trackButton('Thanks page',param2,param3,param4);
}

$(document).ready(function(){
    
    $('#top_share .fb').click(function(){
        trackButtonSpecial('Share','Facebook');
    });
    
    $('#top_share .twt').click(function(){
        trackButtonSpecial('Share','Twitter');
    });

});