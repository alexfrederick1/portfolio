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

    svg.selectAll('path')
    .data(arcData)
    .enter()
    .append('path')
    .attr('d', (d) => arcGenerator(d))
    .attr('fill', (_, i) => colors(i))
    .attr('class', (_, i) => i === selectedIndex ? 'selected' : '')
    .on('click', (_, i) => {
        selectedIndex = selectedIndex === i ? -1 : i;

        svg.selectAll('path')
            .attr('class', (_, idx) => idx === selectedIndex ? 'selected' : '');

        legend.selectAll('li')
            .attr('class', (_, idx) => idx === selectedIndex ? 'selected' : '');

        let filteredProjects = (selectedIndex === -1) 
            ? projects 
            : projects.filter(p => p.year === data[selectedIndex].label);

        renderProjects(filteredProjects, projectsContainer, 'h2');
    });

    // Append legend items
    legend.selectAll('li')
        .data(data)
        .enter()
        .append('li')
        .attr('class', (_, idx) => idx === selectedIndex ? 'selected' : '')
        .attr('style', (_, idx) => `--color:${colors(idx)}`)
        .html((d) => `<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);

    projectsTitle.textContent = `${projects.length} Projects`;
    renderProjects(projects, projectsContainer, 'h2');
    renderPieChart(projects);

    searchInput.addEventListener('input', (event) => {
        query = event.target.value.toLowerCase();
        let filteredProjects = projects.filter((project) =>
            Object.values(project).join('\n').toLowerCase().includes(query)
        );
    });

}
renderProjects(projects, projectsContainer, 'h2');