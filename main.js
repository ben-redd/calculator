// [] Bug: press 3 with the mouse, then with the keyboard type + 54. Gives the value 573

//adds event listeners for button support
//const buttons = document.querySelectorAll('button:not(#display)');
const digits = document.querySelectorAll('.numberButtons');
const operators = document.querySelectorAll('.operatorButtons');
const deletions = document.querySelectorAll('.deletions');
let inputArr = [];
let numberCalculations; //this variable contains two arrays numberCalculations[0] contains all combined number inputs and numberCalculations[1] contains all operator inputs

for (let i = 0; i < digits.length; i++) {
	digits[i].addEventListener('click', (e) => {
		if (validate(e.target.dataset.digit)) {
			inputArr.push(e.target.dataset.digit);
			displayInputs(inputArr);
			console.log(inputArr);
		}
	});
}
for (let i = 0; i < operators.length; i++) {
	operators[i].addEventListener('click', (e) => {
		if (e.target.dataset.operator === '=') {
			let calculated = calcFromPostFix(shunting(combineInputs(inputArr)));
			inputArr = [];
			//for if there is an error with a string message
			if (typeof calculated == 'string') {
				inputArr.push(calculated);
				//if things have gone according to plan and a number output needs to be pushed to the display
			} else {
				inputArr.push(round(calculated, 4));
			}
			displayInputs(inputArr);
		} else {
			if (validate(operators[i].dataset.operator)) {
				inputArr.push(operators[i].dataset.operator);
				displayInputs(inputArr);
				console.log(inputArr);
			}
		}
	});
}
for (let i = 0; i < deletions.length; i++) {
	deletions[i].addEventListener('click', (e) => {
		if (e.target.dataset.deleter === 'clear') {
			inputArr = [];
			displayInputs(inputArr);
		} else {
			inputArr.pop();
			displayInputs(inputArr);
		}
	});
}

//OLD CODE USING TEXTCONTENT
// for (let i = 0; i < buttons.length; i++) {
// 	buttons[i].addEventListener('click', () => {
// 		if (buttons[i].textContent !== '=' && buttons[i].textContent !== 'C' && buttons[i].textContent !== '⌫') {
// 			inputArr.push(buttons[i].textContent);
// 			displayInputs(inputArr);
// 		} else if (buttons[i].textContent === 'C') {
// 			inputArr = [];
// 			displayInputs(inputArr);
// 		} else if (buttons[i].textContent === '⌫') {
// 			inputArr.pop();
// 			displayInputs(inputArr);
// 		} else if (buttons[i].textContent === '=') {
// 			let calculated = calcFromPostFix(shunting(combineInputs(inputArr)));
// 			inputArr = [];
// 			//for if there is an error with a string message
// 			if (typeof calculated == 'string') {
// 				inputArr.push(calculated);
// 				//if things have gone according to plan and a number output needs to be pushed to the display
// 			} else {
// 				inputArr.push(round(calculated, 4));
// 			}
// 			displayInputs(inputArr);
// 		}
// 	});
// }

