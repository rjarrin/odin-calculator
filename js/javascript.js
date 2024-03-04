document.addEventListener('DOMContentLoaded', function() {
    const buttonsContainer = document.querySelector('.buttons');
    const buttons = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '/', '*', 'C', '.', '=', '%', '←', '±'];

    buttons.forEach(button => {
        const buttonElement = document.createElement('button');
        buttonElement.textContent = button;
        buttonsContainer.appendChild(buttonElement);
    });
});
