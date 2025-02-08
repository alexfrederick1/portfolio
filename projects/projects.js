import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');

const projectsTitle = document.querySelector('.projects-title');
projectsTitle.textContent = `${projects.length} Projects`;

// some at the top might be off missing a const?

function renderPieChart(projectsGiven) {

    d3.select('svg').selectAll('*').remove();
    d3.select('.legend').html('');

    let rolledData = d3.rollups(
    projects,
    (v) => v.length,
    (d) => d.year
    );

// Convert the grouped data into the required format
    let data = rolledData.map(([year, count]) => {
    return {value: count, label: year};
    });

// Pie chart setup
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let sliceGenerator = d3.pie().value((d) => d.value);
    let arcData = sliceGenerator(data);
    let arcs = arcData.map((d) => arcGenerator(d));
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    arcs.forEach((arc, idx) => {
    d3.select('svg')
        .append('path')
        .attr('d', arc)
        .attr('fill', colors(idx));
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

}
renderProjects(projects, projectsContainer, 'h2');