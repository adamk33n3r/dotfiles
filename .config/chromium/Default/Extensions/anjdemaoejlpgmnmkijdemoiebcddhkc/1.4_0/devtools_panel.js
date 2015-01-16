writeReport = function (report) {
    document.body.innerHTML = htmlentities(report).replace(/(\r\n|\n|\r)/gm, '<br/>').replace(/&amp;quot;/g, "'");
}