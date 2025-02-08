import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

let fetch_url = location.pathname.includes('/portfolio/') 
    ? '/portfolio/lib/projects.json' 
    : '../lib/projects.json';

const projects = await fetchJSON(fetch_url);
const projectsContainer = document.querySelector('.projects');
const projectsTitle = document.querySelector('.projects-title');
const searchInput = document.querySelector('.searchBar');

let selectedIndex = -1;
let query = '';

function renderPieChart(projectsGiven) {

    let rolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );

    let data = rolledData.map(([year, count]) => {
        return { value: count, label: year };
    });

    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let sliceGenerator = d3.pie().value((d) => d.value);

    let arcData = sliceGenerator(data);
    let arcs = arcData.map((d) => arcGenerator(d));
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    let svg = d3.select('svg');
    svg.selectAll('path').remove();

    let legend = d3.select('.legend');
    legend.selectAll('*').remove();

    arcs.forEach((arc, i) => {
        svg
            .append('path')
            .attr('d', arc)
            .attr('fill', colors(i))
            .attr('class', i === selectedIndex ? 'selected' : '')
            .on('click', () => {
                selectedIndex = selectedIndex === i ? -1 : i;

                svg
                    .selectAll('path')
                    .attr('class', (_, idx) => idx === selectedIndex ? 'selected' : '');

                legend
                    .selectAll('li')
                    .attr('class', (_, idx) => idx === selectedIndex ? 'selected' : '');

                if (selectedIndex === -1) {
                    renderProjects(projects, projectsContainer, 'h2');
                } else {
                    let selectedYear = data[selectedIndex].label;
                    let filteredProjects = projects.filter(p => p.year === selectedYear);
                    renderProjects(filteredProjects, projectsContainer, 'h2');
                }
            });
    });

    data.forEach((d, idx) => {
        legend.append('li')
            .attr('class', idx === selectedIndex ? 'selected' : '')
            .attr('style', `--color:${colors(idx)}`)
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    });
}

projectsTitle.textContent = `${projects.length} Projects`;
renderProjects(projects, projectsContainer, 'h2');
renderPieChart(projects);

searchInput.addEventListener('input', (event) => {
    query = event.target.value;
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });

    selectedIndex = -1;
    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
});