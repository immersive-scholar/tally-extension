"use strict";

/*  BATTLE
 ******************************************************************************/

window.Battle = (function() {
	// PRIVATE

	var _active = false,
		_logDelay = 1000,
		details = {
			"mid": null,
			"monsterName": "",
			"mostRecentAttack": "",
			"mostRecentDamage": ""
		};
		function getDetails() {
			return details;
		}
		// control state
		function active(state) {
			if (state != undefined && (state === true || state === false))
				_active = state;
			if (false) end();
			return _active;
		}



// initiate battle
// wait for user


	function test() {
		if (_active) return;
		if (tally_nearby_monsters.length < 1) return;
		let mid = randomObjKey(tally_nearby_monsters);
		//start(mid);
		start(224);
	}



	// start battle
	function start(mid) {
		console.log("Battle.start()", mid);
		if (_active) return;
		active(true);
		// intro sound
		Sound.playCategory('powerups', 'powerup1');
		// setup page for effects
		BattleEffect.setup();

		// move tally into position
		anime({
			targets: '#tally_character',
			left: "25%",
			top: "25%",
			elasticity: 0,
			duration: 1000,
			easing: 'easeOutCubic'
		});
		Thought.showString("Let's keep this tracker from getting our data!", "danger");

		// set monster details
		details.mid = mid;
		details.monsterName = MonsterData.dataById[mid].name + " monster";
		details.mostRecentAttack = "";
		details.mostRecentDamage = "";
		details.attacks = BattleAttack.returnRandomAttacks(3);

		// move monster into position
		Monster.display(mid);
		anime({
			targets: '.tally_monster_sprite_container',
			left: "60%",
			top: "10%",
			opacity:1,
			elasticity: 0,
			duration: 1000,
			easing: 'easeOutCubic'
		});

		// show console
		BattleConsole.show();
		setTimeout(function() {
			BattleConsole.log("Battle started with " + details.monsterName + "!");
			monsterAttackTally();
		}, 100);
	}


		var randomDamages = [
			"24 health",
			"6 accuracy"
		];
		var randomDamages = [
			"24 health",
			"6 accuracy"
		];


	function monsterAttackTally(extraDelay=0) {

		details.mostRecentAttack = randomObjKey(AttackData.data); //"spambash attack";
		details.mostRecentDamage = randomArrayIndex(randomDamages);
		// save as most recent attack

		setTimeout(function() {
			BattleAttack.fireProjectile("tally");
			BattleConsole.log(details.monsterName + " used the " + details.mostRecentAttack + "!");
			setTimeout(function() {
				BattleConsole.log("Tally lost " + details.mostRecentDamage + ".");
				setTimeout(function() {
					BattleConsole.log("What will Tally do?","showBattleOptions");
				}, _logDelay);
			}, _logDelay);
		}, _logDelay + extraDelay);
	}

	function tallyAttackMonster(extraDelay=0) {

		details.mostRecentAttack = randomObjKey(AttackData.data); //"spambash attack";
		details.mostRecentDamage = randomArrayIndex(randomDamages);

		// show buttons
		setTimeout(function() {
			BattleAttack.fireProjectile("monster");
			BattleConsole.log("Tally used the " + details.mostRecentAttack + "!");
			setTimeout(function() {
				BattleConsole.log(details.monsterName + " lost " + randomArrayIndex(randomDamages) );
				monsterAttackTally(1000);
			}, _logDelay);
		}, _logDelay + extraDelay);
	}







	// end battle
	function end() {
		BattleConsole.hide();
		_active = false;

		// move tally back
		anime({
			targets: '#tally_character',
			left: "0px",
			top: "90%",
			elasticity: 0,
			duration: 1000,
		});
		Thought.hide();
		anime({
			targets: '.tally_monster_sprite_container',
			top: "-500px",
			opacity:1,
			elasticity: 0,
			duration: 1000,
		});
	}





	// PUBLIC
	return {
		start: function(mid) {
			start(mid);
		},
		end: end,
		test: test,
		active: function(state) {
			return active(state);
		},
		monsterAttackTally: function(extraDelay) {
			monsterAttackTally(extraDelay);
		},
		tallyAttackMonster: function(extraDelay) {
			tallyAttackMonster(extraDelay);
		},
		details: details
	};
})();
