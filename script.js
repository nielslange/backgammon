let dice_one;
let dice_two;

function checkMove() {

}

function displayDice(number) {

	return `<img src="images/dice-${number}.png"> `;

}

function getDice() {

	const dice = document.querySelector('#dice');
	dice_one = Math.floor(Math.random() * 6) + 1;
	dice_two = Math.floor(Math.random() * 6) + 1;

	console.log(`${dice_one} | ${dice_two}`);

	dice.innerHTML = displayDice(dice_one) + ' ' + displayDice(dice_two);

}	

document.addEventListener('click', function (event) {

	if ( event.target.classList.contains( 'checker' ) ) {	
		const color = event.target.getAttribute('data-color');
		const checker = event.target.getAttribute('data-checker');
		const lane = event.target.parentElement.getAttribute('data-lane');
		console.log(`${lane}: ${color} → ${checker} | ${dice_one} | ${dice_two}`);
	}

	if ( event.target.classList.contains( 'roll' ) ) {
		getDice();
	}

	if ( event.target.classList.contains( 'reset' ) ) {
		location.reload();
	}

}, false);