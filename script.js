let diceOne;
let diceTwo;
let player = 'black';
let color;
let checker;
let lane;
let turns = 0;

function getCurrentColor( event ) {
	return event.target.getAttribute( 'data-color' );
}

function getCurrentChecker( event ) {
	return Number.parseInt( event.target.getAttribute( 'data-checker' ) );
}

function getCurrentLane( event ) {
	return Number.parseInt(
		event.target.parentElement.getAttribute( 'data-lane' )
	);
}

function getTargetLane( currentPlayer, currentLane, dice ) {
	let targetLane;

	if ( 'white' === currentPlayer ) {
		targetLane = currentLane + dice;
	} else {
		targetLane = currentLane - dice;
	}

	return targetLane;
}

function getTargetLaneCount( lane ) {
	const data = document.querySelector( `[data-lane="${ lane }"]` );

	if ( data ) return data.childElementCount;
}

function getTargetLaneColor( lane ) {
	const data = document.querySelector( `[data-lane="${ lane }"]` );
	const count = getTargetLaneCount( lane );

	if ( count ) return data.firstElementChild.dataset.color;
}

function getThrownCheckerCount () {
	const data = document.querySelector(`#thrown-${player}`);

	if ( data ) return data.childElementCount;
}

function getCurrentPlayer() {
	return player;
}

function getCurrentOpponent() {
	swapPlayer();
	const opponent = getCurrentPlayer();
	swapPlayer();

	return opponent;
}

function swapPlayer() {
	player = 'white' === player ? 'black' : 'white';
}

function swapDices() {
	const color = getCurrentPlayer();
	const checkers = Array.prototype.slice.call(
		document.querySelectorAll( '.checker' )
	);

	checkers.map(
		( checker ) =>
			( checker.style.cursor =
				color === checker.dataset.color ? 'pointer' : 'initial' )
	);
}

function resetTurns() {
	turns = 0;
}

