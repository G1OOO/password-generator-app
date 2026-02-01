const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.<>?/|';

const passwordEl = document.getElementById('password');
const lengthEl = document.getElementById('length');
const lengthValueEl = document.getElementById('lengthValue');
const upperEl = document.getElementById('upper');
const lowerEl = document.getElementById('lower');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateBtn = document.getElementById('generate');
const strengthText = document.getElementById('strengthText');
const copyBtn = document.getElementById('copy');
const bars = [
	document.getElementById('bar1'),
	document.getElementById('bar2'),
	document.getElementById('bar3'),
	document.getElementById('bar4')
];

function getSelectedCharSets() {
	let sets = [];
	if (upperEl.checked) sets.push(UPPER);
	if (lowerEl.checked) sets.push(LOWER);
	if (numbersEl.checked) sets.push(NUMBERS);
	if (symbolsEl.checked) sets.push(SYMBOLS);
	return sets;
}

function generatePassword() {
	const sets = getSelectedCharSets();
	const length = parseInt(lengthEl.value, 10);
	if (sets.length === 0) return '';

	let password = sets.map(set => set[Math.floor(Math.random() * set.length)]);
	let allChars = sets.join('');
	for (let i = password.length; i < length; i++) {
		password.push(allChars[Math.floor(Math.random() * allChars.length)]);
	}
	for (let i = password.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[password[i], password[j]] = [password[j], password[i]];
	}
	return password.join('');
}

function updatePassword() {
	const pwd = generatePassword();
	passwordEl.textContent = pwd || '';
	updateStrength(pwd);
}

function updateStrength(pwd) {
	const sets = getSelectedCharSets().length;
	const len = pwd.length;
	let score = 0;
	if (len >= 8) score++;
	if (len >= 12) score++;
	if (len >= 16) score++;
	score += sets - 1;
	if (score > 4) score = 4;

	const levels = ['TOO WEAK!', 'WEAK', 'MEDIUM', 'STRONG'];
	strengthText.textContent = levels[Math.max(0, score - 1)] || 'TOO WEAK!';
	bars.forEach((bar, i) => {
		bar.style.background = i < score ? '#A4FFAF' : '#2a2b2d';
	});
}


copyBtn.addEventListener('click', () => {
    const password = passwordEl.textContent;
    if (!password) return;
    navigator.clipboard.writeText(password).then(() => {
        const originalContent = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span style="color: #b6ffd0; font-size: 12px; font-family: sans-serif;">COPIED!</span>';
        setTimeout(() => {
            copyBtn.innerHTML = originalContent;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
});
lengthEl.addEventListener('input', () => {
	lengthValueEl.textContent = lengthEl.value;
	updatePassword();
});
[upperEl, lowerEl, numbersEl, symbolsEl].forEach(el => {
	el.addEventListener('change', updatePassword);
});
generateBtn.addEventListener('click', updatePassword);

lengthValueEl.textContent = lengthEl.value;
updatePassword();
