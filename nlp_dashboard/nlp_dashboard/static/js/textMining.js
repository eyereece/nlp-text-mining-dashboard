// UTILITY FUNCTIONS
function colorWithBlue(ctx) {
    if (ctx.type !== 'data') {
        return 'transparent';
    }
    const value = ctx.raw.v;
    let alpha = (1 + Math.log(value)) / 5;
    return `rgba(30, 144, 255, ${alpha})`;
}

// SECTION 1.1 TABLE - Bigram
const baseBigramTableUrl = document.getElementById('table-container').dataset.url;
const tableContainer = document.getElementById('table-container');

function fetchBigramTableData(publisher = '') {
    const url = publisher ? `${baseBigramTableUrl}${publisher}/` : baseBigramTableUrl;
    
    // Fetch the data
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Clear the previous table
            tableContainer.innerHTML = "";

            // Create a new table
            const table = document.createElement("table");
            table.innerHTML = `
            <thead>
                <tr>
                    <th>Keywords</th>
                    <th>Frequency</th>
                </tr>
            </thead>
            <tbody>
            ${data.map(item => `
                <tr>
                    <td>${item.keywords}</td>
                    <td>${item.frequencies}</td>
                </tr>
            `).join('')}
            </tbody>
            `;

            // Append the table to the tableContainer
            tableContainer.appendChild(table);
        })
        .catch(error => console.error("Error fetching bigram data:", error));
}

// Buttons
document.getElementById('all-table').addEventListener('click', () => fetchBigramTableData());
document.getElementById('tds-table').addEventListener('click', () => fetchBigramTableData('Towards Data Science'));
document.getElementById('luc-table').addEventListener('click', () => fetchBigramTableData('Level Up Coding'));
document.getElementById('tai-table').addEventListener('click', () => fetchBigramTableData('Towards AI'));
document.getElementById('jr-table').addEventListener('click', () => fetchBigramTableData('Javarevisited'));
document.getElementById('det-table').addEventListener('click', () => fetchBigramTableData('Data Engineer Things'));

fetchBigramTableData();

// END SECTION 1.1

// SECTION 1.2 TREEMAP - Bigram
const baseBigramTreemapUrl = document.getElementById('bigram-treemap').dataset.url;

function fetchBigramTreemapData(publisher = '') {
    // Construct the URL based on the selected publisher
    const url = publisher ? `${baseBigramTreemapUrl}${publisher}/` : baseBigramTreemapUrl;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Prepare data for treemap
            const treemapData = data.map(item => ({
                category: item.keywords,
                value: item.frequencies
            }));

            const ctxBigramTreemap = document.getElementById('bigram-treemap').getContext('2d');

            // Destroy previous chart if it exists
            if (window.biTreemapChart) {
                window.biTreemapChart.destroy();
            }

            // Create a new treemap chart
            window.biTreemapChart = new Chart(ctxBigramTreemap, {
                type: 'treemap',
                data: {
                    datasets: [{
                        label: publisher === '' ? 'All Articles' : publisher,
                        tree: treemapData,
                        key: 'value',
                        groups: ['category'],
                        backgroundColor: (ctxBigramTreemap) => colorWithBlue(ctxBigramTreemap),
                        borderColor: 'black',
                        borderWidth: 1,
                        labels: {
                            align: 'center',
                            display: true,
                            color: 'whiteSmoke',
                            font: {
                                size: 12
                            },
                            hoverFont: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    }]
                },
            });
        })
        .catch(error => console.error("Error fetching above average bigram data: ", error));
}

// Add event listeners for the buttons
document.getElementById('all-bi-treemap').addEventListener('click', () => fetchBigramTreemapData(''));
document.getElementById('tds-bi-treemap').addEventListener('click', () => fetchBigramTreemapData('Towards Data Science'));
document.getElementById('luc-bi-treemap').addEventListener('click', () => fetchBigramTreemapData('Level Up Coding'));
document.getElementById('tai-bi-treemap').addEventListener('click', () => fetchBigramTreemapData('Towards AI'));
document.getElementById('jr-bi-treemap').addEventListener('click', () => fetchBigramTreemapData('Javarevisited'));
document.getElementById('det-bi-treemap').addEventListener('click', () => fetchBigramTreemapData('Data Engineer Things'));

