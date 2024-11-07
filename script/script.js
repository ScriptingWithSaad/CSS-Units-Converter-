
// Base conversion values relative to pixels
const conversionRates = {
    px: 1,
    vh: window.innerHeight / 100,
    vw: window.innerWidth / 100,
    rem: parseFloat(getComputedStyle(document.documentElement).fontSize),
    em: parseFloat(getComputedStyle(document.documentElement).fontSize),
    pt: 1.333333,
    cm: 37.795276,
    mm: 3.7795276,
    in: 96
};

// Load history from localStorage
let history = JSON.parse(localStorage.getItem('conversionHistory')) || [];

// Convert function
function convert() {
    const inputValue = parseFloat(document.getElementById('inputValue').value);
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;

    if (isNaN(inputValue)) {
        alert('Please enter a valid number');
        return;
    }

    // Convert to pixels first, then to target unit
    const pixelValue = inputValue * conversionRates[fromUnit];
    const result = pixelValue / conversionRates[toUnit];

    document.getElementById('outputValue').value = result.toFixed(4);

    // Add to history
    addToHistory(inputValue, fromUnit, result, toUnit);
}

// Add conversion to history
function addToHistory(input, fromUnit, output, toUnit) {
    const conversion = {
        input,
        fromUnit,
        output: parseFloat(output.toFixed(4)),
        toUnit,
        timestamp: new Date().toISOString()
    };

    history.unshift(conversion);
    history = history.slice(0, 10); // Keep only last 10 conversions
    localStorage.setItem('conversionHistory', JSON.stringify(history));
    renderHistory();
}

// Render history list
function renderHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    history.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <span>${item.input} ${item.fromUnit} = ${item.output} ${item.toUnit}</span>
            <button onclick="deleteHistoryItem(${index})" class="delete-btn">Delete</button>
        `;
        historyList.appendChild(historyItem);
    });
}

// Delete single history item
function deleteHistoryItem(index) {
    history.splice(index, 1);
    localStorage.setItem('conversionHistory', JSON.stringify(history));
    renderHistory();
}

// Clear all history
function clearHistory() {
    history = [];
    localStorage.setItem('conversionHistory', JSON.stringify(history));
    renderHistory();
}

// Update conversion rates on window resize
window.addEventListener('resize', _.debounce(() => {
    conversionRates.vh = window.innerHeight / 100;
    conversionRates.vw = window.innerWidth / 100;
}, 250));

// Initial render
renderHistory();

// Enter key functionality
document.getElementById('inputValue').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        convert();
    }
});