function checkDice() {
	if ( ! diceOne || ! diceTwo ) {
		console.error( 'No dice had been rolled yet!' );
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
 * @param {string} currentPlayer The color of the current player.
 * @return true or false depending if the checker can be removed.
 */
function canRemoveChecker( currentPlayer ) {
	const checkers = Array.prototype.slice.call(
		document.querySelectorAll( `[data-color="${ currentPlayer }"]` )
	);
	let allowed = true;

	checkers.forEach( ( checker ) => {
		const lane = checker.parentElement.dataset.lane;

		if (
			( 'white' == currentPlayer && 19 > lane ) ||
			( 'black' == currentPlayer && 6 < lane )
		) {
			allowed = false;
		}
	} );

	return allowed;
}

function checkMove( event, dice ) {
	currentPlayer = getCurrentPlayer();
	currentLane = getCurrentLane( event );
	currentChecker = getCurrentChecker( event );
	currentColor = getCurrentColor( event );
	targetLane = getTargetLane( currentPlayer, currentLane, dice );
	targetLaneCount = getTargetLaneCount( targetLane );
	targetLaneColor = getTargetLaneColor( targetLane );
	thrownCheckerCount = getThrownCheckerCount();

	// console.log(
	// 	'---------------------------- START --------------------------'
	// );
	// console.log( { currentPlayer } );
	// console.log( { currentLane } );
	// console.log( { currentChecker } );
	// console.log( { currentColor } );
	// console.log( { dice } );
	// console.log( { targetLane } );
	// console.log( { targetLaneCount } );
	// console.log( { targetLaneColor } );
	// console.log(
	// 	'----------------------------- END ---------------------------'
	// );

	// Check if any checkers need to be brought back into the game.
	if ( thrownCheckerCount ) {
		return addChecker( currentChecker, dice );
	}

	// Check if checkers can be removed.
	if ( 0 < targetLane || 24 > targetLane ) {
		// Move the checker if it can be removed.
		if ( canRemoveChecker( currentPlayer ) ) {
			return moveChecker( currentChecker, targetLane );
		}
	}

	// Move checker if target lane is empty.
	if ( ! targetLaneCount ) {
		return moveChecker( currentChecker, targetLane );
	}

	// Move checker if target lane contains only one checker of the other color
	// and throw the other checker out.
	if ( currentPlayer !== targetLaneColor && 1 === targetLaneCount ) {
		return throwChecker( currentChecker, targetLane );
	}

	// Move checker if target lane contains less than 5 checkers of own color.
	if ( currentPlayer === targetLaneColor && 5 > targetLaneCount ) {
		return moveChecker( currentChecker, targetLane );
	}

	// Show error message that checker cannot be moved tio the target lane.
	showCheckerMoveError();
}

function moveChecker( currentChecker, targetLane ) {
	
	const checker = document.querySelector(
		`[data-checker="${ currentChecker }"]`
	);
	const lane = document.querySelector( `[data-lane="${ targetLane }"]` );

	lane.appendChild( checker );

	turns++;

}

function throwChecker( currentChecker, targetLane ) {
	const opponent = getCurrentOpponent();
	const lane = document.querySelector( `[data-lane="${ targetLane }"]` );
	const thrown = document.querySelector( `#thrown-${ opponent }` );

	while ( lane.firstChild ) {
		thrown.appendChild( lane.firstChild );		
	}

	return moveChecker( currentChecker, targetLane );

}

function isThrownChecker ( currentChecker ) {
	const thrown = Array.prototype.slice.call(document.querySelectorAll(`#thrown .${player}`));
	const result = thrown.filter( checker => { return currentChecker == checker.dataset.checker });

	return result.length;
}

function addChecker( currentChecker, dice ) {
	// If current checker is on the list of thrown checkers, bring it into the game.
	if ( isThrownChecker ( currentChecker ) ) {
		const targetLane = 'white' === player ? 0 + dice : 25 - dice;
		
		return moveChecker( currentChecker, targetLane );
	} 

	// If current checker is on the list of thrown checkers, show error message.
	showCheckerThrownError();
}

function showCheckerMoveError() {
	console.error( '❌ The checker cannot be moved to the wanted lane!' );
}

function showCheckerThrownError() {
	console.error( '❌ All thrown checkers need to be played first.' );
}

function showNextPlayerError() {
	console.error( '❌ It is the turn of the next player!' );
}

function getDiceHint() {
	let hint;

	if ( diceOne > diceTwo ) {
		hint = `${ diceOne } + ${ diceTwo }`;
	} else if ( diceOne < diceTwo ) {
		hint = `${ diceTwo } + ${ diceOne }`;
	} else {
		hint = `${ diceOne } + ${ diceOne } + ${ diceOne } + ${ diceOne }`;
	}

	return ` &nbsp; <small>Hint: ${ hint }</small>`;
}

function getPlayerHint() {
	return ` &nbsp; <small>Player: ${ player }</small>`;
}

function getDice() {
	const dice = document.querySelector( '#dice' );
	const faces = [ '', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣' ];

	diceOne = faces[ Math.floor( Math.random() * 6 ) + 1 ];
	diceTwo = faces[ Math.floor( Math.random() * 6 ) + 1 ];

	diceOne = Math.floor( Math.random() * 6 ) + 1;
	diceTwo = Math.floor( Math.random() * 6 ) + 1;

	diceOne = 1;
	diceTwo = 2;

	// const diceHint = getDiceHint( diceOne, diceTwo );
	const playerHint = getPlayerHint();

	dice.innerHTML = `${ diceOne } ${ diceTwo } ${ playerHint }`;
}

document.addEventListener(
	'click',
	function( event ) {
		const currentPlayer = getCurrentPlayer();

		if ( event.target.classList.contains( currentPlayer ) ) {
			if ( diceOne === diceTwo ) {
				switch ( turns ) {
					case 0:
						checkMove( event, diceOne );
						break;
					case 1:
						checkMove( event, diceOne );
						break;
					case 2:
						checkMove( event, diceOne );
						break;
					case 3:
						checkMove( event, diceOne );
						break;
					default:
						showNextPlayerError();
				}
			} else {
				switch ( turns ) {
					case 0:
						checkMove( event, diceOne );
						break;
					case 1:
						checkMove( event, diceTwo );
						break;
					default:
						showNextPlayerError();
				}
			}
		}

		if ( event.target.classList.contains( 'roll' ) ) {
			resetTurns();
			swapPlayer();
			swapDices();
			getDice();
		}

		if ( event.target.classList.contains( 'reset' ) ) {
			location.reload();
		}
	},
	false
);
