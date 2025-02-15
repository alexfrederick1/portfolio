// Assume commits data is an array of commit objects with datetime and hourFrac (fractional hour)
const commits = [
    { datetime: new Date('2025-02-14T09:00:00Z'), hourFrac: 9 },
    { datetime: new Date('2025-02-14T14:00:00Z'), hourFrac: 14 },
    { datetime: new Date('2025-02-14T18:00:00Z'), hourFrac: 18 },
    // More commit objects with datetime and hourFrac values...
  ];
  
  // Function to create the scatterplot
  function createScatterplot() {
    const width = 1000;
    const height = 600;
  
    const margin = { top: 10, right: 10, bottom: 30, left: 20 };
  
    const usableArea = {
      top: margin.top,
      right: width - margin.right,
      bottom: height - margin.bottom,
      left: margin.left,
      width: width - margin.left - margin.right,
      height: height - margin.top - margin.bottom,
    };
  
    const svg = d3
      .select('#chart')
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('overflow', 'visible');
  
    // Define the xScale and yScale
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(commits, (d) => d.datetime))
      .range([0, width])
      .nice();
  
    const yScale = d3.scaleLinear().domain([0, 24]).range([height, 0]);
  
    // Update scales with new ranges based on margins
    xScale.range([usableArea.left, usableArea.right]);
    yScale.range([usableArea.bottom, usableArea.top]);
  
    // Add gridlines before the axes
    const gridlines = svg
      .append('g')
      .attr('class', 'gridlines')
      .attr('transform', `translate(${usableArea.left}, 0)`);
  
    gridlines
      .call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width))
      .style('stroke', '#ddd'); // Light color for gridlines
  
    // Add circles (scatter plot)
    const dots = svg.append('g').attr('class', 'dots');
  
    dots
      .selectAll('circle')
      .data(commits)
      .join('circle')
      .attr('cx', (d) => xScale(d.datetime))
      .attr('cy', (d) => yScale(d.hourFrac))
      .attr('r', 5)
      .attr('fill', 'steelblue');
  
    // Create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).tickFormat((d) =>
      String(d % 24).padStart(2, '0') + ':00'
    );
  
    svg
      .append('g')
      .attr('transform', `translate(0, ${usableArea.bottom})`)
      .call(xAxis);
  
    svg.append('g').attr('transform', `translate(${usableArea.left}, 0)`).call(yAxis);
  }
  
  // Load data (assuming data is available or fetched)
  document.addEventListener('DOMContentLoaded', () => {
    // Assuming loadData() loads commit data from an external source (you can modify based on your needs)
    loadData().then(() => createScatterplot());
  });
  