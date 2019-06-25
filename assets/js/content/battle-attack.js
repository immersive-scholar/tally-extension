"use strict";

/*  BATTLE
 ******************************************************************************/

window.BattleAttack = (function() {
	// PRIVATE

	let _logDelay = 1000,
		DEBUG = true,
		outcomeDetails = {
			"selfName": "",
			"oppName": "",
			"outcomes": []
		};


	/**
	 * 	Get outcomeDetails
	 */
	function getOutcomeDetails() {
		try {
			return outcomeDetails;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 *	Perform the attack
	 */
	function doAttack(attack, selfStr, oppStr, extraDelay = 0) {
		try {
			if (DEBUG) console.log("\n\n💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥");
			if (DEBUG) console.log("💥💥💥💥💥 ", selfStr + " 🧨 " + oppStr, "💥💥💥💥💥");
			if (DEBUG) console.log("💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥");
			if (DEBUG) console.log("💥 Battle.doAttack()", attack, extraDelay);

			// is an attack already in progress?
			if (Battle.details.attackInProgress) {
				if (DEBUG) console.warn("💥 Battle.doAttack() AN ATTACK IS ALREADY IN PROGRESS", Battle.details);
				return;
			}
			// set attack in progress
			else Battle.details.attackInProgress = true;

			// save attack
			Battle.details.recentAttack = attack;
			// set details for logging
			outcomeDetails = {
				"selfName": "Tally",
				"oppName": Battle.details.monsterName,
				"outcomes": {} // reset
			};
			// unless self == monster
			if (selfStr === "monster") {
				outcomeDetails.selfName = Battle.details.monsterName;
				outcomeDetails.oppName = "Tally";
			}

			// 1. show lurch from launching attack
			if (selfStr == "tally")
				BattleEffect.showAttackLurch("#tally_character_inner", 1);
			else if (selfStr == "monster")
				BattleEffect.showAttackLurch(".tally_monster_sprite", -1);

			// 2. do battle math, return [] and save outcomes
			outcomeDetails.outcomes = BattleMath.returnAttackOutcomes(attack, selfStr, oppStr);

			// 3. update stats display for player who is did attack (really just stamina)
			StatsDisplay.updateDisplay(selfStr);

			// 4. log the attack
			BattleConsole.log(outcomeDetails.selfName + " used the " + attack.name + " " + attack.type + "!");

			// 5. start attack effects
			BattleEffect.startAttackEffects(attack, selfStr, oppStr, "small");

		} catch (err) {
			console.log(err);
		}
	}

	/**
	 *	Perform the attack
	 */
	function handleAttackOutcomes(attack, selfStr, oppStr) {
		try {
			if (DEBUG) console.log("💥 Battle.handleAttackOutcomes()", attack, outcomeDetails.outcomes, selfStr, oppStr);

			// is an attack not in progress ATM?
			if (!Battle.details.attackInProgress) return;

			let positiveOutcomeTally = null;


			// 1. what is the result of the attack?

			// ATTACK MISSED
			if (outcomeDetails.outcomes === "missed") {
				// go to next turn...
				nextAttackPrompt(selfStr, "The attack <span class='text-blue'>missed</span>!");
			}
			// ATTACK HAD NO EFFECT
			else if (outcomeDetails.outcomes === "noEffect") {
				// go to next turn...
				nextAttackPrompt(selfStr, "The attack <span class='text-blue'>had no effect</span>.");
			}
			// ATTACK RESULTED IN INCREASE OR DECREASE IN STATS
			else if (outcomeDetails.outcomes.length > 0) {


				// 2. loop through attack outcomes and log, show explosion, etc.
				for (let i = 0; i < outcomeDetails.outcomes.length; i++) {
					/*jshint loopfunc: true */

					if (DEBUG) console.log("💥 Battle.handleAttackOutcomes() -> outcomeDetails.outcomes[i]=", outcomeDetails.outcomes[i]);

					// if number is 0 skip this one
					if (outcomeDetails.outcomes[i].change == 0) continue;


					// 3. create log

					// add name to log text first
					let str = "Tally";
					outcomeDetails.outcomes[i].affectsName = "tally";
					// tally is default unless one of these are true
					if (selfStr == "tally") {
						if (outcomeDetails.outcomes[i].affects == "opp") {
							outcomeDetails.outcomes[i].affectsName = "monster";
							str = Battle.details.monsterName;
						}
					} else if (selfStr == "monster") {
						if (outcomeDetails.outcomes[i].affects == "self") {
							outcomeDetails.outcomes[i].affectsName = "monster";
							str = Battle.details.monsterName;
						}
					}
					// was the stat decreased?
					if (outcomeDetails.outcomes[i].change < 0) {
						// change value for log
						str += " lost <span class='text-blue'>" + (outcomeDetails.outcomes[i].change *= -1) + " " + outcomeDetails.outcomes[i].stat + "</span>.";
						// determine what tally says
						if (oppStr === "tally") {
							positiveOutcomeTally = false;
							// show lurch and damage from recieving attack
							BattleEffect.showAttackLurch("#tally_character_inner", -1);
							BattleEffect.showDamage("#tally_character_inner", 500);
						} else if (oppStr === "monster") {
							// show lurch and damage from recieving attack
							BattleEffect.showAttackLurch(".tally_monster_sprite", 1);
							BattleEffect.showDamage(".tally_monster_sprite", 500);
						}
					}
					// or increased?
					else if (outcomeDetails.outcomes[i].change > 0) {
						str += " gained <span class='text-blue'>" + outcomeDetails.outcomes[i].change + " " + outcomeDetails.outcomes[i].stat + "</span>.";
						if (selfStr == "tally") positiveOutcomeTally = true;
					} else {
						// no change, continue to next outcome
					}

					// show log and change in stats after a moment
					setTimeout(function() {
						if (DEBUG) console.log("💥 Battle.handleAttackOutcomes() str=", str);
						// show log
						BattleConsole.log(str);
						// update stats display for player who is affected
						StatsDisplay.updateDisplay(outcomeDetails.outcomes[i].affectsName);

						// show thought from Tally commenting on the outcome of last attack
						let r = Math.random();
						if (r > 0.7) {
							// show log and change in stats after a moment
							setTimeout(function() {
								if (positiveOutcomeTally == true)
									Thought.showThought(Thought.getThought(["battle", "gained-stats", 0]), true);
								else if (positiveOutcomeTally == false)
									Thought.showThought(Thought.getThought(["battle", "lost-stats", 0]), true);
							}, _logDelay + 300);
						}
					}, _logDelay + 300);
				}

				checkForEnd(selfStr, oppStr);
			}
		} catch (err) {
			console.log(err);
		}
	}



	/**
	 * 	Did someone win?
	 */
	function checkForEnd(selfStr, oppStr) {
		try {
			if (DEBUG) console.log("💥 Battle.checkForEnd()");

			// is an attack not in progress ATM?
			if (!Battle.details.attackInProgress) return;

			let endBattle = false,
				endBattleMessage = "";

			// 1. update battle progress

			// is battle close to being over?
			if (Stats.get("tally").health.val <= (Stats.get("tally").health.max / 2) ||
				Stats.get("monster").health.val <= (Stats.get("monster").health.max / 2)
			) {
				Battle.details.progress = "middle";
			}
			if (Battle.details.progress === "middle") {
				//Sound.changeMusic('battle1-c-sharp.wav');
				Thought.showString("Whoa, this is getting intense!", null, true);
			}

			// 2. check for winner

			// did tally lose?
			if (Stats.get("tally").health.val <= 0) {
				Thought.showString("Oh no, we are out of health...", "sad", true);
				endBattle = true;
				endBattleMessage = "We need to take a break from the internet and recharge!";
				BattleConsole.log("Tally's health has been depleted. Tally loses.");
			} else if (Stats.get("tally").stamina.val <= 0) {
				Thought.showString("Oh no, our stamina is all gone...", "sad", true);
				endBattle = true;
				endBattleMessage = "We lost this time but we'll fight these trackers another day!";
				BattleConsole.log("Tally's stamina has been depleted. Tally loses.");
			}
			// did tally win?
			else if (Stats.get("monster").health.val <= 0) {
				Thought.showString("Yay, the monster is out of health...", "happy", true);
				endBattle = true;
				endBattleMessage = "";
				BattleConsole.log("The monster's health has been depleted. The " + Battle.details.monsterName + " loses.");
			} else if (Stats.get("monster").stamina.val <= 0) {
				Thought.showString("Awesome! The monster has no stamina left...", "happy", true);
				endBattle = true;
				endBattleMessage = "";
				BattleConsole.log("The monster's stamina has been depleted. The " + Battle.details.monsterName + " loses.");
			}


			// 3. check if battle over
			if (endBattle) {
				setTimeout(function() {
					// show final thought
					Thought.showString(endBattleMessage, "neutral", true);
					setTimeout(function() {
						Battle.end();
					}, _logDelay + 2000);
				}, _logDelay + 4000);
			}
			// else keep fighting!
			else {
				// go to next turn...
				nextAttackPrompt(selfStr);
			}
		} catch (err) {
			console.error(err);
		}

	}





	/**
	 * 	Determine and prompt who gets next attack
	 */
	function nextAttackPrompt(selfStr, message = "") {
		try {
			// allow a new attack to happen
			Battle.details.attackInProgress = false;

			// show log
			if (message !== "") BattleConsole.log(message);

			// decide who gets next turn...
			if (selfStr == "tally") {
				// monster will attack back in a moment
				setTimeout(function() {
					doAttack(FS_Object.randomObjProperty(Battle.details.monsterAttacks), "monster", "tally");
				}, _logDelay + 3500);
			} else {
				// prompt user to attack in a moment
				setTimeout(function() {
					// turn control back to player
					BattleConsole.log("What will Tally do?", "showBattleOptions");
				}, _logDelay + 500);
			}
		} catch (err) {
			console.error(err);
		}
	}



	/**
	 *	Reward Tally with a new attack
	 */
	function rewardAttack() {
		try {
			// get random attack
			let attack = AttackData.returnAttack();
			console.log("🕗 TallyEvents.checkTutorialEvents() --> awardFirstAttack", attack);

			// make sure tally doesn't already have that attack
			while (prop(tally_user.attacks[attack.name]))
				// if so get a new one
				attack = AttackData.returnAttack();

			// store and save
			tally_user.attacks[attack.name] = attack;
			TallyStorage.saveData('tally_user', tally_user);

			// tell user
			Thought.showString("You earned the " + attack.name + " " + attack.type + "!", "happy");
		} catch (err) {
			console.error(err);
		}
	}


	// PUBLIC
	return {
		doAttack: function(attack, self, opp, extraDelay) {
			doAttack(attack, self, opp, extraDelay);
		},
		handleAttackOutcomes: function(attack, selfStr, oppStr) {
			handleAttackOutcomes(attack, selfStr, oppStr);
		},
		getOutcomeDetails: function() {
			return getOutcomeDetails();
		},
		rewardAttack: rewardAttack
	};
})();
