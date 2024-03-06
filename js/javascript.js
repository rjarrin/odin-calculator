const buttonsContainer = document.querySelector('.buttons');
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
    buttonElement.addEventListener('click', () => handleButtonClick(button));
    if (button === "C") {
        buttonElement.classList.add("clear");
    }
    buttonsContainer.appendChild(buttonElement);
});

function updateDisplay() {
    document.querySelector(".user-input").textContent = userInput;
    document.querySelector(".result").textContent = result;
}

function parse(tokens) {
    // Convert infix to postfix notation
    let postfix = shuntingYard(tokens);
    // Evaluate the stack expression
    return evaluate(postfix);
}

function shuntingYard(tokens) {
    console.log("TOKENS (SHUNTING): " + tokens);
    // Prepare expression and operator stacks
    let output = [];
    let operators = [];

    // Iterate through each token
    tokens.forEach(token => {
        // If the token is a number, add it to the expression
        if (!isNaN(token)) {
            output.push(token);
            console.log("OUTPUT:" + output);
        }
        else {
            // Move the operators into the expression for evaluation later (as per project specs)
            while (operators.length > 0) {
                output.push(operators.pop());
            }
            // Push latest operator to the stack
            operators.push(token);
            console.log("OPS: " + operators);
        }
    });
    // Push any remaining operators to the stack
    while (operators.length > 0) {
        output.push(operators.pop());
    }
    return output;
}

function evaluate(postfix) {
    console.log("POSTFIX OUTPUT: "+ postfix);
    // Prepare expression result stack
    let stack = [];
    postfix.forEach(token => {
        if(!isNaN(token)) {
            stack.push(parseFloat(token));
            console.log("STACK: " + stack);
        } else {
            let op2 = stack.pop();
            let op1 = stack.pop();
            let result = calculate(token, op1, op2);
            stack.push(result);
        }
    });
    return stack.pop();
}

function tokenize(input) {
    return input.split(/(\+|-|\*|\/|\(|\)|\d+\.\d+|\d+)/g).filter(token => token.trim() !== '');
}

function calculate(operator, a, b) {
    switch (operator) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b === 0 ? 'NaN' : a / b;
        default: return 'NaN';
    }
}

function handleButtonClick(button) {
    if (button === "=") {
        // Evaluate the user expression
        console.log("USER INPUT: "+ multiDecimals);

        result = parse(tokenize(userInput));
        userInput += button;
        //result = calculate(userInput);
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
        else if (userInput[userInput.length - 1] === ".") {
            userInput += "0";
        }
        // Append the operator to the expression
        userInput += button;
        updateDisplay();
        multiDecimals = false;
    } else if (button === "←" && userInput !== "") {
        // Get the last character from the user input
        let lastCharacter = userInput.charAt(userInput.length - 1);
        
        // Decimal functionality
        if (lastCharacter === "." ) {
            multiDecimals = false;
        }
        else if (['+', '-', '*', '/'].includes(lastCharacter)) {
            let checker = tokenize(userInput);
            if (checker[checker.length - 2].includes(".")) {
                multiDecimals = true;
            }
            else multiDecimals = false;
        }
        // Remove the last charcter from the user input
        userInput = userInput.slice(0, -1);
        updateDisplay();
    }
    else {
        userInput += button;
        updateDisplay();
    }
}


