//[x]Fix the calculator so it can take multi-digit number inputs such as "35", "200", etc;
//[x]Round answers with long decimals to fit on the screen
//[]Add a "." button so users can input decimal numbers
//[]Add a backspace button so users can undo a miss click without clearing the entire display
//[]Add Keyboard support (only if I'm really feeling adventurous)
//[]Make it look good
function addition(num1, num2) {
	return num1 + num2;
}
function subtraction(num1, num2) {
	return num1 - num2;
}
function multiplication(num1, num2) {
	return num1 * num2;
}
function division(num1, num2) {
	return num1 / num2;
}

function round(value, decimals) {
	if (String(value.split('.')[1]).length > 3) {
		return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
	} else return Number(value);
}

function operate(operators, numbers) {
	if (operators.length + 1 != numbers.length) {
		return 'Error';
	}
	const firstNum = numbers[0];
	for (let i = 0; i < operators.length; i++) {
		let updatedNum;
		if (operators[i] === '+') {
			updatedNum = addition(numbers[0], numbers[1]);
			numbers.splice(0, 2, updatedNum);
		} else if (operators[i] === '-') {
			updatedNum = subtraction(numbers[0], numbers[1]);
			numbers.splice(0, 2, updatedNum);
		} else if (operators[i] === '×') {
			updatedNum = multiplication(numbers[0], numbers[1]);
			numbers.splice(0, 2, updatedNum);
		} else if (operators[i] === '÷') {
			if (numbers[1] === 0) {
				return 'DIVIDE BY "0" ERROR';
			}
			updatedNum = division(numbers[0], numbers[1]);
			numbers.splice(0, 2, updatedNum);
		}
	}
	return numbers[0];
}

//displays inputs in the display screen of the calculator
const display = document.querySelector('#display');
function displayContent(input) {
	if (input === 'clear') {
		display.placeholder = '';
	} else {
		// display.placeholder = display.placeholder + String(input);
		let displayText = '';
		for (let i = 0; i < input.length; i++) {
			displayText = displayText + input[i] + ' ';
		}
		display.placeholder = displayText;
	}
}

const buttons = document.querySelectorAll('button');
let numbersArray = [];
let operatorArray = [];
let buttonsClicked = [];
for (let i = 0; i < buttons.length; i++) {
	buttons[i].addEventListener('click', () => {
		//takes number inputs
		if (buttons[i].classList.contains('number')) {
			//this if statement determines if the last input was a number or operator. If it was a number it simply adds to it e.g. lastNum was 3 and the next input is 3 turns into 33.
			if (buttonsClicked.length > 0 && typeof buttonsClicked[buttonsClicked.length - 1] === 'number') {
				numbersArray[numbersArray.length - 1] = Number(
					String(numbersArray[numbersArray.length - 1]) + buttons[i].textContent
				);
				buttonsClicked[buttonsClicked.length - 1] = Number(
					String(buttonsClicked[buttonsClicked.length - 1]) + buttons[i].textContent
				);
				displayContent(buttonsClicked);
			} else {
				numbersArray.push(Number(buttons[i].textContent));
				buttonsClicked.push(Number(buttons[i].textContent));
				displayContent(buttonsClicked);
			}
			//takes operator inputs
		} else if (buttons[i].classList.contains('operator')) {
			operatorArray.push(buttons[i].textContent);
			buttonsClicked.push(buttons[i].textContent);
			displayContent(buttonsClicked);
			//clears the inputs if the clear input is selected
		} else if (buttons[i].classList.contains('clear')) {
			numbersArray.length = 0;
			operatorArray.length = 0;
			buttonsClicked.length = 0;
			displayContent('clear');
		} else if (buttons[i].classList.contains('equals')) {
			displayContent('clear');
			let calculated = operate(operatorArray, numbersArray);
			let rounded = round(String(calculated), 4);
			numbersArray = [];
			numbersArray.push(rounded);
			buttonsClicked = [];
			buttonsClicked.push(rounded);
			displayContent(buttonsClicked);
			operatorArray = [];
		} else {
			alert('ERROR');
		}
	});
}
