let decimals = 6;
let spacesRemoved = false;

const result = document.getElementById('result');
const input = document.getElementById('coordInput');
const copyButton = document.getElementById('copyButton');
const toggleButton = document.getElementById('toggleSpaces');
const sixDecimalsCheckbox = document.getElementById('sixDecimals');
const fiveDecimalsCheckbox = document.getElementById('fiveDecimals');

const errorsText = [
    "...",
    "Waiting for valid input...",
    "Invalid input. Please check your coordinates.",
];

const updateCheckboxes = (thisCheckbox, otherCheckbox, value) => {
    if (thisCheckbox.checked) {
        decimals = value;
        otherCheckbox.checked = false;
        updateCoordinates();
    }
};

function shortenNumber(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}

function shortenCoordinates() {
    const coords = input.value.split(',').map(coord => coord.trim());
    if (coords.length !== 2 || coords[0] === '' || coords[1] === '') {
        result.textContent = errorsText[1];
        copyButton.style.display = 'none';
        return;
    }
    const shortenedCoords = coords.map(coord => {
        const num = parseFloat(coord);
        return isNaN(num) ? "Invalid" : shortenNumber(num, decimals);
    });
    if (shortenedCoords.includes("Invalid")) {
        result.textContent = errorsText[2];
        copyButton.style.display = 'none';
    } else {
        result.textContent = `${shortenedCoords[0]}, ${shortenedCoords[1]}`;
        copyButton.style.display = 'inline-flex';
    }
    updateResult();
}

function copyToClipboard() {
    const textToCopy = result.textContent.replace(/\s\s+/g, ' ');
    navigator.clipboard.writeText(textToCopy).then(() => {
        copyButton.innerHTML = '<span class="icon-checkmark"></span>';
        setTimeout(() => {
            copyButton.innerHTML = '<span class="icon-copy"></span>';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

function updateCoordinates() {
    if (!errorsText.includes(result.textContent)) {
        shortenCoordinates();
    }
}

function updateResult() {
    if (!errorsText.includes(result.textContent)) {
        result.textContent = spacesRemoved ? result.textContent.replace(/\s/g, '') : result.textContent.replace(/,/, ', ');
    }
}

function toggleSpaces() {
    spacesRemoved = !spacesRemoved;
    if (spacesRemoved) {
        toggleButton.innerHTML = '<span class="icon-spacebar-off"></span>';
        toggleButton.title = "Keep spaces";
    } else {
        toggleButton.innerHTML = '<span class="icon-spacebar-on"></span>';
        toggleButton.title = "Remove spaces";
    }
    updateResult();
}

function selectInput() {
    if (input.value) {
        input.select();
    }
}

input.addEventListener('click', selectInput);
input.addEventListener('input', shortenCoordinates);
toggleButton.addEventListener('click', toggleSpaces);
copyButton.addEventListener('click', copyToClipboard);

sixDecimalsCheckbox.onchange = () => updateCheckboxes(sixDecimalsCheckbox, fiveDecimalsCheckbox, 6);
fiveDecimalsCheckbox.onchange = () => updateCheckboxes(fiveDecimalsCheckbox, sixDecimalsCheckbox, 5);