// Initially load data for all articles
fetchBigramTreemapData();

// END SECTION 1.2


// SECTION 2.1 TABLE - Trigram
const baseTrigramTableUrl = document.getElementById('tri-table-container').dataset.url;
const triTableContainer = document.getElementById('tri-table-container');

function fetchTrigramTableData(publisher = '') {
    const url = publisher ? `${baseTrigramTableUrl}${publisher}/` : baseTrigramTableUrl;

    // Fetch Trigram Data
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Clear previous table
            triTableContainer.innerHTML = "";

            // Create a new table
            const table = document.createElement("table");
            table.innerHTML = `
            <thead>
                <tr>
                    <th>Keywords</th>
                    <th>Frequency</th>
                </tr>
            </thead>
            <tbody>
            ${data.map(item => `
                <tr>
                    <td>${item.keywords}</td>
                    <td>${item.frequencies}</td>
                </tr>
                `).join('')}
                </tbody>
        `;
        // Append the table to the triTableContainer
        triTableContainer.appendChild(table);
        })
        .catch(error => console.error("Error fetching Trigram data: ", error));
}

// Buttons for Trigram Table
document.getElementById('all-tri-table').addEventListener('click', () => fetchTrigramTableData());
document.getElementById('tds-tri-table').addEventListener('click', () => fetchTrigramTableData('Towards Data Science'));
document.getElementById('luc-tri-table').addEventListener('click', () => fetchTrigramTableData('Level Up Coding'));
document.getElementById('tai-tri-table').addEventListener('click', () => fetchTrigramTableData('Towards AI'));
document.getElementById('jr-tri-table').addEventListener('click', () => fetchTrigramTableData('Javarevisited'));
document.getElementById('det-tri-table').addEventListener('click', () => fetchTrigramTableData('Data Engineer Things'));

// Default load to all articles
fetchTrigramTableData();
// END SECTION 2.1

// SECTION 2.2 TREEMAP - Trigram - higher engagement
const baseTrigramTreemapUrl = document.getElementById('trigram-treemap').dataset.url;

function fetchTrigramTreemapData(publisher = '') {
    // Construct the URL based on the selected publisher
    const url = publisher ? `${baseTrigramTreemapUrl}${publisher}/` : baseTrigramTreemapUrl;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Prepare data for treemap trigram
            const triTreemapData = data.map(item => ({
                category: item.keywords,
                value: item.frequencies
            }));

            const ctxTrigramTreemap = document.getElementById("trigram-treemap").getContext("2d");

            // Destroy previous chart if it exists
            if (window.triTreemapChart) {
                window.triTreemapChart.destroy();
            }

            // Create a new treemap chart
            window.triTreemapChart = new Chart(ctxTrigramTreemap, {
                type: 'treemap',
                data: {
                    datasets: [{
                        label: publisher === "" ? "All Articles" : publisher,
                        tree: triTreemapData,
                        key: 'value',
                        groups: ['category'],
                        backgroundColor: (ctxTrigramTreemap) => colorWithBlue(ctxTrigramTreemap),
                        borderColor: 'black',
                        borderWidth: 1,
                        labels: {
                            align: 'center',
                            display: true,
                            color: 'whiteSmoke',
                            font: {
                                size: 12
                            },
                            hoverFont: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    }]
                }
            });
        })
        .catch(error => console.error("Error fetching above average trigram data: ", error));
}

// Add event listeners for the buttons
document.getElementById('all-tri-treemap').addEventListener('click', () => fetchTrigramTreemapData(''));
document.getElementById('tds-tri-treemap').addEventListener('click', () => fetchTrigramTreemapData('Towards Data Science'));
document.getElementById('luc-tri-treemap').addEventListener('click', () => fetchTrigramTreemapData('Level Up Coding'));
document.getElementById('tai-tri-treemap').addEventListener('click', () => fetchTrigramTreemapData('Towards AI'));
document.getElementById('jr-tri-treemap').addEventListener('click', () => fetchTrigramTreemapData('Javarevisited'));
document.getElementById('det-tri-treemap').addEventListener('click', () => fetchTrigramTreemapData('Data Engineer Things'));

