let data = [];
let commits = [];

// Step 1.1: Load the CSV file
async function loadData() {
    data = await d3.csv('loc.csv', (row) => ({
        ...row,
        line: Number(row.line), // Convert line to number
        depth: Number(row.depth),
        length: Number(row.length),
        date: new Date(row.date + 'T00:00' + row.timezone),
        datetime: new Date(row.datetime),
    }));

    processCommits(); // Process the commit data once the CSV is loaded
    displayStats();   // Display the computed stats
}

// Step 1.2: Process commit data
function processCommits() {
    commits = d3.groups(data, (d) => d.commit).map(([commit, lines]) => {
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;

        return {
            id: commit,
            url: 'https://github.com/YOUR_REPO/commit/' + commit,
            author,
            date,
            time,
            timezone,
            datetime,
            hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
            totalLines: lines.length,
        };
    });

    console.log(commits); // Log commits to verify data
}

// Step 1.3: Display the stats
function displayStats() {
    const dl = d3.select('#stats').append('dl').attr('class', 'stats');
    
    dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
    dl.append('dd').text(data.length);

    dl.append('dt').text('Total commits');
    dl.append('dd').text(commits.length);

    // Add more stats as needed, for example:
    const maxDepth = d3.max(data, d => d.depth);
    dl.append('dt').text('Maximum depth');
    dl.append('dd').text(maxDepth);
}

// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
});
