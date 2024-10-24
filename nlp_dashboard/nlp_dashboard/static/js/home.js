// UTILITY FUNCTIONS
const Utils = {
    CHART_COLORS: {
        green: 'rgba(75, 192, 192, 0.5)',
        blue: 'rgba(30, 144, 255, 0.4)',
        purple: 'rgba(106, 90, 205, 0.3)',
        grey: 'rgba(201, 203, 207, 0.3)',
        lightBlue: 'rgba(173, 216, 230, 0.8)',
        lightPurple: 'rgba(230, 230, 250, 0.3)',
      }
};

// SECTION 2 - LINE - releases and claps by week NEW
const baseReleasesClapsByWeekUrl = document.getElementById('line-chart').dataset.url;

function fetchChartData(publisher = '') {
    // Construct the URL based on the selected publisher
    const url = publisher ? `${baseReleasesClapsByWeekUrl}${publisher}/` : baseReleasesClapsByWeekUrl;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        const labels = data.map(item => new Date(item.published_date).toLocaleDateString());
        const releasesData = data.map(item => item.releases);
        const clapsData = data.map(item => item.claps);

        if (window.lineChart) {
            window.lineChart.destroy();
        }

        const ctxLine = document.getElementById('line-chart').getContext('2d');
        const dataLine = {
            labels: labels,
            datasets: [
                {
                    label: 'Articles',
                    data: releasesData,
                    borderColor: 'rgba(30, 144, 255, 1)',
                    borderWidth: 1,
                    yAxisID: 'y',
                },
                {
                    label: 'Claps',
                    data: clapsData,
                    borderColor: 'rgba(75, 192, 192, 0.8)',
                    borderWidth: 1,
                    yAxisID: 'y1',
                },
            ]
        };

        // Set the Title for selected publisher or all articles
        const lineTitle = publisher
            ? `${publisher}` : 'All Articles';

        const configLine = {
            type: 'line',
            data: dataLine,
            options: {
                responsive: true,
                aspectRatio: 4.0,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                stacked: false,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false,
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: lineTitle
                    }
                }
            },
        };

        // Create a new chart
        window.lineChart = new Chart(ctxLine, configLine); // Initialize the chart
    })
    .catch(error => console.error('Error fetching chart data:', error));
}

// Add event listeners for the buttons
document.getElementById('all-line').addEventListener('click', () => fetchChartData());
document.getElementById('tds-line').addEventListener('click', () => fetchChartData('Towards Data Science'));
document.getElementById('luc-line').addEventListener('click', () => fetchChartData('Level Up Coding'));
document.getElementById('tai-line').addEventListener('click', () => fetchChartData('Towards AI'));
document.getElementById('jr-line').addEventListener('click', () => fetchChartData('Javarevisited'));
document.getElementById('det-line').addEventListener('click', () => fetchChartData('Data Engineer Things'));

// Initially load data for all articles
fetchChartData();

// END SECTION 2 - LINE CHART