// Default to all
fetchTrigramTreemapData('');

// END SECTION 2.2

// SECTION 3 - LDA - all articles
const baseLdaUrl = document.getElementById('lda-visualization').dataset.url;

function loadLDA(publisher) {
    const url = publisher ? `${baseLdaUrl}${publisher}/` : baseLdaUrl;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            // Remove the <link> tag from the fetched data
            const cleanedData = data.replace(
                /<link\s+rel="stylesheet"\s+type="text\/css"\s+href="https:\/\/cdn\.jsdelivr\.net\/gh\/bmabey\/pyLDAvis@3\.4\.0\/pyLDAvis\/js\/ldavis\.v1\.0\.0\.css">|<div\s+id="ldavis_el80560130213428323584276775"\s+style="background-color:white;"><\/div>/g,
                                    ''
            );
            document.getElementById('lda-visualization').innerHTML = cleanedData;

            // Create a new script element
            const scriptMatch = cleanedData.match(/<script[^>]*>([\s\S]*?)<\/script>/);
            if (scriptMatch) {
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.text = scriptMatch[1]; // Extract script content
                document.body.appendChild(script);
            }
        })
        .catch(error => {
            console.error('Error fetching LDA data: ', error);
        });
}

// Event Listeners
document.getElementById('all-lda').addEventListener('click', () => loadLDA());
document.getElementById('tds-lda').addEventListener('click', () => loadLDA('Towards Data Science'));
document.getElementById('luc-lda').addEventListener('click', () => loadLDA('Level Up Coding'));
document.getElementById('tai-lda').addEventListener('click', () => loadLDA('Towards AI'));
document.getElementById('jr-lda').addEventListener('click', () => loadLDA('Javarevisited'));
document.getElementById('det-lda').addEventListener('click', () => loadLDA('Data Engineer Things'));

// Call Initial Load
loadLDA(); // Load default LDA data
// END SECTION 3

// SECTION 4 - LDA - above average articles
const aboveAvgLdaUrl = document.getElementById('abv-lda-visualization').dataset.url;

function loadAbvLDA(publisher) {
    const url = publisher ? `${aboveAvgLdaUrl}${publisher}/` : aboveAvgLdaUrl;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            // Remove the <link> tag from the fetched data
            const cleanedData = data.replace(
                /<link\s+rel="stylesheet"\s+type="text\/css"\s+href="https:\/\/cdn\.jsdelivr\.net\/gh\/bmabey\/pyLDAvis@3\.4\.0\/pyLDAvis\/js\/ldavis\.v1\.0\.0\.css">|<div\s+id="ldavis_el80560130213428323584276775"\s+style="background-color:white;"><\/div>/g,
                                    ''
            );
            document.getElementById('abv-lda-visualization').innerHTML = cleanedData;

            // Create a new script element
            const scriptMatch = cleanedData.match(/<script[^>]*>([\s\S]*?)<\/script>/);
            if (scriptMatch) {
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.text = scriptMatch[1];
                document.body.appendChild(script);
            }
        })
        .catch(error => {
            console.error('Error fetching LDA data: ', error);
        });
}

// Event Listeners
document.getElementById('all-abv-lda').addEventListener('click', () => loadAbvLDA());
document.getElementById('tds-abv-lda').addEventListener('click', () => loadAbvLDA('Towards Data Science'));
document.getElementById('luc-abv-lda').addEventListener('click', () => loadAbvLDA('Level Up Coding'));
document.getElementById('tai-abv-lda').addEventListener('click', () => loadAbvLDA('Towards AI'));
document.getElementById('jr-abv-lda').addEventListener('click', () => loadAbvLDA('Javarevisited'));
document.getElementById('det-abv-lda').addEventListener('click', () => loadAbvLDA('Data Engineer Things'));

// Call Initial Load
loadAbvLDA();
// END SECTION 4