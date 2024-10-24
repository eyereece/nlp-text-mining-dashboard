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

// SECTION 3.0
// SECTION 3.1 BAR+LINE CHART: average articles published vs claps by day
(function() {
    function fetchData(publisher = '') {
        const apiUrl = document.getElementById("bar-line-chart").getAttribute("data-url");
        const url = publisher ? `${apiUrl}${publisher}/` : apiUrl;

        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .catch(error => console.error("Error fetching data:", error));
    }

    function renderChart(data, publisher) {
        const ctx = document.getElementById('bar-line-chart').getContext('2d');
        const gradientBarLine = ctx.createLinearGradient(0, 0, 0, 400);
        gradientBarLine.addColorStop(0, 'rgba(30, 144, 255, 0.7)');
        gradientBarLine.addColorStop(1, 'rgba(30, 144, 255, 0)');
        
        // Define the order of days
        const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

        // Sort the data based on the day order
        data.sort((a, b) => dayOrder.indexOf(a.pub_day) - dayOrder.indexOf(b.pub_day));

        // Clear any existing chart first
        if (window.myChart) {
            window.myChart.destroy();
        }

        let useCurves = true;

        const dataBarLine = {
            labels: data.map(item => item.pub_day),
                datasets: [{
                    label: 'Avg Articles Published',
                    data: data.map(item => item.avg_articles_published),
                    backgroundColor: gradientBarLine,
                    borderColor: 'rgba(30, 144, 255, 1)',
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: 'Avg Claps',
                    data: data.map(item => item.avg_claps_per_day),
                    borderColor: 'rgba(75, 192, 192, 0.8)',
                    borderWidth: 1,
                    tension: useCurves ? 0.4 : 0,
                    type: 'line',
                    yAxisID: 'y1',
                }]
        };

        // Set Title for selected publisher or all articles
        const barLineTitle = publisher
            ? `${publisher}`
            : 'All Articles';

        const configBarLine = {
            type: 'bar',
            data: dataBarLine,
            options: {
                responsive: true,
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
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: barLineTitle
                    }
                }
            }
        }
        
        // Create a new chart
        window.myChart = new Chart(ctx, configBarLine);
    }

    // Button click event listeners
    document.getElementById("all-bar-line").addEventListener("click", () => {
        fetchData().then(data => renderChart(data, 'All Articles'));
    });
    document.getElementById("tds-bar-line").addEventListener("click", () => {
        fetchData("Towards Data Science").then(data => renderChart(data, 'Towards Data Science'));
    });
    document.getElementById("luc-bar-line").addEventListener("click", () => {
        fetchData("Level Up Coding").then(data => renderChart(data, 'Level Up Coding'));
    });
    document.getElementById("tai-bar-line").addEventListener("click", () => {
        fetchData("Towards AI").then(data => renderChart(data, 'Towards AI'));
    });
    document.getElementById("jr-bar-line").addEventListener("click", () => {
        fetchData("Javarevisited").then(data => renderChart(data, 'Javarevisited'));
    });
    document.getElementById("det-bar-line").addEventListener("click", () => {
        fetchData("Data Engineer Things").then(data => renderChart(data, 'Data Engineer Things'));
    });

    // Optionally load default data
    fetchData().then(data => renderChart(data, 'All Articles'));
})();

// END SECTION 3.1

// SECTION 3.2 BOX CHART: claps distribution
const clapsDistUrl = document.getElementById('box-chart').dataset.url;

fetch(clapsDistUrl)
    .then(response => response.json())
    .then(data => {
        const labels = data.map(item => item.label);
        const clapsData = data.map(item => ({
            min: item.min,
            q1: item.q1,
            median: item.median,
            q3: item.q3,
            max: item.max,
            outliers: item.outliers
        }));

        // Create Chart
        const ctxBox = document.getElementById('box-chart').getContext('2d');
        const gradientBox = ctxBox.createLinearGradient(0, 0, 0, 400);
        gradientBox.addColorStop(0, 'rgba(30, 144, 255, 0.7)');
        gradientBox.addColorStop(1, 'rgba(30, 144, 255, 0)');

        // Create box plot data object
        const boxData = {
            labels: labels,
            datasets: [{
                label: 'Claps Distribution of Publishers',
                backgroundColor: gradientBox,
                borderColor: 'rgba(30, 144, 255, 1)',
                borderWidth: 1,
                outlierRadius: 3,
                itemRadius: 3,
                outlierBackgroundColor: 'rgba(30, 144, 255, 0.3)',
                padding: 10,
                data: clapsData
            }]
        };

        const configBox = {
            type: 'boxplot',
            data: boxData,
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                elements: {
                    boxAndWhiskers: {
                        itemRadius: 2,
                        itemHitRadius: 4
                    }
                },
                title: {
                    display: false,
                    text: 'Box Plot'
                }
            }
        }

        new Chart(ctxBox, configBox);
    })
    .catch(error => console.log('Error fetching claps distribution: ', error));

// END SECTION 3.2

// SECTION 4.0
// SECTION 4.1 DONUT CHART: number of articles published per publisher

// END SECTION 4.1

// SECTION 4.2 BAR CHART: number of unique authors per publisher

// END SECTION 4.2

