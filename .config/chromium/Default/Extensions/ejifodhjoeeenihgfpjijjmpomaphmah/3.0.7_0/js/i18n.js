$(function() {
    $('[i18n]').each(function() {
        var key = $(this).attr('i18n');
        var msg = chrome.i18n.getMessage(key);
        $(this).html(msg);
        $(this).removeAttr('i18n');
    });
    $('[i18n_value]').each(function() {
        var key = $(this).attr('i18n_value');
        var msg = chrome.i18n.getMessage(key);
        $(this).val(msg);
        $(this).removeAttr('i18n_value');
    });
});