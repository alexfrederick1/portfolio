import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');

const projectsTitle = document.querySelector('.projects-title');
projectsTitle.textContent = `${projects.length} Projects`;

// Debugging: Check fetched data
console.log("Fetched projects:", projects);

// Group projects by year and count the number of projects in each year
let rolledData = d3.rollups(
  projects,
  (v) => v.length,
  (d) => d.year
);

// Debugging: Check grouped data
console.log("Rolled Data:", rolledData);

// Convert the grouped data into the required format
let data = rolledData.map(([year, count]) => ({
  value: count,
  label: year
}));

console.log("Final Pie Data:", data);

// Select or create an SVG element
let svg = d3.select('.projects svg');

if (svg.empty()) {
  svg = d3.select('.projects')
    .append('svg')
    .attr('width', 300)
    .attr('height', 300);
}

// Pie chart setup
let arcGenerator = d3.arc().innerRadius(0).outerRadius(100);
let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(data);
let colors = d3.scaleOrdinal(d3.schemeTableau10);

// Generate arcs
let arcs = arcData.map((d) => arcGenerator(d));

arcs.forEach((arc, idx) => {
  svg.append('path')
    .attr('d', arc)
    .attr('fill', colors(idx))
    .attr('transform', 'translate(150, 150)');  // Centering
});

// Create a legend for the pie chart
let legend = d3.select('.projects').append('ul').attr('class', 'legend');

legend.selectAll('li')
  .data(data)
  .enter()
  .append('li')
  .html((d, idx) => {
    return `
      <span class="swatch" style="background-color: ${colors(idx)};"></span>
      ${d.label} <em>(${d.value})</em>
    `;
  });

renderProjects(projects, projectsContainer, 'h2');