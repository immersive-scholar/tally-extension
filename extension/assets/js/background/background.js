"use strict";

window.Background = (function () {
	// PRIVATE

	let DEBUG = true,
		gameStatus = {};

	/**
	 *  1. Listen for first install, or updated (code or from web store) installation
	 */
	chrome.runtime.onInstalled.addListener(function () {
		try {
			if (DEBUG) console.log("🧰 Background.onInstalled() -> new (or updated) installation detected");
			Debug.elapsedTime("Background chrome.runtime.onInstalled() [1]");
			runInstallChecks();
		} catch (err) {
			console.error(err);
		}
	});


	/**
	 *  2. Run installation checks
	 *	- always called on new install or update
	 * 	- checks for previous install, verifies user, gets latest server data
	 * 	- order of situations to account for
	 * 		2.1. cleanInstall
	 * 				= true	-> no previous data found, install objects
	 * 				= false	-> previous data found, don't install objects
	 * 		2.2. serverOnline
	 * 				= false	-> save in meta then stop
	 * 				= true	-> save, then continue
	 * 		2.3. userOnline
	 * 				= false -> not logged-in, open login window
	 * 				= true  -> save data, then continue
	 */
	async function runInstallChecks() {
		try {
			let log = "🧰 Background.runInstallChecks()";
			dataReportHeader(log, "@", "before");
			Debug.elapsedTime("Background.runInstallChecks() [1]");

			// 2.1 cleanInstall

			// if T.tally_meta not found, install all objects
			const cleanInstall = await Install.init();
			console.log(log, "[2.1] cleanInstall =", cleanInstall);
			// set the version
			await Install.setVersion();
			// set server/api production | development
			await Install.setCurrentAPI();

			// 2.2 serverOnline

			// check the API status
			const serverOnline = await Server.checkIfOnline();
			console.log(log, "[2.2] serverOnline =", serverOnline);
			// if server NOT online ...
			if (!serverOnline) {
				console.warn(log, "[2.2] API SERVER NOT ONLINE");
				return false; // stop
			}

			// 2.3 userOnline

			// server is online so check if user logged in
			// - this is the FIRST attempt to get T.tally_user data from server
			// - if they are then this function writes over local storage objects
			const userOnline = await Server.getTallyUser();
			console.log(log, "[2.3] userOnline =", userOnline);
			if (!userOnline) {
				// if user not logged in we should prompt
				console.log(log, "[2.3] NOT LOGGED IN");

				// if clean install then definitely open start screen
				if (cleanInstall) {
					console.log(log, "-> NEW INSTALL, LAUNCH START SCREEN");
					// prompt to install
					const startScreenResponse = await Install.launchStartScreen();
				}

			}
			// user logged in ...
			else {
				// username is stored in T.tally_user and we can pass it to populate monsters
				const returnTopMonstersResponse = await Server.returnTopMonsters();
				console.log(log, "[2.4] returnTopMonstersResponse =", returnTopMonstersResponse);
				Debug.elapsedTime(log, "[2.4]");
				// return true to send data back to content
				return true;
			}
			// if we get this far then fail
			return false;

		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *  Data reporting
	 */
	function dataReport() {
		try {
			let _tally_user = store("tally_user"),
				_tally_options = store("tally_options"),
				_tally_meta = store("tally_meta");
			dataReportHeader("🧰 Background.dataReport()", "#", "before");
			if (DEBUG) console.log("%cT.tally_user", Debug.styles.greenbg, JSON.stringify(_tally_user));
			if (DEBUG) console.log("%cT.tally_options", Debug.styles.greenbg, JSON.stringify(_tally_options));
			if (DEBUG) console.log("%cT.tally_meta", Debug.styles.greenbg, JSON.stringify(_tally_meta));
			dataReportHeader("/ 🧰 Background.dataReport()", "#", "after");
		} catch (err) {
			console.error("dataReport() failed");
		}
	}

	function dataReportHeader(title, char, pos) {
		// console.trace();
		if (!DEBUG) return;
		// make string
		let line = "";
		for (let i = 0; i < 30; i++) {
			line += char;
		}
		if (pos == "before") console.log("\n");
		console.log(line + " " + title + " " + line);
		if (pos == "after") console.log("\n");
	}


	/**
	 *	Background timed events
	 */
	function serverCheckTimer() {
		try {
			setInterval(function () {
				Server.checkIfOnline();
			}, (1000 * 60));
		} catch (err) {
			console.error("dataReport() failed");
		}
	}


	// PUBLIC
	return {

		runInstallChecks: runInstallChecks,
		dataReport: dataReport,
		dataReportHeader: dataReportHeader
	};
}());
