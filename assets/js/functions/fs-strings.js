"use strict";

/*  STRING FUNCTIONS
 ******************************************************************************/


/**
 *	Typewriter effect
 */
function typeWriter(ele, str, i, caller) {
	//console.log(ele, str, i);
	if (!document.getElementById(ele)) return;
	if (i < str.length) {
		document.getElementById(ele).innerHTML += str.charAt(i);
		setTimeout(function() {
			typeWriter(ele, str, ++i, caller);
		}, 30);
	}
 	else {
		if (caller == "BattleConsole") {
			// add a little time at the end of each line
			setTimeout(function() {
				BattleConsole.active(false);
				// text is done writing so color it
				BattleConsole.colorText(ele);
			}, 250);
		}
	}
}


/**
 *	Trim a string to length
 */
function trimStr(str, length) {
	return str.length > length ? str.substring(0, length - 3) + "&hellip;" : str;
}

/**
 * Clean a string of punctuation, commas, etc, return as array
 */
function cleanStringReturnTagArray(str = "") {
	var arr = [];
	// clean
	str = str.replace(/[.,\/#\"\'!$%\^&\*;:{}=\-_`~()\[\]]/g, " ") // remove punctuation
		.replace(/[0-9]/g, '') // remove numbers
		.replace(/\s\s+/g, ' ') // remove multiple (white)spaces
		.toLowerCase() // convert to lowercase
		.trim();
	// if chars left then split into array
	if (str.length > 0)
		arr = str.split(" ");
	//console.log( JSON.stringify(arr) )
	return arr;
}

function isVowel(x) {
	return /[aeiouAEIOU]/.test(x);
}

function ucFirst(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function removeStopWords(str = null, wordArr = null) {
	var common = stopWords();
	if (wordArr === null) // allow str or arrays
		wordArr = str.match(/\w+/g);
	var commonObj = {},
		uncommonArr = [],
		word, i;
	for (i = 0; i < common.length; i++) {
		commonObj[common[i].trim()] = true;
	}
	for (i = 0; i < wordArr.length; i++) {
		word = wordArr[i].trim().toLowerCase();
		if (!commonObj[word]) {
			uncommonArr.push(word);
		}
	}
	return uncommonArr;
}

function stopWords() {
	// http://geeklad.com/remove-stop-words-in-javascript
	return ['a', 'about', 'above', 'across', 'after', 'again', 'against', 'all', 'almost', 'alone', 'along', 'already', 'also',
		'although', 'always', 'among', 'an', 'and', 'another', 'any', 'anybody', 'anyone', 'anything', 'anywhere', 'are', 'area',
		'areas', 'around', 'as', 'ask', 'asked', 'asking', 'asks', 'at', 'away', 'b', 'back', 'backed', 'backing', 'backs', 'be', 'became',
		'because', 'become', 'becomes', 'been', 'before', 'began', 'behind', 'being', 'beings', 'best', 'better', 'between', 'big',
		'both', 'but', 'by', 'c', 'came', 'can', 'cannot', 'case', 'cases', 'certain', 'certainly', 'clear', 'clearly', 'come', 'could',
		'd', 'did', 'differ', 'different', 'differently', 'do', 'does', 'done', 'down', 'down', 'downed', 'downing', 'downs', 'during',
		'e', 'each', 'early', 'either', 'end', 'ended', 'ending', 'ends', 'enough', 'even', 'evenly', 'ever', 'every', 'everybody',
		'everyone', 'everything', 'everywhere', 'f', 'face', 'faces', 'fact', 'facts', 'far', 'felt', 'few', 'find', 'finds', 'first',
		'for', 'four', 'from', 'full', 'fully', 'further', 'furthered', 'furthering', 'furthers', 'g', 'gave', 'general', 'generally',
		'get', 'gets', 'give', 'given', 'gives', 'go', 'going', 'good', 'goods', 'got', 'great', 'greater', 'greatest', 'group',
		'grouped', 'grouping', 'groups', 'h', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'herself', 'high', 'high', 'high',
		'higher', 'highest', 'him', 'himself', 'his', 'how', 'however', 'i', 'if', 'important', 'in', 'interest', 'interested',
		'interesting', 'interests', 'into', 'is', 'it', 'its', 'itself', 'j', 'just', 'k', 'keep', 'keeps', 'kind', 'knew', 'know',
		'known', 'knows', 'l', 'large', 'largely', 'last', 'later', 'latest', 'least', 'less', 'let', 'lets', 'like', 'likely', 'long',
		'longer', 'longest', 'm', 'made', 'make', 'making', 'man', 'many', 'may', 'me', 'member', 'members', 'men', 'might', 'more',
		'most', 'mostly', 'mr', 'mrs', 'much', 'must', 'my', 'myself', 'n', 'necessary', 'need', 'needed', 'needing', 'needs', 'never',
		'new', 'new', 'newer', 'newest', 'next', 'no', 'nobody', 'non', 'noone', 'not', 'nothing', 'now', 'nowhere', 'number', 'numbers',
		'o', 'of', 'off', 'often', 'old', 'older', 'oldest', 'on', 'once', 'one', 'only', 'open', 'opened', 'opening', 'opens', 'or',
		'order', 'ordered', 'ordering', 'orders', 'other', 'others', 'our', 'out', 'over', 'p', 'part', 'parted', 'parting', 'parts',
		'per', 'perhaps', 'place', 'places', 'point', 'pointed', 'pointing', 'points', 'possible', 'present', 'presented',
		'presenting', 'presents', 'problem', 'problems', 'put', 'puts', 'q', 'quite', 'r', 'rather', 'really', 'right', 'right', 'room',
		'rooms', 's', 'said', 'same', 'saw', 'say', 'says', 'second', 'seconds', 'see', 'seem', 'seemed', 'seeming', 'seems', 'sees',
		'several', 'shall', 'she', 'should', 'show', 'showed', 'showing', 'shows', 'side', 'sides', 'since', 'small', 'smaller',
		'smallest', 'so', 'some', 'somebody', 'someone', 'something', 'somewhere', 'state', 'states', 'still', 'still', 'such', 'sure',
		't', 'take', 'taken', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'therefore', 'these', 'they', 'thing', 'things',
		'think', 'thinks', 'this', 'those', 'though', 'thought', 'thoughts', 'three', 'through', 'thus', 'to', 'today', 'together',
		'too', 'took', 'toward', 'turn', 'turned', 'turning', 'turns', 'two', 'u', 'under', 'until', 'up', 'upon', 'us', 'use', 'used',
		'uses', 'v', 'very', 'w', 'want', 'wanted', 'wanting', 'wants', 'was', 'way', 'ways', 'we', 'well', 'wells', 'went', 'were', 'what',
		'when', 'where', 'whether', 'which', 'while', 'who', 'whole', 'whose', 'why', 'will', 'with', 'within', 'without', 'work',
		'worked', 'working', 'works', 'would', 'x', 'y', 'year', 'years', 'yet', 'you', 'young', 'younger', 'youngest', 'your', 'yours', 'z',
		//
		"ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've",
		// mine
		"ages", "generations", "carefully", "page", "directly", "description", "test", "title", "keywords"
	];
}



// remove small words
// count down so no skipping occurs
function removeSmallWords(arr) {
	for (var i = arr.length - 1; i >= 0; i--) {
		if (arr[i].length < 3)
			arr.splice(i, 1);
	}
	return arr;
}





/**
 *	Insert stylesheet for CSS3 animations
 *	credit: https://stackoverflow.com/a/43904152/441878
 */
let sheets = document.styleSheets,
	style = document.createElement('style'),
	addKeyFrames = null;
style.appendChild(document.createTextNode(""));
document.head.appendChild(style);
if (CSS && CSS.supports && CSS.supports('animation: name')) {
	// we can safely assume that the browser supports unprefixed version.
	addKeyFrames = function(name, frames) {
		let sheet = sheets[sheets.length - 1];
		sheet.insertRule(
			"@keyframes " + name + "{" + frames + "}");
	};
}
