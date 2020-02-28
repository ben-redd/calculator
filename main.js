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

function operate(operator, num1, num2) {
	return operator === '+'
		? addition(num1, num2)
		: operator === '-'
			? subtraction(num1, num2)
			: operator === '*' ? multiplication(num1, num2) : division(num1, num2);
}

const buttons = document.querySelectorAll('button');
let inputArray = [];
for (let i = 0; i < buttons.length; i++) {
	buttons[i].addEventListener('click', () => {
		//takes number inputs
		if (buttons[i].classList.contains('number')) {
			inputArray.push(Number(buttons[i].textContent));
			//takes operator inputs
		} else if (buttons[i].classList.contains('operator')) {
			inputArray.unshift(buttons[i].textContent);
			//clears the inputs if the clear input is selected
		} else if (buttons[i].classList.contains('clear')) {
			inputArray.length = 0;
		} else if (buttons[i].classList.contains('equals')) {
			alert(operate(inputArray[0], inputArray[1], inputArray[2]));
		} else {
			alert('Error');
		}
	});
}
