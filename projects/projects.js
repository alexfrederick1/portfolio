import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');

const projectsTitle = document.querySelector('.projects-title');
projectsTitle.textContent = `${projects.length} Projects`;

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

let data = [
  { value: 1, label: 'apples' },
  { value: 2, label: 'oranges' },
  { value: 3, label: 'mangos' },
  { value: 4, label: 'pears' },
  { value: 5, label: 'limes' },
  { value: 5, label: 'cherries' },
];

let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(data);

let arcs = arcData.map((d) => arcGenerator(d));

let colors = d3.scaleOrdinal(d3.schemeTableau10);

// Create container for pie chart and legend
let container = d3.select('.projects').append('div').attr('class', 'container');

// Append pie chart (SVG)
let svg = container.append('svg').attr('viewBox', '-50 -50 100 100');

arcs.forEach((arc, idx) => {
  svg.append('path')
    .attr('d', arc)
    .attr('fill', colors(idx));
});

// Create legend
let legend = container.append('ul').attr('class', 'legend');

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
