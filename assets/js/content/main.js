"use strict";

/**
 *  ______     ____
 * /_  __/__ _/ / /_ __
 *  / / / _ `/ / / // /
 * /_/  \_,_/_/_/\_, /
 *              /___/
 *
 *  https://tallysavestheinternet.com
 *
 */

window.TallyMain = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.TallyMain;

	$(function() {
		// test();
	});

	/**
	 *	1. Perform test - wait until dataLoaded
	 */
	function test() {
		try {
			Config.logTimeSinceLoad("TallyMain.test() [1]");
			let safety = 0;
			while (!TallyInit.dataLoaded) {
				if (++safety > 1000) {
					console.log("🧰 TallyMain SAFETY FIRST!");
					console.log("🧰 TallyMain - >", T.tally_user);
					Config.logTimeSinceLoad("TallyMain.test() [1.2]");
					contentStartChecks();
					break;
				}
				Config.logTimeSinceLoad("TallyMain.test() [2] TallyInit.dataLoaded =", TallyInit.dataLoaded);
			}
		} catch (err) {
			console.error("🧰 TallyMain.test() failed", err);
		}
	}

	/**
	 *	2. Perform all start checks
	 *	- confirm it is safe to run game; then add all required elements to DOM
	 */
	async function contentStartChecks() {
		try {
			if (DEBUG) Debug.dataReportHeader("🧰 TallyMain.contentStartChecks() [1]", "#", "before");
			if (DEBUG) console.log('🧰 TallyMain.contentStartChecks() [1.1] -> T.tally_user.username =', T.tally_user.username);
			// if (DEBUG) console.log('🧰 TallyMain.contentStartChecks() [1.1] -> T.tally_user =',T.tally_user);
			// if (DEBUG) console.log('🧰 TallyMain.contentStartChecks() [1.1] -> T.tally_options =',T.tally_options);
			// if (DEBUG) console.log('🧰 TallyMain.contentStartChecks() [1.1] -> T.tally_meta =',T.tally_meta);
			// if (DEBUG) console.log('🧰 TallyMain.contentStartChecks() [1.1] -> T.tally_nearby_monsters =',T.tally_nearby_monsters);
			// if (DEBUG) console.log('🧰 TallyMain.contentStartChecks() [1.1] -> T.tally_stats =',T.tally_stats);
			// if (DEBUG) console.log('🧰 TallyMain.contentStartChecks() [1.1] -> T.tally_top_monsters =',T.tally_top_monsters);


			// 2.1. Set the Page.data.mode
			if (DEBUG) console.log('🧰 TallyMain.contentStartChecks() [2.1] -> SET Page.data.mode');

			// stop if Page.data failed
			if (!prop(Page.data)) return console.warn("... Page.data NOT FOUND");
			// check page mode before proceeding
			Page.data.mode = getPageMode();
			// stop if page mode marked notActive
			if (Page.data.mode.notActive) return console.log(" NOT ACTIVE - Page.data.mode =", Page.data.mode);


			// 2.2. Check for Flags (in case we need to pause and restart game with data)
			if (DEBUG) console.log('🧰 TallyMain.contentStartChecks() [2.2] -> Check for flags');

			// check for, and possibly execute and flags
			let newTokenFound = await Flag.check();
			// if token flag found we should allow restart to happen
			if (newTokenFound) return false;
			// if this is the second run after a new token found
			else if (Page.data.tokenFound == true) {
				// let progress show game events
				Progress.tokenAdded();
			}

			// 2.3. Add stylesheets and debugger
			if (DEBUG) console.log('🧰 TallyMain.contentStartChecks() [2.3] -> Add game requirements');

			// add required CSS for game
			FS_String.insertStylesheets();
			// add html for game
			Interface.addBaseHTML();
			// add debugger to page and update
			Debug.add();
			Debug.update();
			// now safe to add Tally
			addTallyToPage();

		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Get the page mode for the current page - Make sure Tally isn't disabled on this page | domain | subdomain | etc
	 */
	function getPageMode() {
		try {
			let log = "🧰 TallyMain.getPageMode() -> ";

			// start from scratch
			let mode = {
				active: 0,
				noToken: 0,
				serverOffline: 0,
				notActive: 0
			};

			// NOT ACTIVE
			// - something really wrong with page;
			// - tally does not show at all, does not save in background or prompt for token

			// Page.data failed - game cannot start at all
			if (!prop(Page.data)) {
				if (DEBUG) console.log(log + "No Page.data found");
				mode.notActive = 1;
			}
			// this is a disabled domain - user has added this to blocklist
			else if (prop(T.tally_options.disabledDomains) && (
					($.inArray(Page.data.domain, T.tally_options.disabledDomains) >= 0) ||
					($.inArray(Page.data.subDomain, T.tally_options.disabledDomains) >= 0)
				)) {
				if (DEBUG) console.log(log + "Tally is disabled on this domain");
				mode.notActive = 1;
			}
			// this is not a web page (e.g. a PDF or image)
			else if (Page.data.contentType != "text/html") {
				if (DEBUG) console.log(log + "Tally is disabled on pages like " + Page.data.contentType);
				mode.notActive = 1;
			}
			// this is a file:// URI
			else if (Page.data.url.indexOf("file://") > -1) {
				if (DEBUG) console.log(log + "Tally is disabled on file:// urls");
				mode.notActive = 1;
			}
			// this is a popup / signin that is really small
			else if (Page.data.browser.width < 600) {
				if (DEBUG) console.log(log + "Tally is disabled on small windows");
				mode.notActive = 1;
			}

			// SERVER IS OFFLINE
			// - tally can still point to trackers, save in bg
			// - the game can run using the background only, for example, if token is broken or server is offline
			if (!T.tally_meta.server.online) {
				if (DEBUG) console.log(log + "Connection to Tally server is down");
				mode.serverOffline = 1;
			}

			// NO TOKEN
			// - there is a problem with the token; no token or did not validate;
			// - tally can still point to trackers, prompt for token (assuming server is online), save in bg
			else if (T.tally_meta.token.status !== "ok") {
				if (DEBUG) console.log(log + "T.tally_meta.token.status =", T.tally_meta.token.status, T.tally_meta);
				mode.noToken = 1;
			}

			// ACTIVE
			// - background, token, server, and everything else (like the above) is good, let's roll
			if (mode.notActive == 0 && mode.serverOffline == 0 && mode.noToken == 0) {
				if (DEBUG) console.log(log + "All is good, setting mode.active = 1");
				mode.active = 1;
			}

			// return to save in Page.data.mode
			return mode;

		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	3. Add Tally to page
	 *	- confirm it is safe to run game; then add all required elements to DOM
	 */
	function addTallyToPage() {
		try {
			// 3.1. add Tally character
			if (DEBUG) console.log('🧰 TallyMain.addTallyToPage() [3.1] -> Add tally');

			// add Tally character
			Tally.addCharacter();
			// add timed events listeners
			TallyEvents.startTimeEvents();
			// add main click listener
			TallyListeners.addMainClickEventListener();
			// create a fresh background update
			TallyData.createBackgroundUpdate();
			// add stats
			Tally.addStats();
			// add disguise
			Disguise.displayIfTrackerBlocked();

			// start game on the page
			startGameOnPage();

		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * 	4. Run game on this page, can be called as many times as necessary
	 */
	function startGameOnPage() {
		try {
			if (DEBUG) Debug.dataReportHeader("🧰 TallyMain.startGameOnPage()", "#", "before");

			// allow offline
			if (Page.data.mode.notActive) return console.warn("🧰 TallyMain.startGameOnPage() Page.data.mode =", Page.data.mode);
			// don't allow if mode disabled
			if (T.tally_options.gameMode === "disabled") return;


			// 4.1. Progress and event checks
			if (DEBUG) console.log("🧰 TallyMain.startGameOnPage() [4.1] -> Check progress");




			// 4.2. Check and show items
			if (DEBUG) console.log("🧰 TallyMain.startGameOnPage() [4.2] -> Add items");

			// potentially add a consumable
			Consumable.randomizer();
			// update debugger
			Debug.update();
			// start Demo if we are running in demo mode
			Demo.start();


			// checks to perform after user has interacted with page
			setTimeout(function() {

				// check for, and possibly complete any progress
				Progress.check("TallyMain");
				// check last active status and potentially recharge
				// TallyEvents.checkLastActiveAndRecharge();

				if (DEBUG) console.log("🧰 TallyMain.startGameOnPage() [4.3] -> Check badges");
				// potentially add badge
				Badge.check();

				// after a bit more time
				setTimeout(function() {
					if (DEBUG) console.log("🧰 TallyMain.startGameOnPage() [4.4] -> Check monsters");
					// check for, and potentially add monsters on the page
					MonsterCheck.check();
				}, 500);

			}, 1000);




			// ?
			// should be done in bg?
			// check for, and potentially execute and flags from server (from previous update)
			// checkForServerFlags();


		} catch (err) {
			console.error(err);
		}
	}



	/**
	 *	Check for flags from server
	 */
	function checkForServerFlags() {
		try {
			// are there flags?
			if (!FS_Object.prop(T.tally_user.flags) || FS_Object.isEmpty(T.tally_user.flags)) return;
			if (DEBUG) console.log("🧰 TallyMain.checkForServerFlags() 🚩", T.tally_user.flags);
			// address individual flags...

			// SERVER SAYS: we have leveled up!
			if (FS_Object.prop(T.tally_user.flags.levelUp)) {
				// make sure we have this flag in GameData
				if (!FS_Object.prop(GameData.flags.levelUp))
					return console.warn("Flag does not exist in GameData.");
				// // update stats
				// Stats.reset("tally");
				// tell user
				setTimeout(function() {
					Dialogue.showStr(GameData.flags.levelUp.dialogue, GameData.flags.levelUp.mood);
					// remove flag once handled
					remove("levelUp");
				}, 300);
			}
			// SERVER SAYS: we have received a new attack
			// might do this locally instead
			if (FS_Object.prop(T.tally_user.flags.newAttack)) {
				// remove flag once handled
			}

		} catch (err) {
			console.error(err);
		}
	}


	function removeFlag(name) {
		// confirm it exists
		if (FS_Object.prop(T.tally_user.flags[name])) {
			// get flag
			let flag = T.tally_user.flags[name];
			// mark as deleted
			flag.status = "delete";
			// remove it from T.tally_user
			delete T.tally_user.flags[name];
			// save in background
			TallyStorage.saveData("tally_user", T.tally_user, "🧰 TallyMain.removeFlag()");
			// save in background (and on server)
			TallyData.queue("itemData", "flags", flag, "🧰 TallyMain.removeFlag()");
		}
	}



	// PUBLIC
	return {
		getPageMode: getPageMode,
		contentStartChecks: contentStartChecks,
		startGameOnPage: startGameOnPage,
		checkForServerFlags: checkForServerFlags
	};
}());
