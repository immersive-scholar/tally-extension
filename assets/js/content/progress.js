"use strict";

window.Progress = (function() {
	// PRIVATE
	let DEBUG = Debug.ALL.Progress;

	let defaults = {
		// authentication
		"tokenAdded": false,
		"tokenAddedPlayWelcomeMessage": false,
		// tutorials
		"mouseEnterTally": false,
		"mouseLeaveTally1": false,
		"mouseLeaveTally2": false,
		"clickTally": false,
		"doubleClickTally": false,
		"dragTally": false,
		"viewTutorialOne": false,
		"viewProfilePage": false,
		// attacks
		"attackLimit": 1,
		"attacksAwarded": 0,
		"attacksSelected": 0,
		// battles
		"battlesFought": 0,
		"battleWon": 0,
		"battleLost": 0,
		"battleEscaped": 0,
		"notifyToClickAfterBattle": 0
	};


	/**
	 *	Get value of an individual progress item
	 */
	function get(name) {
		try {
			// if value exists in tally_user && is true | >0 | !""
			if (FS_Object.prop(tally_user.progress) &&
				FS_Object.prop(tally_user.progress[name])) {

				if (DEBUG) console.log("🕹️ Progress.get()", tally_user.progress[name]);
				return tally_user.progress[name].val;
			} else {
				if (DEBUG) console.log("🕹️ Progress.get() "+ name +" NOT FOUND");
				return false;
			}
		} catch (err) {
			console.error(err);
		}
	}


	/**
	 *	Update progress on server
	 */
	function update(name, val, operator = "=") {
		try {
			if (DEBUG) console.log("🕹️ Progress.update() [1]", name + operator + val);
			// save current status to return later before changing
			let currentVal = get(name);
				if (DEBUG) console.log("🕹️ Progress.update() [2]", name + operator + val, "currentVal="+currentVal);
			// instead of setting, we need to do an operation
			if (operator !== "=") {
				// update value
				val = FS_Number.operation(currentVal, val, operator);
			}
				if (DEBUG) console.log("🕹️ Progress.update() [3]", name + operator + val, "currentVal="+currentVal);
			// create progress object
			let obj = {
				"name": name,
				"val": val
			};
			// save in background and on server
			TallyStorage.saveTallyUser("progress", obj, "🕹️ Progress.update()");
			TallyStorage.addToBackgroundUpdate("itemData", "progress", obj, "🕹️ Progress.update()");
			return currentVal;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Checks to see if any progress events should be executed
	 */
	function check(caller = "Progress") {
		try {
			if (DEBUG) console.log("🕹️ Progress.check() caller =", caller, tally_user.progress);
			// return if not found
			if (!tally_user.progress) return;



			// AWARD ATTACK - 1st
			if (get("attacksAwarded") <= 0 && tally_user.score.score > 1) {
				BattleAttack.rewardAttack("", "attack");
				update("attacksAwarded", 1, "+");
			}
			// AWARD ATTACK - 2nd
			if (get("attacksAwarded") <= 1 && tally_user.score.score > 10) {
				BattleAttack.rewardAttack("", "defense");
				update("attacksAwarded", 1, "+");
			}
			// AWARD ATTACK - 3rd
			if (get("attacksAwarded") <= 2 && get("battlesFought") > 0) {
				BattleAttack.rewardAttack("", "attack");
				update("attacksAwarded", 1, "+");
			}
			// AWARD ATTACK - 4th
			if (get("attacksAwarded") <= 3 && tally_user.score.score > 100) {
				BattleAttack.rewardAttack("", "defense");
				update("attacksAwarded", 1, "+");
			}

			// if tally levels up her attack capacity increases
			if (get("attackLimit") < GameData.attackLimits[FS_Number.clamp(tally_user.level, 0, 4)]) {
				update("attackLimit", GameData.attackLimits[FS_Number.clamp(tally_user.level, 0, 4)]);
				Dialogue.showStr("You can now use " + get("attackLimit") + " attacks in battle!", "happy");
				Dialogue.showStr("Manage your attacks with the button at the top right of browser window.", "happy");
			}



		} catch (err) {
			console.error(err);
		}
	}



	// PUBLIC
	return {
		get: function(prop) {
			return get(prop);
		},
		update: function(name, val, operator) {
			return update(name, val);
		},
		check: function(caller) {
			return check(caller);
		}
	};
}());
