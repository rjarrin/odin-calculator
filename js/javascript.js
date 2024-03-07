// Identify button container
const buttonsContainer = document.querySelector('.buttons');
// Set user input and result to default empty values
let userInput = "";
let result = "";
// Decimal point check
let multiDecimals = false;

// Button display (ordered)
const buttons = ['C', '%', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '←', '='];
// Assign button click listeners
buttons.forEach(button => {
    const buttonElement = document.createElement('button');
    buttonElement.textContent = button;
    // Button styling: hover and color
    buttonElement.classList.add("calculator-button");
    if (button === "C") {
        buttonElement.classList.add("clear");
    } else if (button === "=") {
        buttonElement.classList.add("equals");
    } else if (['+', '-', '*', '/', '%'].includes(button)) {
        buttonElement.classList.add("operators");
    }
    // Button functionality: click
    buttonElement.addEventListener('click', () => handleButtonClick(button));
    // Append to container
    buttonsContainer.appendChild(buttonElement);
});

// Update calculator display with latest input and result
function updateDisplay() {
    document.querySelector(".user-input").textContent = userInput;
    document.querySelector(".result").textContent = result;
}

// Parse expression for calculation and result
function parse(tokens) {
    // Convert infix to postfix notation (using modified shunting yard algorithm)
    let postfix = shuntingYard(tokens);
    // Evaluate the stack expression
    return evaluate(postfix);
}

// Use modified shunting yard algorithm to convert infix input to postfix output. Uses left-to-right precedence instead of BEDMAS as per project specs.
function shuntingYard(tokens) {
    // Prepare expression and operator stacks
    let output = [];
    let operators = [];

    // Iterate through each token
    tokens.forEach(token => {
        // If the token is a number, add it to the expression
        if (!isNaN(token)) {
            output.push(token);
        }
        else {
            // Move the operators into the expression for evaluation later (as per project specs)
            while (operators.length > 0) {
                output.push(operators.pop());
            }
            // Push latest operator to the stack
            operators.push(token);
        }
    });
    // Push any remaining operators to the stack
    while (operators.length > 0) {
        output.push(operators.pop());
    }
    return output;
}

// Evaluate postfix expression
function evaluate(postfix) {
    // Prepare expression result stack
    let stack = [];
    postfix.forEach(token => {
        if(!isNaN(token)) {
            // If token is a number, push to stack for later use
            stack.push(parseFloat(token));
        } else {
            // Pop the two latest numbers and calculate expression with token operand
            let op2 = stack.pop();
            let op1 = stack.pop();
            let result = calculate(token, op1, op2);
            stack.push(result);
        }
    });
    return stack.pop();
}

// Tokenize the input (by operand)
function tokenize(input) {
    return input.split(/(\+|-|\*|\/|\d+\.\d+|\d+)/g).filter(token => token.trim() !== '');
}

// Calculate stack expression
function calculate(operator, a, b) {
    let result;
    switch (operator) {
        case '+': 
            result = a + b;
            break;
        case '-': 
            result = a - b;
            break;
        case '*': 
            result = a * b;
            break;
        case '/': 
            result = b === 0 ? 'NaN' : a / b;
            break;
        default:
            result = 'NaN';
    }

    // Display correct number of decimal places from arithmetic calculation
    let maxDecimals;
    try {
        const decimalPlacesA = (a.toString().split('.')[1] || '').length;
        const decimalPlacesB = (b.toString().split('.')[1] || '').length; 
        maxDecimals = Math.max(decimalPlacesA, decimalPlacesB);
    } catch (error) {
        maxDecimals = 0;
    }
    // Round the result to the maximum number of decimal places
    return parseFloat(result.toFixed(maxDecimals));
}

// Event listener for button click
function handleButtonClick(button) {
    // Consider a maximum input length
    const maxLength = 19;
    if (userInput.length > maxLength && !['C', '%', '=', '←'].includes(button)) {
        alert("Input limit reached!");
        return;
    }
    // Equals button
    if (button === "=") {
        // Use result as input if nothing else was provided yet
        if (userInput === "") {
            userInput = result;
        } else {
            result = parse(tokenize(userInput));
        }
        // Evaluate the user expression        
        userInput += button;
        updateDisplay();
        multiDecimals = false;
        userInput = "";
    } else if (button === "C") {
        // Clear display
        userInput = "";
        result = "";
        updateDisplay();
        multiDecimals = false;
    } else if (button === "%") {
        // Calculate the percentage (out of 100)
        result = (parseFloat(userInput) / 100);
        updateDisplay();
    } else if (button === ".") {
        // If user hits . without entering a number previously, use 0
        if (multiDecimals == false) {
            if (['+', '-', '*', '/'].includes(userInput[userInput.length - 1])){
                userInput += "0";
            }
            // Append the decimal to the user input
            userInput += button;
            updateDisplay();
        }
        // Disable the user from entering more decimal points
        multiDecimals = true;
    } else if (['+', '-', '*', '/'].includes(button)) {
        // If operator was selected and user input is empty
        if (userInput === "") {
            // Add the latest result to the equation
            if (result !== "NaN") {
                userInput += result;
            }
            // If the result doesn't exist, use 0
            else {
                userInput += "0";
            }
        }
        // If user enters . without appending a number to the end, append 0
        else if (userInput[userInput.length - 1] === ".") {
            userInput += "0";
        }
        // Append the operator to the expression
        userInput += button;
        updateDisplay();
        multiDecimals = false;
    } else if (button === "←") {
        if (userInput !== "") {
            // Get the last character from the user input
            let lastCharacter = userInput.charAt(userInput.length - 1);
            
            // Decimal functionality
            // If last character in the input was ., remove decimal restriction
            if (lastCharacter === "." ) {
                multiDecimals = false;
            }
            // If last character was an operator, investigate further
            else if (['+', '-', '*', '/'].includes(lastCharacter)) {
                let checker = tokenize(userInput);
                // If second last character includes a decimal number, keep decimal restriction. Otherwise, remove it.
                if (checker[checker.length - 2].includes(".")) {
                    multiDecimals = true;
                }
                else multiDecimals = false;
            }
            // Remove the last charcter from the user input
            userInput = userInput.slice(0, -1);
            updateDisplay();
        } 
    }
    else {
        userInput += button;
        updateDisplay();
    }
}

// Keyboard support
const keyboardMap = {
    '0': '0',
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '+': '+',
    '-': '-',
    '*': '*',
    '/': '/',
    '.': '.',
    'Enter': '=',
    'Backspace': '←',
    'Space': 'C',
    '%': '%'
};

window.addEventListener('keydown', function(event) {
    const button = keyboardMap[event.key];
    if (button) {
        if (['Enter', 'Backspace', 'Space', '+', '-'].includes(event.key)) {
            event.preventDefault();
        }
        handleButtonClick(button);
    }
});
