"use strict";

window.MonsterCheck = (function() {

	let DEBUG = false,
		currentMID = "",
		secondsBeforeDelete = 300; // 60 seconds for testing





	/**
	 *	Initial check function, refreshes nearby monsters from back end continues to next
	 */
	function check() {
		try {
			// don't check if disabled
			if (pageData.domain == "tallygame.net" ||
				tally_options.gameMode === "disabled" ||
				!pageData.activeOnPage) return;
			checkNearbyMonsterTimes();
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Make sure all monsters are nearby, deletes those that aren't
	 */
	function checkNearbyMonsterTimes() {
		try {
			let now = Date.now(),
				highestStage = 0,
				deleteList = [];
			// make sure tally_nearby_monsters exists
			if (tally_nearby_monsters && objLength(tally_nearby_monsters) > 0) {
				if(DEBUG) console.log("👿 ⊙⊙⊙⊙⊙ MonsterCheck.checkNearbyMonsterTimes() -> tally_nearby_monsters =",tally_nearby_monsters);
				// loop through them
				for (var mid in tally_nearby_monsters) {
					if (tally_nearby_monsters.hasOwnProperty(mid)) {
						// how long has it been since this monster was seen?
						// if longer than 5 mins (300 secs) then delete
						let seconds = ((now - tally_nearby_monsters[mid].updatedAt) / 1000);
						if ((seconds) > secondsBeforeDelete) {
							deleteList.push(MonsterData.dataById[mid].slug);
							delete tally_nearby_monsters[mid];
						}
						// skin should reflect highest stage
						if (prop(tally_nearby_monsters[mid]) && tally_nearby_monsters[mid].stage > highestStage)
							highestStage = tally_nearby_monsters[mid].stage;
					}
				}
			}
			// log deleted to console
			if (DEBUG)
				if (deleteList.length > 0)
					console.log("👿 ⊙⊙⊙⊙⊙ MonsterCheck.checkNearbyMonsterTimes() -> DELETING", deleteList);
			TallyStorage.saveData("tally_nearby_monsters",tally_nearby_monsters);
			// set the skin color
			Skin.setStage(highestStage);
			// continue
			checkForTagMatches();
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Check the page for a monster
	 */
	function checkForTagMatches() {
		try {
			if (DEBUG) console.log('👿 ⊙⊙⊙⊙⊙ MonsterCheck.checkForTagMatches() -> pageData.tags =', pageData.tags);
			// loop through the tags on the page
			for (var i = 0, l = pageData.tags.length; i < l; i++) {
				// save reference
				let tag = pageData.tags[i];
				// if tag is in list
				if (MonsterData.idsByTag[tag]) {
					// save reference to related monster ids
					let arr = MonsterData.idsByTag[tag];
					// if there is at least one match...
					if (arr.length > 0) {
						// pick random monster id from list, this will be the page monster
						let randomMID = arr[Math.floor(Math.random() * arr.length)];
						// return if not a number or not found in dataById
						if (isNaN(randomMID) || !prop(MonsterData.dataById[randomMID])) return;
						if (DEBUG) console.log('👿 ?⊙⊙⊙⊙ MonsterCheck.checkForTagMatches() -> #'+ tag +" has",
														arr.length, 'MATCH(ES) ('+ arr +') randomly selecting:',
														MonsterData.dataById[randomMID].slug);
						// we have identified a match, let's handle the monster
						handleMatch(randomMID);
						break;
					}
				}
			}
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	A monster has been matched to page tags, either
	 *	1. add it to tally_nearby_monsters
	 *	2. or, if it is already "nearby", then determine if its stage will advance
	 */
	function handleMatch(mid) {
		try {
			//if (DEBUG) console.log('👿 ⊙⊙?⊙⊙ MonsterCheck.handleMatch() mid='+ mid);
			// if (mid && mid > 0 && tally_nearby_monsters && MonsterData.dataById[mid]){
			// 	if (DEBUG) console.log(" ... "+
			// 	MonsterData.dataById[mid].slug,
			// 	"stage="+tally_nearby_monsters[mid].stage);
			// }

			// will we add the monster
			let addMonster = false;

			// if the monster id does not exist in nearby_monsters
			if (!prop(tally_nearby_monsters[mid])) {
				// add it
				tally_nearby_monsters[mid] = Monster.create(mid);
			}
			// otherwise monster has been seen before
			else {
				// randomizer
				let r = Math.random();

				// change to 1 to test
				if (1){
					// test
					tally_nearby_monsters[mid].stage = 3;
					addMonster = true;

				// what stage are we at with this monster?
				} else if (tally_nearby_monsters[mid].stage == 0) {
					// do nothing
					Dialogue.showTrackerDialogue();
				} else if (tally_nearby_monsters[mid].stage == 1) {
					if (r < 0.1) {
						// go back to normal stage
						tally_nearby_monsters[mid].stage = 0;
						Dialogue.showStr("Want to give feedback? Click the survey button in the top-right menu.", "question");
					} else if (r < 0.4) {
						// random dialogue, but don't change stage
						Dialogue.showTrackerDialogue();
					} else if (r < 0.7) {
						// random dialogue, but don't change stage
						Dialogue.show(DialogueData.get(["monster", "far", null]), true);
					} else {
						// or prompt stage 2
						tally_nearby_monsters[mid].stage = 2;
						Dialogue.show(DialogueData.get(["monster", "close", null]), true);
					}
				} else if (tally_nearby_monsters[mid].stage == 2) {
					if (r < 0.2) {
						// do nothing
					} else if (r < 0.4) {
						// random dialogue, but don't change stage
						Dialogue.showTrackerDialogue();
					} else if (r < 0.7) {
						// random dialogue, but don't change stage
						Dialogue.show(DialogueData.get(["monster", "close", null]), true);
					} else {
						// or prompt stage 3 - add
						tally_nearby_monsters[mid].stage = 3;
						addMonster = true;
					}
				}
				// save to log after code above
				if (DEBUG) console.log('👿 ⊙⊙?⊙⊙ MonsterCheck.handleMatch() -> monster =', MonsterData.dataById[mid].slug, tally_nearby_monsters[mid]);
			}
			// set skin
			Skin.setStage(tally_nearby_monsters[mid].stage);
			// save monsters
			TallyStorage.saveData("tally_nearby_monsters",tally_nearby_monsters);
			// should we add the monster?
			if (addMonster) {
				currentMID = mid;
				// add monster to page
				Monster.add(mid);
			}
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Reset monster
	 */
	function reset(mid) {
		try {
			// reset one
			// if (tally_nearby_monsters[mid])
			// 	delete tally_nearby_monsters[mid];
			// reset them all
			tally_nearby_monsters = {};
			TallyStorage.saveData("tally_nearby_monsters",tally_nearby_monsters);
			// set the skin color
			Skin.setStage(0);
		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		check: check
	};
}());
