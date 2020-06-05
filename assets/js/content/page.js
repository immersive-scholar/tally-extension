"use strict";

window.Page = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.Page,
		mode = {},
		data = getData();


	/**
	 *	Update the page mode for the current page
	 *	- active = background, token, server, and everything else is good
	 *	- noToken = no token or did not validate; tally can still point to trackers, prompt for token, save in bg
	 *	- serverOffline = server is offline; tally can still point to trackers, save in bg
	 * 	---------- *everything means the game can run using the background only -----------
	 *	---------- for example, if token is broken or server is offline -----------
	 *	- notActive = something really wrong with page; tally does not show at all, do not save in background
	 */
	function updateMode(state = "notActive") {
		try {
			// make a copy of the old mode
			let oldMode = Object.assign({}, mode);
			// reset current
			mode = {
				active: 0,
				noToken: 0,
				serverOffline: 0,
				notActive: 0
			};
			// default
			if (state === "active") mode.active = 1;
			else if (state === "noToken") mode.noToken = 1;
			else if (state === "serverOffline") mode.serverOffline = 1;
			else if (state === "notActive") mode.notActive = 1;
			if (DEBUG) console.log("🗒️ Page.updateMode()", state, "OLD =", oldMode, "NEW =", JSON.stringify(mode));
		} catch (err) {
			console.error(err);
		}
	}
	/**
	 *	Return the current Page.mode
	 */
	function getMode() {
		return mode;
	}



	/*  HTML FUNCTIONS
	 ******************************************************************************/


	function getDescription() {
		try {
			var str = "";
			var descriptionTag = document.head.querySelector("meta[property='og:description']") ||
				document.head.querySelector("meta[name='description']");
			if (descriptionTag) str = descriptionTag.getAttribute("content");
			return str;
		} catch (err) {
			console.error(err);
		}
	}

	function getH1() {
		try {
			var str = "";
			if ($('h1').length) str = $('h1').text().trim();
			return str;
		} catch (err) {
			console.error(err);
		}
	}

	function getKeywords() {
		try {
			var str = "";
			var keywordsTag = document.head.querySelector("meta[property='og:keywords']") ||
				document.head.querySelector("meta[name='keywords']");
			if (keywordsTag) str = keywordsTag.getAttribute("content");
			return str;
		} catch (err) {
			console.error(err);
		}
	}

	function getTitle() {
		try {
			var str = "";
			var ogTitle = document.querySelector("meta[property='og:title']");
			if (ogTitle) str = ogTitle.getAttribute("content");
			else str = document.title;
			return str;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Get all "tags" on a page
	 */
	function getPageTags(data) {
		try {
			// if (DEBUG) console.log("🗒 Page.getPageTags()");
			// create array
			let tags = [],
				str = data.description + " " +
				data.h1 + " " +
				data.keywords + " " +
				data.title;
			tags = cleanStringReturnTagArray(str);
			//if (DEBUG) console.log( "tags", JSON.stringify(tags) );
			// delete duplicates
			tags = removeDuplicates(tags);
			tags = removeStopWords(null, tags);
			tags = removeSmallWords(tags);
			return tags;
		} catch (err) {
			console.error(err);
		}
	}





	/**
	 *	Run getData again with refresh flag
	 */
	async function refreshData() {
		try {
			data = await getData(true);
			return true;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Get data about this page
	 */
	function getData(refresh = false) {
		try {
			var url = document.location.href;
			// only run on web pages
			// if (!url || !url.match(/^http/)) return;
			// object
			let newData = {
				browser: {
					name: Environment.getBrowserName() || "",
					cookieEnabled: navigator.cookieEnabled || "",
					language: Environment.getBrowserLanguage() || "",
					platform: Environment.getPlatform() || "",
					width: window.innerWidth || document.body.clientWidth,
					height: window.innerHeight || document.body.clientHeight,
					center: {
						x: 0,
						y: 0
					},
					fullHeight: document.body.scrollHeight || 0
				},
				screen: {
					width: screen.width || 0,
					height: screen.height || 0
				},
				contentType: window.document.contentType || "",
				description: getDescription() || "",
				domain: Environment.extractRootDomain(document.location.href) || "",
				h1: getH1() || "",
				keywords: getKeywords() || "",
				mouseX: 0,
				mouseY: 0,
				mouseupFired: false,
				subDomain: Environment.extractSubDomain(document.location.href) || "",
				tags: [],
				time: 0,
				title: getTitle() || "",
				tokenFound: false,
				resetTallyUserCalled: false,
				trackers: "",
				previousUrl: "",
				url: document.location.href || ""
			};
			// add dimensions
			newData.browser.center.x = newData.browser.width / 2;
			newData.browser.center.y = newData.browser.height / 2;
			// check and count page tags
			newData.tags = getPageTags(newData);
			// add trackers
			newData.trackers = Tracker.blockOnPage(newData.domain) || "";
			// if youtube
			if (newData.domain == "youtube.com")
				// 	addMutationObserver();
				addTitleChecker();

			if (DEBUG) console.log("🗒 Page.getData()", newData);
			// show in background
			Debug.sendBackgroundDebugMessage("🗒 Page.getData()", newData.url);
			return newData;
		} catch (err) {
			console.error(err);
		}
	}







	// chrome.runtime.connect().onDisconnect.addListener(function() {
	//     // clean up when content script gets disconnected
	// 	console.warn("EXTENSION WAS UPDATED");
	// });



	/**
	 *	MutationObserver to detect title element changes (e.g. youtube and other ajax sites)
	 *	NOTE: This slows down the page
	 */
	function addMutationObserver() {
		try {
			// allow offline
			if (Page.mode().notActive) return;
			// don't allow if mode disabled
			if (tally_options.gameMode === "disabled") return;

			new MutationObserver(function(mutations) {
				if (DEBUG) console.log("title changed", mutations[0].target.nodeValue);
				restartAfterMutation("🗒 Page.addMutationObserver()");
			}).observe(
				document.querySelector('title'), {
					subtree: true,
					characterData: true,
					childList: true
				}
			);
		} catch (err) {
			console.error(err);
		}
	}
	// alternate observer, simply listens for title change
	function addTitleChecker() {
		try {
			let pageTitleInterval = setInterval(function() {
				let title = getTitle();
				if (title != data.title) {
					//if (DEBUG) console.log("title changed", Page.data.title, " to: ",title);
					restartAfterMutation("🗒 Page.addTitleChecker()");
				} else {
					//if (DEBUG) console.log("title is same", Page.data.title, " to: ",title);
				}
			}, 10000);
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Restart app after page mutation
	 */
	function restartAfterMutation(caller) {
		try {
			// allow offline
			if (Page.mode().notActive) return;
			// don't allow if mode disabled
			if (tally_options.gameMode === "disabled") return;

			if (DEBUG) console.log("🗒 Page.restartAfterMutation() caller = " + caller);

			// refresh Page.data
			Page.refreshData().then(function() {
				// check for monsters again
				MonsterCheck.check();
				Debug.update();
			});

		} catch (err) {
			console.error(err);
		}
	}



	// PUBLIC
	return {
		mode: getMode,
		updateMode: updateMode,
		refreshData: refreshData,
		data: data
	};
})();
