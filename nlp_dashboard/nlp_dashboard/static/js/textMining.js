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
// END SECTION 1.2


// SECTION 2.1 TABLE - Trigram
// END SECTION 2.1

// SECTION 2.2 TREEMAP - Trigram
// END SECTION 2.2

// SECTION 3 - LDA - all articles
// END SECTION 3

// SECTION 4 - LDA - above average articles
// END SECTION 4