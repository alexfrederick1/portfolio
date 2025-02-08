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
    // Rollup data by year and count occurrences correctly
    let rolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year
    );

    // Ensure data is rolled up properly
    let data = rolledData.map(([year, count]) => ({ value: count, label: year }));

    console.log("Rolled Data:", data); // Debugging the rolled data to check

    // Arc Generator and Pie Chart Setup
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(80);
    let sliceGenerator = d3.pie().value((d) => d.value); // Automatically calculates angles for slices
    let arcData = sliceGenerator(data);

    console.log("Arc Data:", arcData); // Debugging the arc data to check

    // Color scale for distinct colors for each slice
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    // Set up the SVG element
    let svg = d3.select('.pie-chart-container').select('svg');
    if (svg.empty()) {
        svg = d3.select('.pie-chart-container')
            .append('svg')
            .attr('width', 200)
            .attr('height', 200);
    }
    svg.selectAll('*').remove(); // Clear previous chart if exists

    const g = svg.append('g').attr('transform', 'translate(100, 100)');

    // Create pie chart slices (arcs)
    g.selectAll('path')
        .data(arcData)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', (_, i) => colors(i)) // Assign color to each slice
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

    // Render legend
    const legend = d3.select('.legend');
    legend.html('');  // Clear previous legend
    data.forEach((d, idx) => {
        legend.append('li')
            .attr('class', idx === selectedIndex ? 'selected' : '')
            .attr('style', `--color:${colors(idx)}`)
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    });

    projectsTitle.textContent = `${projects.length} Projects`;
}

// Initial rendering of projects and pie chart
renderProjects(projects, projectsContainer, 'h2');
renderPieChart(projects);

// Search functionality
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
