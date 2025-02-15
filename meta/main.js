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
  }
  


document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    createScatterplot();
    brushSelector();
  });
