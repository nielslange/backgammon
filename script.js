let diceOne;
let diceTwo;
let player = 'black';
let color;
let checker;
let lane;

function getCurrentColor(event) {
	return event.target.getAttribute('data-color');
}

function getCurrentChecker(event) {
	return Number.parseInt(event.target.getAttribute('data-checker'));
}

function getCurrentLane(event) {
	return Number.parseInt(event.target.parentElement.getAttribute('data-lane'));
}

function getTargetLane(currentPlayer, currentLane, dice) {

	let targetLane;

	if ( 'white' === currentPlayer ) {
		targetLane = currentLane + dice;
	} else {
		targetLane = currentLane - dice;
	}
	
	return targetLane;

}

function getTargetLaneCount(lane) {
	const data = document.querySelector(`[data-lane="${lane}"]`)
	
	if ( data ) return data.childElementCount;
}

function getTargetLaneColor(lane) {
	const data = document.querySelector(`[data-lane="${lane}"]`)
	const count = getTargetLaneCount(lane);

	if ( count ) return data.firstElementChild.dataset.color;
}

function getCurrentPlayer() {
	return player;
}

function swapPlayer() {
	player = 'white' === player ? 'black' : 'white';
}

function swapDices() {
	const color = getCurrentPlayer();
	const checkers = Array.prototype.slice.call(document.querySelectorAll('.checker'));

	checkers.map( checker => checker.style.cursor = color === checker.dataset.color ? 'pointer' : 'initial' );
}

function checkDice() {
	if ( ! diceOne || ! diceTwo ) {
		console.error('No dice had been rolled yet!');
	}
}

/**
 * Check if checker can be removed from the board.
 * 
 * If it's the turn of the white player, the checker can be removed if all 
 * checkers are located in tethe lanes 19-24. If it's the turn of the black
 * player, the checker can be removed if all checkers are located in the lanes
 * 1-6.
 * 
 * @param {String} currentPlayer The color of the current player.
 * @returns true or false depending if the checker can be removed.
 */
function canRemoveChecker(currentPlayer) {

	const checkers = Array.prototype.slice.call(document.querySelectorAll(`[data-color="${currentPlayer}"]`));
	let allowed = true;

	checkers.forEach( checker => {

		const lane = checker.parentElement.dataset.lane;

		if ( ( 'white' == currentPlayer && 19 > lane ) || ( 'black' == currentPlayer && 6 < lane ) ) {
			allowed = false;
		}

	} );

	return allowed;
}

function checkMove(event, dice) {

	currentPlayer		= getCurrentPlayer();
	currentLane			= getCurrentLane(event);
	currentchecker	= getCurrentChecker(event);
	currentColor		= getCurrentColor(event);
	targetLane 			= getTargetLane(currentPlayer, currentLane, dice);
	targetLaneCount	= getTargetLaneCount(targetLane);
	targetLaneColor	= getTargetLaneColor(targetLane);

	// Check if checkers can be removed.
	if ( 0 < targetLane || 24 > targetLane ) {
		// Move the checker if it can be removed.
		if ( canRemoveChecker(currentPlayer) ) {
			moveChecker();
		}
	}

	// Move checker if target lane is empty.
	if ( ! targetLaneCount ) {
		return moveChecker(currentchecker, targetLane);
	} 
	
	// Move checker if target lane only contains one checker.
	if ( 1 === targetLaneCount ) {
		return moveChecker(currentchecker, targetLane);
	}
	
	// Move checker if target lane contains less than 5 checkers of own color.
	if ( currentPlayer === targetLaneColor && 5 < targetLaneCount ) {
		return moveChecker(currentchecker, targetLane);
	}

	// Show error message that checker cannot be moved tio the target lane.
	showCheckerMoveError();
	
	console.log({currentPlayer});
	console.log({currentLane});
	console.log({currentchecker});
	console.log({currentColor});
	console.log({dice});
	console.log({targetLane});
	console.log({targetLaneCount});
	console.log({targetLaneColor});

}

function moveChecker(currentchecker, targetLane) {
	
}

function getDiceHint(diceOne, diceTwo) {

	let hint;

	if ( diceOne > diceTwo ) {
		hint = `${diceOne} + ${diceTwo}`;
	} else if ( diceOne < diceTwo ) {
		hint = `${diceTwo} + ${diceOne}`;
	} else {
		hint = `${diceOne} + ${diceOne} + ${diceOne} + ${diceOne}`;
	}

	return ` | <small>Hint: ${hint}</small>`;

}

function getPlayerHint() {
	return ` | <small>Player: ${player}</small>`;
}

function getDice() {

	const dice = document.querySelector('#dice');
	const faces = ['', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'];
	
	diceOne = faces[Math.floor(Math.random() * 6) + 1];
	diceTwo = faces[Math.floor(Math.random() * 6) + 1];

	diceOne = Math.floor(Math.random() * 6) + 1;
	diceTwo = Math.floor(Math.random() * 6) + 1;
	
	diceOne = 7;

	const diceHint = getDiceHint(diceOne, diceTwo);
	const playerHint = getPlayerHint();

	// dice.innerHTML = `${diceOne} ${diceTwo} ${diceHint} ${playerHint}`;
	
	dice.innerHTML = `${diceOne} ${diceTwo} ${playerHint}`;

}



document.addEventListener('click', function (event) {
	
	let currentPlayer = getCurrentPlayer();

	if ( event.target.classList.contains( currentPlayer ) ) {	
		checkMove(event, diceOne);
		// checkMove(event, diceTwo);
	}

	if ( event.target.classList.contains( 'roll' ) ) {
		swapPlayer();
		swapDices();
		getDice();
	}

	if ( event.target.classList.contains( 'reset' ) ) {
		location.reload();
	}

}, false);