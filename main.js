//[]Fix the calculator so it can take multi-digit number inputs such as "35", "200", etc;
//[]Round answers with long decimals to fit on the screen
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
		display.placeholder = display.placeholder + ' ' + String(input);
	}
}

const buttons = document.querySelectorAll('button');
let numbersArray = [];
let operatorArray = [];
for (let i = 0; i < buttons.length; i++) {
	buttons[i].addEventListener('click', () => {
		//takes number inputs
		if (buttons[i].classList.contains('number')) {
			numbersArray.push(Number(buttons[i].textContent));
			displayContent(buttons[i].textContent);
			//takes operator inputs
		} else if (buttons[i].classList.contains('operator')) {
			operatorArray.push(buttons[i].textContent);
			displayContent(buttons[i].textContent);
			//clears the inputs if the clear input is selected
		} else if (buttons[i].classList.contains('clear')) {
			numbersArray.length = 0;
			displayContent('clear');
		} else if (buttons[i].classList.contains('equals')) {
			displayContent('clear');
			let calculated = operate(operatorArray, numbersArray);
			displayContent(calculated);
			numbersArray = [];
			numbersArray.push(calculated);
			operatorArray = [];
		} else {
			alert('ERROR');
		}
	});
}
