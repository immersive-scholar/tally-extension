"use strict";

/*  (BATTLE) CONSOLE
 ******************************************************************************/

window.BattleConsole = (function() {
	// PRIVATE
	var stream, logId, _active, _queue, _next;

	// reset all vars
	function reset() {
		_next = "";
		stream = "";
		logId = 0;
		_active = false;
		_queue = [];
	}


	// display the console
	function display() {
		reset();
		var str = "<div id='battle-console-inner' class='tally shadow-box-inner'>" +
			"<div class='tally' id='battle-console-stream'></div>" +
			"</div>";
		$("#battle-console").html(str);
		$("#battle-console").css({
			"display": "block",
			"top": window.innerHeight + "px"
		});
		// move it into position
		anime({
			targets: '#battle-console',
			top: "75%",
			elasticity: 0,
			duration: 1000,
			easing: 'easeOutCubic'
		});
	}
	// hide the console
	function hide() {
		anime({
			targets: '#battle-console',
			top: "130%",
			elasticity: 0,
			duration: 1000,
			easing: 'easeOutCubic'
		});
	}
	// control state
	function active(state) {
		if (state != undefined && (state === true || state === false))
			_active = state;
		return _active;
	}
	// log to the console
	function log(_str,next="") {
		if (!Battle.active) return;
		// add a "next" function
		if (next) _next = next;
		// add to end of _queue
		_queue.push(_str);
		// start/make sure queueChecker is running
		queueChecker();
	}

	function queueChecker() {
		//console.log("queueChecker()", _queue, _active);
		// if no items in _queue then stop
		if (_queue.length < 1) {
			// start animating cursor
			$("#battle-console-stream:last-child:after").removeClass("noanimation");
			return;
		}
		// else, if not currently active then start a new one
		if (!_active) {
			writeNextInQueue();
			// stop animating cursor
			$("#battle-console-stream:last-child:after").addClass("noanimation");
		}
		// check again in a bit in case there are more
		setTimeout(function() {
			queueChecker();
		}, 200);
	}

	function writeNextInQueue(lineSpeed = 150) {
		//if(DEBUG) console.log("writeNextInQueue()", _queue, _active);
		// if currently active, stop
		if (_active) return;
		// set active state
		active(true);
		// remove first element in array
		var str = _queue.shift();
		//if(DEBUG) console.log("writeNextInQueue()", str, _queue, _active);
		// insert placeholder
		var ele = "<div class='tally tally_log_line'>"+
			  	  "<span id='tally_log" + (++logId) + "' class='tally_log_cursor'></span>"+
				  "</div>";
		$("#battle-console-stream").append(ele);
		// make sure it exists first
		if (!$('#battle-console-stream')[0]) return;
		// scroll to new placeholder
		$('#battle-console-stream').stop().animate({
			scrollTop: $('#battle-console-stream')[0].scrollHeight
		}, 800);
		// insert text
		setTimeout(function() {
			typeWriter("tally_log" + logId, str, 0);
		}, lineSpeed);
		//console.log(stream);
	}

	function showBattleOptions(lineSpeed = 150) {
		//console.log("showBattleOptions() step 1", _active);
		// if currently active, stop
		if (_active) return;
		// set active state
		active(true);

		var tallyAttacks = Battle.details.tallyAttacks;

		var str = "<div class='battle-options-row'>";
		for(var key in tallyAttacks){
			console.log(tallyAttacks[key]);
			str += "<span class='battle-options'>"+ tallyAttacks[key].name +"</span>";
		}
		str += "<span class='battle-options-esc'>run [esc]</span></div>";


		//console.log("showBattleOptions() step 2", str, _queue,_active);

		// insert placeholder
		var ele = "<div class='tally tally_log_line'>"+
					  "<span id='tally_log" + (++logId) + "' class='tally_log_cursor'>"+
					  	  str +
					  "</span>"+
				  "</div>";
		$("#battle-console-stream").append(ele);
		// make sure it exists first
		if (!$('#battle-console-stream')[0]) return;
		// scroll to new placeholder
		$('#battle-console-stream').stop().animate({
			scrollTop: $('#battle-console-stream')[0].scrollHeight
		}, 800);
		// release active state
		active(false);
	}

	/**
	 *	Typewriter effect
	 */
	function typeWriter(ele, str, i) {
		//console.log(ele, str, i);
		if (!document.getElementById(ele)) return;
		if (i < str.length) {
			document.getElementById(ele).innerHTML += str.charAt(i);
			setTimeout(function() {
				typeWriter(ele, str, ++i);
			}, 30);
		}
	 	else {
			BattleConsole.lineComplete(ele);
		}
	}

	/**
	 *	Called after each line is complete
	 */
	function lineComplete(ele){
		// add a little time at the end of each line
		setTimeout(function() {
			active(false);
			// text is done writing so color it
			colorText(ele);
			// if queue is empty and there is a next string
			if (_queue.length < 1 && _next != ""){
				if (_next == "showBattleOptions"){
					//console.log(_next);
					showBattleOptions();
				}
				_next = "";
			}
		}, 250);
	}

	function colorText(ele) {
		var str = $("#" + ele).html();
		if (str == undefined) return;
		//console.log(str);
		str = str.replace("Tally", "<span class='text-tally'>Tally</span>");
		str = str.replace(Battle.details.monsterName, "<span class='text-green'>" + Battle.details.monsterName + "</span>");
		str = str.replace(Battle.details.mostRecentAttack, "<span class='text-yellow'>" + Battle.details.mostRecentAttack + "</span>");
		str = str.replace(Battle.details.mostRecentDamage, "<span class='text-blue'>" + Battle.details.mostRecentDamage + "</span>");
		$("#" + ele).html(str);
	}







	// PUBLIC
	return {
		display: display,
		hide: hide,
		log: function(str,next) {
			log(str,next);
		},
		active: function(state) {
			return active(state);
		},
		lineComplete: function(ele) {
			lineComplete(ele);
		},
		colorText: function(ele) {
			colorText(ele);
		}
	};
})();