//makes sure you can't type two operators in a row or two decimals in a row. e.g. 3 + - 5, or 3..45
function validate(key) {
	let operators = [ '+', '-', '*', '×', '/', '÷', '.' ];
	if (operators.includes(inputArr[inputArr.length - 1]) && operators.includes(key)) {
		return false;
	}
	return true;
}
//adds event listeners for keyboard support
document.addEventListener('keydown', (event) => {
	if (
		(event.key === '+' && validate(event.key)) ||
		(event.key === '-' && validate(event.key)) ||
		(event.key === '.' && validate(event.key)) ||
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
		console.log(inputArr);
	} else if (event.key === '*' && validate('×')) {
		inputArr.push('×');
		displayInputs(inputArr);
		console.log(inputArr);
	} else if (event.key === '/' && validate('÷')) {
		inputArr.push('÷');
		displayInputs(inputArr);
		console.log(inputArr);
	} else if (event.key === 'Backspace') {
		inputArr.pop();
		displayInputs(inputArr);
	} else if (event.key === 'c' || event.key === 'C') {
		inputArr = [];
		displayInputs(inputArr);
	} else if (event.key === 'Enter') {
		let calculated = calcFromPostFix(shunting(combineInputs(inputArr)));
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

//combines multiple inputs to make up larger numbers and returns the combined array
function combineInputs(inputs) {
	let combinedNumArr = [];
	let startJoin = 0;
	let numberOfNums = 0;
	let numberOfOperators = 0;
	for (let i = 0; i < inputs.length; i++) {
		if (inputs[i] === '+' || inputs[i] === '-' || inputs[i] === '×' || inputs[i] === '÷') {
			let nextElement = inputs.slice(startJoin, i).join('');
			combinedNumArr.push(Number(nextElement));
			combinedNumArr.push(inputs[i]);
			startJoin = i + 1;
			numberOfNums += 1;
			numberOfOperators += 1;
		} else if (i === inputs.length - 1) {
			let lastElement = inputs.slice(startJoin, i + 1).join('');
			combinedNumArr.push(Number(lastElement));
			numberOfNums += 1;
		}
	}
	if (numberOfNums <= numberOfOperators) {
		return 'ERROR';
	}
	return combinedNumArr;
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
	display.textContent = text;
}

//shunting yard algorithm. Takes an array of inputs in infix notation and converts it to postfix notation
function shunting(infix) {
	let postfix = [];
	let operatorStack = [];
	let lastElement;
	for (let i = 0; i < infix.length; i++) {
		if (typeof infix[i] == 'number') {
			//numbers are immediately pushed into the postfix array
			postfix.push(infix[i]);
		} else {
			if (operatorStack.length === 0) {
				operatorStack.push(infix[i]); //the first operator is always pushed into the operatorStack
			} else {
				//if there are already operators in the stack we need to compare them so they can be put in order of precedence
				lastElement = operatorStack.length - 1;
				if (
					//if what is in the stack is of greater precedence, push it into the postfix array and pop it out of the operator stack
					(infix[i] === '+' || infix[i] === '-') &&
					(operatorStack[lastElement] === '×' || operatorStack[lastElement] === '÷')
				) {
					postfix.push(operatorStack.pop());
					if (operatorStack.length > 0) {
						lastElement = operatorStack.length - 1;
						if (operatorStack[lastElement] === '+' || operatorStack[lastElement] === '-') {
							postfix.push(operatorStack.pop());
						}
					}
					operatorStack.push(infix[i]);
				} else if (
					//if what is in the stack is of equal precedence, push it into the postfix array and pop it out of the operator stack
					(infix[i] === '+' || infix[i] === '-') &&
					(operatorStack[lastElement] === '+' || operatorStack[lastElement] === '-')
				) {
					postfix.push(operatorStack.pop());
					if (operatorStack.length > 0) {
						lastElement = operatorStack.length - 1;
						if (operatorStack[lastElement] === '+' || operatorStack[lastElement] === '-') {
							postfix.push(operatorStack.pop());
						}
					}
					operatorStack.push(infix[i]);
				} else if (
					//if what is in the stack is of equal precedence, push it into the postfix array and pop it out of the operator stack
					(infix[i] === '×' || infix[i] === '÷') &&
					(operatorStack[lastElement] === '×' || operatorStack[lastElement] === '÷')
				) {
					postfix.push(operatorStack.pop());
					if (operatorStack.length > 0) {
						lastElement = operatorStack.length - 1;
						if (operatorStack[lastElement] === '×' || operatorStack[lastElement] === '÷') {
							postfix.push(operatorStack.pop());
						}
					}
					operatorStack.push(infix[i]);
				} else if (
					//if what is in the stack is of lesser precedence, push the new operator into the operator stack
					(infix[i] === '×' || infix[i] === '÷') &&
					(operatorStack[lastElement] === '+' || operatorStack[lastElement] === '-')
				) {
					operatorStack.push(infix[i]);
				}
			}
		}
	}
	while (operatorStack.length > 0) {
		//pushes the remaining elements of the operator stack into the postfix array
		postfix.push(operatorStack.pop());
	}
	return postfix;
}

//calculates the value of the arithmetic from postfix notation
function calcFromPostFix(postfix) {
	let numberStack = [];
	for (let i = 0; i < postfix.length; i++) {
		if (typeof postfix[i] === 'number') {
			numberStack.push(postfix[i]);
		} else {
			let num2 = numberStack.pop();
			let num1 = numberStack.pop();
			if (typeof num1 !== 'number' || typeof num2 !== 'number') {
				return 'ERROR';
			} else if (postfix[i] === '+') {
				numberStack.push(addition(num1, num2));
			} else if (postfix[i] === '-') {
				numberStack.push(subtraction(num1, num2));
			} else if (postfix[i] === '×') {
				numberStack.push(multiplication(num1, num2));
			} else if (postfix[i] === '÷') {
				if (num2 === 0) {
					return 'DIVIDE BY "0" ERROR';
				}
				numberStack.push(division(num1, num2));
			}
		}
	}
	if (isNaN(numberStack[0])) {
		return 'ERROR';
	}
	return numberStack[0];
}
