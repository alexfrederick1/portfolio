let data = [];
let commits = [];

function loadData() {
    d3.csv('loc.csv').then(function (loadedData) {
      data = loadedData;
      processCommits(data);
      displayStats(data);
    });
  }
  
  function processCommits(data) {
    commits = [
      { id: 1, author: 'Alice', datetime: '2025-02-13T08:00:00' },
      { id: 2, author: 'Bob', datetime: '2025-02-13T09:00:00' }
    ];
  }
  
  function displayStats(data) {
    const dl = d3.select('#stats').append('dl').attr('class', 'stats');
  
    dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
    dl.append('dd').text(data.length);
  
    dl.append('dt').text('Total commits');
    dl.append('dd').text(commits.length);
  
    const authors = d3.group(data, d => d.author);
    dl.append('dt').text('Total authors');
    dl.append('dd').text(authors.size);
  
    const maxDepth = d3.max(data, d => d.depth);
    dl.append('dt').text('Maximum depth');
    dl.append('dd').text(maxDepth);
  
    const avgDepth = d3.mean(data, d => d.depth);
    dl.append('dt').text('Average depth');
    dl.append('dd').text(avgDepth.toFixed(2));
  
    const workByPeriod = d3.rollups(
      data,
      v => v.length,
      d => new Date(d.datetime).toLocaleString('en', { hour: 'numeric' })
    );
    const maxPeriod = d3.greatest(workByPeriod, d => d[1])?.[0];
    dl.append('dt').text('Time of day most work is done');
    dl.append('dd').text(maxPeriod);
  }
  
  loadData();
  