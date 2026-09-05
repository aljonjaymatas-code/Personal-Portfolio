// Keep the dashboard header date synchronized with the user's local time.
const currentDate = document.querySelector('#current-date');
const mainContent = document.querySelector('#main-content');
const homeLink = document.querySelector('a[href="#main-content"]');
const dateFormatter = new Intl.DateTimeFormat('en-US', {
	weekday: 'long',
	month: 'long',
	day: 'numeric',
	year: 'numeric'
});

function updateCurrentDate() {
	currentDate.textContent = dateFormatter.format(new Date()).toUpperCase();
}

updateCurrentDate();
setInterval(updateCurrentDate, 60000);

homeLink.addEventListener('click', (event) => {
	event.preventDefault();
	mainContent.scrollTo({ top: 0, behavior: 'smooth' });
	history.replaceState(null, '', '#main-content');
});

// Convert editable hour values into bar heights using the chart's 8-hour scale.
const maximumStudyHours = 8;
const barColumns = document.querySelectorAll('.bar-column');
const studyLinePath = document.querySelector('.study-line-path');
const studyLinePoints = document.querySelectorAll('.study-line-points circle');

function updateStudyLine() {
	const linePoints = [...barColumns].map((column, index) => {
		const hours = Number.parseFloat(column.querySelector('.bar-value').dataset.hours) || 0;
		const x = 50 + (index * 100);
		const y = 165 - ((Math.min(maximumStudyHours, Math.max(0, hours)) / maximumStudyHours) * 165);

		return { x, y };
	});

	studyLinePath.setAttribute('points', linePoints.map(({ x, y }) => `${x},${y}`).join(' '));
	linePoints.forEach(({ x, y }, index) => {
		studyLinePoints[index].setAttribute('cx', x);
		studyLinePoints[index].setAttribute('cy', y);
	});
}

function updateStudyBar(column) {

	const valueElement = column.querySelector('.bar-value');
	const barElement = column.querySelector('.bar');
	const hours = Math.max(0, Math.min(maximumStudyHours, Number.parseFloat(valueElement.dataset.hours) || 0));
	const percentage = (hours / maximumStudyHours) * 100;

	valueElement.textContent = `${hours}h`;
	valueElement.dataset.hours = hours;
	barElement.style.height = `${percentage}%`;
	column.style.setProperty('--bar-height', `${percentage}%`);
}

barColumns.forEach((column) => {
	const valueElement = column.querySelector('.bar-value');

	valueElement.addEventListener('input', () => {
		const typedValue = valueElement.textContent.replace(/[^0-9.]/g, '');
		valueElement.dataset.hours = typedValue;
		updateStudyBar(column);
		updateStudyLine();
	});

	valueElement.addEventListener('blur', () => {
		updateStudyBar(column);
		updateStudyLine();
	});
	updateStudyBar(column);
});

updateStudyLine();
