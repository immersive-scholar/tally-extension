"use strict";

/*  COOKIE
 ******************************************************************************/

window.Cookie = (function() {
	// PRIVATE

	let cookie = {},
		hovered = false;

	var types = {
		"health": {
			"img": "cookie-dots.gif",
			"value": Math.random(),
			"stat": "health",
		},
		"stamina": {
			"img": "cookie-waffle.gif",
			"value": Math.random(),
			"stat": "stamina",
		}
	};

	// 1. determine if we will generate a cookie on this page
	function randomizer() {
		let r = Math.random();
		if (r > 0.5)
			create();
		else
			return false;
	}
	// 2. if so, then make a new one from list
	function create() {
		if (!pageData.activeOnPage || tally_options.gameMode !== "full") return;
		//console.log("Cookie.create()",tally_options.gameMode);
		var obj = randomObjProperty(types);
		cookie = obj;
		//console.log(cookie)
		add();
	}
	// 3. add cookie to a page
	function add() {
		// position
		let x = Math.ceil(Math.random() * (pageData.browser.width - 100)),
			y = Math.ceil(Math.random() * (pageData.browser.height - 100));
		let css = "left:" + x + "px;top:" + y + "px;";
		// html
		let str = "<div class='tally_cookie_inner' style='" + css + "'>" +
			"<img src='" + chrome.extension.getURL('assets/img/cookies/' + cookie.img) + "'></div>";
		$('.tally_cookie_wrapper').html(str);

		$(document).on("mouseover", ".tally_cookie_inner", function() {
			hover(cookie);
		});
		$(document).on("click", ".tally_cookie_inner", function() {
			let str = "<div class='tally_cookie_inner' style='" + css + "'>" +
				"<img src='" + chrome.extension.getURL('assets/img/cookies/cookie-explosion.gif') + "'></div>";
			$('.tally_cookie_wrapper').html(str);
			collect();
		});
	}

	function remove(){

	}

	// user hovers over cookie
	function hover(cookieObj) {
		if (!hovered)
			// tell them
			Thought.showString("Oh, you found a " + cookieObj.stat + " cookie!", "happy", true);
		// only show hover message once
		hovered = true;
	}

	// user clicks a cookie
	function collect() {
		console.log("Cookie.collect()",cookie);
		// play sound
		Sound.playRandomPowerup();
		// delay then update stats
		setTimeout(function() {
			// update stats
			Stats.update(cookie);
		}, 700);
	}





	// PUBLIC
	return {
		randomizer: randomizer,
		create: create,
		add: add,
	};
})();
