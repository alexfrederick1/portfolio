import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const fetch_url = location.pathname.includes('/portfolio/') 
    ? '/portfolio/lib/projects.json' 
    : '../lib/projects.json';

const projects = await fetchJSON(fetch_url);
const projectsContainer = document.querySelector('.projects');
const projectsTitle = document.querySelector('.projects-title');
const searchInput = document.querySelector('.searchBar');

let selectedIndex = -1;
let query = '';

function renderPieChart(projectsGiven) {
    const rolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );

    const data = rolledData.map(([year, count]) => ({ value: count, label: year }));
    const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    const sliceGenerator = d3.pie().value(d => d.value);
    const arcData = sliceGenerator(data);
    const arcs = arcData.map(d => arcGenerator(d));
    const colors = d3.scaleOrdinal(d3.schemeTableau10);

    const svg = d3.select('svg').selectAll('path').remove();
    const legend = d3.select('.legend').selectAll('*').remove();

    arcs.forEach((arc, i) => {
        svg
            .append('path')
            .attr('d', arc)
            .attr('fill', colors(i))
            .attr('class', i === selectedIndex ? 'selected' : '')
            .on('click', () => {
                selectedIndex = selectedIndex === i ? -1 : i;
                svg.selectAll('path').attr('class', (_, idx) => idx === selectedIndex ? 'selected' : '');
                legend.selectAll('li').attr('class', (_, idx) => idx === selectedIndex ? 'selected' : '');
                
                updateProjectsDisplay();
            });
    });

    data.forEach((d, idx) => {
        legend.append('li')
            .attr('class', idx === selectedIndex ? 'selected' : '')
            .attr('style', `--color:${colors(idx)}`)
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    });
}

function updateProjectsDisplay() {
    const filteredProjects = selectedIndex === -1 
        ? projects 
        : projects.filter(p => p.year === data[selectedIndex].label);
    
    renderProjects(filteredProjects, projectsContainer, 'h2');
}

projectsTitle.textContent = `${projects.length} Projects`;
renderProjects(projects, projectsContainer, 'h2');
renderPieChart(projects);

searchInput.addEventListener('input', (event) => {
    query = event.target.value.toLowerCase();
    const filteredProjects = projects.filter((project) => 
        Object.values(project).join('\n').toLowerCase().includes(query)
    );

    selectedIndex = -1;
    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
});
