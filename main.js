const generateButton = document.getElementById('generate-button');
const numbersContainer = document.getElementById('numbers-container');

function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

function displayNumbers(numbers) {
    numbersContainer.innerHTML = '';
    numbers.forEach(number => {
        const numberElement = document.createElement('div');
        numberElement.classList.add('number');
        numberElement.textContent = number;
        numberElement.style.backgroundColor = getNumberColor(number);
        numbersContainer.appendChild(numberElement);
    });
}

function getNumberColor(number) {
    if (number <= 10) return '#f1c40f'; // Yellow
    if (number <= 20) return '#3498db'; // Blue
    if (number <= 30) return '#e74c3c'; // Red
    if (number <= 40) return '#9b59b6'; // Purple
    return '#2ecc71'; // Green
}

function generateAndDisplayNumbers() {
    const lottoNumbers = generateLottoNumbers();
    displayNumbers(lottoNumbers);
}

generateButton.addEventListener('click', generateAndDisplayNumbers);

// Initial generation
generateAndDisplayNumbers();
