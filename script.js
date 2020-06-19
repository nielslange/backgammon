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

function getThrownCheckerCount() {
	const data = document.querySelector( `#thrown-${ player }` );

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

function swapChecker() {
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

function hasGameStarted() {
	return ! diceOne || ! diceTwo ? false : true;
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

	// Show error message that checker cannot be moved to the target lane.
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

function isThrownChecker( currentChecker ) {
	const thrown = Array.prototype.slice.call(
		document.querySelectorAll( `#thrown-${ player } .checker` )
	);
	const result = thrown.filter( ( checker ) => {
		return currentChecker == checker.dataset.checker;
	} );

	return result.length;
}

function addChecker( currentChecker, dice ) {

	console.log(isThrownChecker( currentChecker ));

	// If current checker is on the list of thrown checkers, bring it into the game.
	if ( isThrownChecker( currentChecker ) ) {
		const targetLane = 'white' === player ? 0 + dice : 25 - dice;
		targetLaneCount = getTargetLaneCount( targetLane );
		targetLaneColor = getTargetLaneColor( targetLane );

		console.log({currentPlayer});
		console.log({targetLaneColor});
		console.log({targetLaneCount});

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

		// Show error message that checker cannot be moved to the target lane.
		return showCheckerMoveError();
	}

	// If current checker is on the list of thrown checkers, show error message.
	showCheckerThrownError();
}

function showCheckerMoveError() {
	return showErrorMessage( 'This checker cannot be moved to the wanted lane!' );
}

function showCheckerThrownError() {
	return showErrorMessage( 'All thrown checkers need to be add first!' );
}

function showRollDiceError() {
	return showErrorMessage( 'You need to roll the dice first!' );
}

function showNotYourTurnError() {
	return showErrorMessage( 'It is not your turn yet!' );
}

function showNextPlayerError() {
	return showErrorMessage( 'It is not your turn anymore!' );
}

function showErrorMessage( message ) {
	const container = document.querySelector( '#message' );

	container.innerHTML = `
		<div class="alert alert-danger alert-dismissible fade show" role="alert">
			${ message }
			<button type="button" class="close" data-dismiss="alert" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
		</div>
	`;
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

	return ` &nbsp; Hint: ${ hint }`;
}

function getPlayerHint() {
	return ` &nbsp; ${ player.toUpperCase() }`;
}

function rollDice() {
	resetTurns();
	swapPlayer();
	swapChecker();

	// const faces = [ '', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣' ];
	// diceOne = faces[ Math.floor( Math.random() * 6 ) + 1 ];
	// diceTwo = faces[ Math.floor( Math.random() * 6 ) + 1 ];

	diceOne = Math.floor( Math.random() * 6 ) + 1;
	diceTwo = Math.floor( Math.random() * 6 ) + 1;

	diceOne = 1;
	diceTwo = 2;

	showDice( diceOne, diceTwo );
}

function swapDice() {
	let temp = diceOne;
	diceOne = diceTwo;
	diceTwo = temp;

	showDice( diceOne, diceTwo );
}

function showDice( diceOne, diceTwo ) {
	const dice = document.querySelector( '#dice' );
	const player = document.querySelector( '#player' );
	const playerHint = getPlayerHint();

	// Display dice.
	dice.innerHTML = `${ diceOne } | ${ diceTwo }`;

	// Display player.
	player.innerHTML = `${ playerHint }`;
}

function resetMessage() {
	const message = document.querySelector( '#message' );
	message.innerText = '';
}

document.addEventListener(
	'click',
	function( event ) {
		resetMessage();

		if ( event.target.classList.contains( 'checker' ) ) {
			if ( ! hasGameStarted() ) {
				return showRollDiceError();
			}

			if ( getCurrentOpponent() === getCurrentColor( event ) ) {
				return showNotYourTurnError();
			}

			if ( diceOne === diceTwo ) {
				switch ( turns ) {
					case 0:
					case 1:
					case 2:
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
			rollDice();
		}

		if ( event.target.classList.contains( 'swap' ) ) {
			swapDice();
		}

		if ( event.target.classList.contains( 'reset' ) ) {
			location.reload();
		}
	},
	false
);
