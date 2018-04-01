"use strict";




// on first install
chrome.runtime.onInstalled.addListener(function() {
	console.log("!!!!! new [update|install] detected");
	// is this the first install?
	if (!prop(store("tally_meta"))) {
		console.log("!!!!! no tally_meta found, creating app");
		// attempt to install if not found
		createApp();
		// otherwise is there a valid token?
	} else {
		checkAPIServerStatus();
		checkTokenOnLaunch();
	}
});
 


/**
 *  Create user, options, meta, etc.
 */
function createApp() {
	console.log(">>>>> createApp() -> first install: creating tally_user");
	try {
		// Create objects
		store("tally_user", createUser());
		store("tally_options", createOptions());
		store("tally_game_status", createGameStatus());
		store("tally_recent_monsters", createRecentMonsters());
		store("tally_meta", createMeta());
		store("tally_secret", createSecret());
		// these are empty the first time
		//		store("tally_domains", {});
		//		store("tally_urls", {});

		// start registration
		launchRegistration("createApp() -> first install");
	} catch (ex) {
		console.log("failed to create user");
	}
}

/**
 *  Contact server to verify token
 */
function checkTokenOnLaunch() {
	let tally_secret = store("tally_secret"),
		tally_meta = store("tally_meta");
	console.log(tally_secret, tally_meta);
	if (!tally_meta.serverOnline) return;
	// if a token exsts
	if (prop(tally_secret.token) && tally_secret.token !== "") {
		$.ajax({
				url: tally_meta.api + "/verifyToken",
				type: "POST",
				timeout: 15000, // set timeout to 15 secs to catch ERR_CONNECTION_REFUSED
				contentType: 'application/json',
				dataType: 'json',
				data: JSON.stringify({
					"token": tally_secret.token
				})

			}).done(result => {
				console.log("<{!}> hasValidToken() result =", JSON.stringify(result));
				// check date on token
				if (result.tokenExpires && result.tokenExpires) {
					console.log(">>>>> checkTokenOnLaunch() -> everything is cool, starting game");
					startApp();
				} else {
					launchRegistration("checkTokenOnLaunch() -> no validToken found");
				}
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				launchRegistration("checkTokenOnLaunch() -> fail: " + errorThrown);
			});
	} else {
		// there is no token so launch reg (again?)
		launchRegistration("checkTokenOnLaunch() -> NO TOKEN FOUND");
	}
}

function launchRegistration(calledFrom) {
	let tally_meta = store("tally_meta");
	//launch install page
	chrome.tabs.create({
		url: tally_meta.website + "/signup"
	}, function(tab) {
		console.log("!!!!! launchRegistration(" + calledFrom + ") -> launching install page");
	});

}


function startApp() {
	try {
		let tally_user = store("tally_user"),
			tally_options = store("tally_options"),
			tally_meta = store("tally_meta"),
			tally_secret = store("tally_secret");
		console.log("############################## welcome back ! ##############################");
		console.log("tally_user", JSON.stringify(tally_user));
		console.log("tally_options", JSON.stringify(tally_options));
		console.log("tally_meta", JSON.stringify(tally_meta));
		console.log("tally_secret", JSON.stringify(tally_secret));
	} catch (ex) {
		console.log("startApp() failed");
	}
}





/*  BACKGROUND INIT FUNCTIONS
 ******************************************************************************/

/**
 *  Create user
 */
function createUser() {
	var obj = {
		"username": "ow3n",
		"score": createScore(),
		"achievements": createAchievements(),
		"skins": ["color-magenta"]
	};
	return obj;
}
// Create Score object (separate function so we can reset)
function createScore() {
	var obj = {
		"score": 0,
		"clicks": 0,
		"likes": 0,
		"pages": 0,
		// "domains": 0, // probably won't track this
		"level": 0,
	};
	return obj;
}
// Track status of current game
function createGameStatus() {
	var obj = {
		"skin": "color-magenta"
	};
	return obj;
}
// Keep track of monsters
function createRecentMonsters() {
	var obj = {};
	return obj;
}

// Create Achievements object (separate function so we can reset)
function createAchievements() {
	var obj = {
		"monsters": {},
	};
	return obj;
}

function createOptions() {
	var obj = {
		"showTally": true,
		"showClickVisuals": true,
		"playSounds": true,
		"showAnimations": true,
		"gameMode": "full",
		"skin": "color-magenta",
		"disabledDomains": [
			"drive.google.com",
			"docs.google.com",
		],
		"showDebugger": true,
		"debuggerPosition": [0, 300]
	};
	obj = setOptions(obj);
	return obj;
}

function setOptions(options) {
	if (options.gameMode == "full") {
		options.showTally = true;
		options.showClickVisuals = true;
		options.playSounds = true;
		options.showAnimations = true;
	} else if (options.gameMode == "stealth" || options.gameMode == "disabled") {
		options.showTally = false;
		options.showClickVisuals = false;
		options.playSounds = false;
		options.showAnimations = false;
	}
	return options;
}

/**
 *  Create Meta object on installation
 */
function createMeta() {
	var obj = {
		"version": 0.1,
		"installedOn": returnDateISO(),
		"lastSyncedToServer": 0,
		"lastSyncedResult": 0,
		"userOnline": navigator.onLine,
		"serverOnline": 0,
		"serverOnlineTime": 0,
		"api": "http://localhost:5000/api",
		"website": "http://localhost:5000",
		"browser": getBrowser()
	};
	return obj;
}

function getBrowser() {
	if (navigator.userAgent.indexOf("Chrome") != -1) {
		return "Chrome";
	} else if (navigator.userAgent.indexOf("Opera") != -1) {
		return "Opera";
	} else if (navigator.userAgent.indexOf("MSIE") != -1) {
		return "IE";
	} else if (navigator.userAgent.indexOf("Firefox") != -1) {
		return "Firefox";
	} else {
		return "unknown";
	}
}

/**
 *  Create Secret object on installation
 */
function createSecret() {
	var obj = {
		"token": "3HYBTpmJiclmDPnCJThC3dwdmaNIJuU21aq5Iw9sFXtnpYo6GF",
		"tokenExpires": "2018-03-24T15:45:08.000Z"
	};
	return obj;
}
