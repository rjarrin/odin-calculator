document.addEventListener('DOMContentLoaded', function() {
    const buttonsContainer = document.querySelector('.buttons');
    let userInput = "";
    let result = "";

    const buttons = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '/', '*', 'C', '.', '=', '%', '←', '±'];

    buttons.forEach(button => {
        const buttonElement = document.createElement('button');
        buttonElement.textContent = button;
        buttonElement.addEventListener('click', () => handleButtonClick(button));
        buttonsContainer.appendChild(buttonElement);
    });

    function updateDisplay() {
        document.querySelector(".user-input").textContent = userInput;
        document.querySelector(".result").textContent = result;
    }

    function handleButtonClick(button) {
        if (button === "=") {
            result = "NaN";
            updateDisplay();
            userInput = "";
        } else if (button === "C") {
            userInput = "";
            result = "";
            updateDisplay();
        } else {
            userInput += button;
            updateDisplay();
        }
    }

});


