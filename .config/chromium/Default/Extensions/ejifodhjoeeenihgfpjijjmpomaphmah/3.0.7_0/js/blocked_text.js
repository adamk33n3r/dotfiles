var text = '"Student syndrome" refers to the phenomenon where a student will only begin to fully apply themselves to a task immediately before a deadline. This negates the usefulness of any buffers built into individual task duration estimates. Study results indicate that many students are aware of procrastination and accordingly set costly binding deadlines long before the date for which the task is due. Furthermore, these self-imposed binding deadlines are correlated with a better performance than without binding deadlines, though performance is best for evenly-spaced external binding deadlines. Finally, students have difficulties optimally setting self-imposed deadlines, with results suggesting a lack of spacing before the date at which tasks are due.', textChars, inputChars = 0;

function checkInput(){
    input = $('#text .input');
    var actualText = input.val();
    if(actualText == text){
        if(inputChars >= textChars){
            chrome.extension.getBackgroundPage().alarm.textUnblocked(localStorage['mode_text_temp_url']);
            window.history.back();
        }else{
            $('#text .error').html('Ha! I got you! Copy pasting is not allowed, you need to retype it one character by one.');
            inputChars = 0;
        }
    }
}

// INIT
$(document).ready(function(){
    
    $('#message').html('This site is blocked!');
    $('#text .title').html('You have to retype this text without making any mistake. And don\'t even think about copy-pasting it, we will find out.');
    $('#text .label').html(text);
    
    textChars = text.length;
    
    $('#text .input').keypress(function(){
        inputChars++;
    });
    
    $('#text .input').bind('keyup',function(){
        checkInput();
    });
    
});