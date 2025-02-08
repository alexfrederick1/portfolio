import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');

const projectsTitle = document.querySelector('.projects-title');
projectsTitle.textContent = `${projects.length} Projects`;

let selectedIndex = -1;

function renderPieChart(projectsGiven) {
    let svg = d3.select('.pie-chart-container').select('svg'); 
    if (svg.empty()) {
        svg = d3.select('.pie-chart-container')
            .append('svg')
            .attr('width', 200)
            .attr('height', 200);
    }

    svg.selectAll('*').remove();

    const legend = d3.select('.legend');
    legend.html('');

    let rolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year
    );

    let data = rolledData.map(([year, count]) => ({ value: count, label: year }));

    let arcGenerator = d3.arc().innerRadius(0).outerRadius(80);
    let sliceGenerator = d3.pie().value((d) => d.value);
    let arcData = sliceGenerator(data);

    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    const g = svg.append('g').attr('transform', 'translate(100, 100)');

    g.selectAll('path')
        .data(arcData)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', (_, i) => colors(i))
        .attr('class', (_, i) => i === selectedIndex ? 'selected' : '')
        .on('click', (_, i) => {
            selectedIndex = selectedIndex === i ? -1 : i;

            g.selectAll('path')
                .attr('class', (_, idx) => idx === selectedIndex ? 'selected' : '');

            legend.selectAll('li')
                .attr('class', (_, idx) => idx === selectedIndex ? 'selected' : '');

            let filteredProjects = (selectedIndex === -1) 
                ? projectsGiven 
                : projectsGiven.filter(p => p.year === data[selectedIndex].label);

            renderProjects(filteredProjects, projectsContainer, 'h2');
        });

    legend.selectAll('li')
        .data(data)
        .enter()
        .append('li')
        .attr('class', (_, idx) => idx === selectedIndex ? 'selected' : '')
        .attr('style', (_, idx) => `--color:${colors(idx)}`)
        .html((d) => `<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);

    projectsTitle.textContent = `${projects.length} Projects`;
    renderProjects(projects, projectsContainer, 'h2');
}

renderProjects(projects, projectsContainer, 'h2');
renderPieChart(projects);