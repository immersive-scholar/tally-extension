"use strict";




/*  AJAX FUNCTIONS
 ******************************************************************************/


function sendServerUpdate(data) {
	console.log("sendServerUpdate()", data);
	let _tally_meta = store("tally_meta");
	if (!_tally_meta.serverOnline) return;
	$.ajax({
		//url: _tally_meta.api + "/user/userExtensionUpdate",
		url: "http://localhost:5000/api/user/extensionUpdate",
		type: "PUT",
		contentType: 'application/json', // type of data you are sending
		dataType: 'json', // type of data you expect to receive
		data: JSON.stringify(data)
	}).done(result => {
		console.log("sendServerUpdate() RESULT =", JSON.stringify(result));
	}).fail(() => {
		console.error("sendServerUpdate() RESULT =", JSON.stringify(errorThrown));
        // server might not be reachable
        checkAPIServerStatus();
	});
}


/**
 *  Check to see if API Server is online
 */
function checkAPIServerStatus() {
	let _tally_meta = store("tally_meta");
	// time it
	var started = new Date().getTime();
	$.ajax({
		type: "GET",
		timeout: 5000,
		url: _tally_meta.api,
		//context: document.body,
		success: function() {
			var ended = new Date().getTime();
			_tally_meta.serverOnline = 1;
			_tally_meta.userOnline = 1;
			_tally_meta.serverOnlineTime = ended - started;
			// save result
			store("tally_meta", _tally_meta);
			//console.log("RESULT: ", JSON.stringify(_tally_meta));
		},
		error: function(xhr, status, error) {
			_tally_meta.serverOnline = 0;
			_tally_meta.userOnline = 0;
			_tally_meta.serverOnlineTime = -1;
			// save result
			store("tally_meta", _tally_meta);
			//console.log("RESULT: ", JSON.stringify(_tally_meta));
		}
	});
}

// create timed functions
var timedEvents = {
	// check if user is online
	// userOnlineInt: setInterval(function() {
	// }, 5 * 1000),
	// check if server online
	serverOnlineInt: setInterval(function() {
		checkAPIServerStatus();
	}, 500 * 1000) //
};
