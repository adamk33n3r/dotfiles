var $status = $(".channel .status");

$('body').on('click', 'a', function() {
	chrome.tabs.create({
		url: $(this).attr('href')
	});
	return false;
});

function getStream(channel) {
	$.getJSON("https://api.twitch.tv/kraken/streams/" + channel, function(data) {
		updateStatus(data.stream);
	});
}

function showNotifiction() {

}

function updateStatus(stream) {
	if (stream == null) {
		$status.html("DVColgan is currently offline.");
		$status.removeClass("larger");
		return;
	} else {
		$status.html("DVColgan is live with \"" + stream.channel.status + "\"<br>");
		$status.append("<a href=\"http://twitch.tv/dvcolgan\"><img src=\"" + stream.preview.medium + "\"></a>");
		$status.addClass("larger");
	}
}

getStream("dvcolgan");

setInterval(function() {
	getStream("dvcolgan");
}, 5000);