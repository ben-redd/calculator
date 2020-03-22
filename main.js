//[x]Fix the calculator so it can take multi-digit number inputs such as "35", "200", etc;
//[x]Round answers with long decimals to fit on the screen
//[x]Add a "." button so users can input decimal numbers
//[x]Add a backspace button so users can undo a miss click without clearing the entire display
//[x]Add Keyboard support (only if I'm really feeling adventurous)
//[x]Make it look good
//[] change display of NaN to ERROR when a number with multiple decimals is entered

const buttons = document.querySelectorAll('button');
let inputArr = [];
let numberCalculations; //this variable contains two arrays numberCalculations[0] contains all combined number inputs and numberCalculations[1] contains all operator inputs
for (let i = 0; i < buttons.length; i++) {
	buttons[i].addEventListener('click', () => {
		if (buttons[i].textContent !== '=' && buttons[i].textContent !== 'C' && buttons[i].textContent !== '⌫') {
			inputArr.push(buttons[i].textContent);
			displayInputs(inputArr);
		} else if (buttons[i].textContent === 'C') {
			inputArr = [];
			displayInputs(inputArr);
		} else if (buttons[i].textContent === '⌫') {
			inputArr.pop();
			displayInputs(inputArr);
		} else if (buttons[i].textContent === '=') {
			numberCalculations = combineInputs(inputArr);
			let calculated = operate(numberCalculations[1], numberCalculations[0]);
			inputArr = [];
			if (typeof calculated == 'string') {
				inputArr.push(calculated);
			} else {
				inputArr.push(round(calculated, 4));
			}
			displayInputs(inputArr);
		}
	});
}
document.addEventListener('keydown', (event) => {
	if (
		event.key === '+' ||
		event.key === '-' ||
		event.key === '.' ||
		event.key === '0' ||
		event.key === '1' ||
		event.key === '2' ||
		event.key === '3' ||
		event.key === '4' ||
		event.key === '5' ||
		event.key === '6' ||
		event.key === '7' ||
		event.key === '8' ||
		event.key === '9'
	) {
		inputArr.push(String(event.key));
		displayInputs(inputArr);
	} else if (event.key === '*') {
		inputArr.push('×');
		displayInputs(inputArr);
	} else if (event.key === '/') {
		inputArr.push('÷');
		displayInputs(inputArr);
	} else if (event.key === 'Backspace') {
		inputArr.pop();
		displayInputs(inputArr);
	} else if (event.key === 'c' || event.key === 'C') {
		inputArr = [];
		displayInputs(inputArr);
	} else if (event.key === 'Enter') {
		numberCalculations = combineInputs(inputArr);
		let calculated = operate(numberCalculations[1], numberCalculations[0]);
		inputArr = [];
		if (typeof calculated == 'string') {
			inputArr.push(calculated);
		} else if (calculated === NaN) {
			calculated = 'ERROR';
			inputArr.push(calculated);
		} else {
			inputArr.push(round(calculated, 4));
		}
		displayInputs(inputArr);
	}
});

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
	if (String(value).includes('.') && String(value).split('.')[1].length > 3) {
		return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
	} else return Number(value);
}

function operate(operators, numbers) {
	if (operators.length + 1 != numbers.length) {
		return 'ERROR';
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
			if (numbers[1] == 0) {
				return 'DIVIDE BY "0" ERROR';
			}
			updatedNum = division(numbers[0], numbers[1]);
			numbers.splice(0, 2, updatedNum);
		}
	}
	return numbers[0];
}

//combines multiple inputs to make up larger numbers and returns the combined array
function combineInputs(inputs) {
	let combinedNumArr = [];
	let operatorArr = [];
	let startJoin = 0;
	for (let i = 0; i < inputs.length; i++) {
		if (inputs[i] === '+' || inputs[i] === '-' || inputs[i] === '×' || inputs[i] === '÷') {
			let nextElement = inputs.slice(startJoin, i).join('');
			combinedNumArr.push(Number(nextElement));
			startJoin = i + 1;
			operatorArr.push(inputs[i]);
		} else if (i === inputs.length - 1) {
			let lastElement = inputs.slice(startJoin, i + 1).join('');
			combinedNumArr.push(Number(lastElement));
		}
	}
	let finalArr = [ combinedNumArr, operatorArr ];
	return finalArr;
}

function displayInputs(inputs) {
	let display = document.querySelector('#display');
	let text = '';
	for (let i = 0; i < inputs.length; i++) {
		if (inputs[i] === '+' || inputs[i] === '-' || inputs[i] === '×' || inputs[i] === '÷') {
			text = text + ' ' + inputs[i] + ' ';
		} else {
			text = text + inputs[i];
		}
	}
	display.placeholder = text;
}
