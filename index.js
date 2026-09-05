// Keep the dashboard header date synchronized with the user's local time.
const currentDate = document.querySelector('#current-date');
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

// Convert editable hour values into bar heights using the chart's 8-hour scale.
const maximumStudyHours = 8;
const barColumns = document.querySelectorAll('.bar-column');

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
	});

	valueElement.addEventListener('blur', () => updateStudyBar(column));
	updateStudyBar(column);
});
