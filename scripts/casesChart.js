// chart.js imported via CDN in html

const labels = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
];
const data = {
	labels: labels,
	datasets: [{
	  label: 'Covid Cases',
	  backgroundColor: 'rgb(255, 99, 132)',
	  borderColor: 'rgb(255, 99, 132)',
	  data: [12, 10, 14, 22, 24, 18, 15],
	}]
};

const config = {
	type: 'line',
	data,
	options: {}
};

let myChart = new Chart(
    document.getElementById('cases-chart'),
    config
  );