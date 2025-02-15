let data = [];
let commits = [];

async function loadData() {
    data = await d3.csv('loc.csv', (row) => ({
        ...row,
        line: Number(row.line),
        depth: Number(row.depth),
        length: Number(row.length),
        date: new Date(row.date + 'T00:00' + row.timezone),
        datetime: new Date(row.datetime),
    }));

    displayStats();  
}

function processCommits() {
    commits = d3
      .groups(data, (d) => d.commit)
      .map(([commit, lines]) => {
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;
        let ret = {
          id: commit,
          url: 'https://github.com/pranavrajaram/portfolio/commit/' + commit,
          author,
          date,
          time,
          timezone,
          datetime,
          hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
          totalLines: lines.length,
        };

        Object.defineProperty(ret, "lines", {
            value: lines,
            enumerable: false,
            writable: true,
            configurable: true,
          });
    
          return ret;
        });
}

function displayStats() {
    processCommits();
  
    const dl = d3.select("#stats").append("dl").attr("class", "stats");
  
    const totalLoc = dl.append("div");
    totalLoc.append("dt").html('Total <abbr title="Lines of code">LOC</abbr>');
    totalLoc.append("dd").text(data.length);
  
    const totalCommits = dl.append("div");
    totalCommits.append("dt").text("Total commits");
    totalCommits.append("dd").text(commits.length);
  
    const totalFiles = dl.append("div");
    totalFiles.append("dt").text("Number of files");
    totalFiles.append("dd").text(d3.group(data, (d) => d.file).size);
  
    const fileLengths = d3.rollups(
      data,
      (v) => d3.max(v, (v) => v.line),
      (d) => d.file
    );
    const averageFileLength = d3.mean(fileLengths, (d) => d[1]);
    const avgFileLength = dl.append("div");
    avgFileLength.append("dt").text("Average file length");
    avgFileLength.append("dd").text(Math.round(averageFileLength));
  
    const fileDepths = d3.rollups(
      data,
      (v) => d3.max(v, (v) => v.depth),
      (d) => d.file
    );
    const averageDepth = d3.mean(fileDepths, (d) => d[1]);
    const avgFileDepth = dl.append("div");
    avgFileDepth.append("dt").text("Average file depth");
    avgFileDepth.append("dd").text(Math.round(averageDepth));
  
    const workByPeriod = d3.rollups(
      data,
      (v) => v.length,
      (d) => new Date(d.datetime).toLocaleString('en', { dayPeriod: 'short' })
    );
    const maxPeriod = d3.greatest(workByPeriod, (d) => d[1])?.[0];
    const timeOfDay = dl.append("div");
    timeOfDay.append("dt").text("Most productive time of day");
    timeOfDay.append("dd").text(maxPeriod);

    // Now call the scatterplot after commits are processed
    createScatterplot(commits);
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    // Remove createScatterplot() here since it's already called in displayStats
    brushSelector();
});

function createScatterplot(commits) {
   const width = 1000;
   const height = 600;

   const svg = d3
     .select('#chart')
     .append('svg')
     .attr('viewBox', `0 0 ${width} ${height}`)
     .style('overflow', 'visible');

   const margin = { top: 10, right: 10, bottom: 30, left: 20 };
   const usableArea = {
     top: margin.top,
     right: width - margin.right,
     bottom: height - margin.bottom,
     left: margin.left,
     width: width - margin.left - margin.right,
     height: height - margin.top - margin.bottom,
   };

   // Make sure commits are properly passed
   if (commits.length === 0) {
      console.log('No commits data available');
      return;
   }

   const xScale = d3
     .scaleTime()
     .domain(d3.extent(commits, (d) => d.datetime))
     .range([0, width])
     .nice();

   const yScale = d3.scaleLinear().domain([0, 24]).range([height, 0]);

   xScale.range([usableArea.left, usableArea.right]);
   yScale.range([usableArea.bottom, usableArea.top]);

   const dots = svg.append('g').attr('class', 'dots');

   dots
     .selectAll('circle')
     .data(commits)
     .join('circle')
     .attr('cx', (d) => xScale(d.datetime))
     .attr('cy', (d) => yScale(d.hourFrac))
     .attr('r', 5)
     .attr('fill', 'steelblue');

   const xAxis = d3.axisBottom(xScale);
   const yAxis = d3.axisLeft(yScale).tickFormat((d) => String(d % 24).padStart(2, '0') + ':00');

   svg
     .append('g')
     .attr('transform', `translate(0, ${usableArea.bottom})`)
     .call(xAxis);

   svg
     .append('g')
     .attr('transform', `translate(${usableArea.left}, 0)`)
     .call(yAxis);

   const gridlines = svg
     .append('g')
     .attr('class', 'gridlines')
     .attr('transform', `translate(${usableArea.left}, 0)`);

   gridlines.call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width));
   gridlines
     .selectAll('line')
     .style('stroke', (d) => (d < 6 || d >= 18 ? 'blue' : 'orange'));
}