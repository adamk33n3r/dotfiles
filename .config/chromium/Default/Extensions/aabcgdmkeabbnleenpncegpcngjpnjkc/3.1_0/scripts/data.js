function isDataReady() {
	var code = dataSet(localStorage["Expression"]);
	if (code.indexOf("^O") == 0 && code.indexOf("0$") == code.length - 2) {
		return true;
	}
	else {
		return false;
	}
}

function dataSync() {
	if (isDataReady()) {
		$('#imgLock').css('backgroundPosition', '-16px 0px');
		$('#imgLock').attr('title', 'Registered');
		$('#imgLock').unbind('hover');
		$('#imgLock').unbind('mouseleave');
		$('#registerLink').html('Registered');
		$('#registrationCodeDiv').html('<div style="padding-left:4px; color:#606060;">Professional Edition</div>');
		$('#trialText').hide();
		
		$('#chkDomain').removeAttr("disabled");
		$('#chkRandom').removeAttr("disabled");
		$('#chkCache').removeAttr("disabled");
		$('#chkTimer').removeAttr("disabled");
		$('#advancedOptions').css("color", '#000000');

		localStorage.feedbackOptOut = 'true';
	}
	else {
		$('#chkDomain').attr("disabled", true);
		$('#chkRandom').attr("disabled", true);
		$('#chkCache').attr("disabled", true);
		$('#chkTimer').attr("disabled", true);
		$('#advancedOptions').css("color", '#606060');
		
		$('#imgLock').hover(function() { 
			$('#imgLock').css('backgroundPosition', '-32px 0px');
			$('#imgLock').css('cursor', 'pointer');
		}).mouseleave(function() {
			$('#imgLock').css('backgroundPosition', '0px 0px');
			$('#imgLock').css('cursor', 'auto');
		});

		localStorage.removeItem('feedbackOptOut');
	}
}

function dataSet(text) {
	var key = 7;
	var result = "";
	
	if (text != null) {
		for (i=0; i<text.length; ++i)
		{
			result += String.fromCharCode(key ^ text.charCodeAt(i));
		}
	}
	
	return result;
}