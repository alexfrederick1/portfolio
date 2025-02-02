import { fetchJSON, renderProjects } from './global.js';

async function loadLatestProjects() {
  try {
    const projects = await fetchJSON('./lib/projects.json');
    const latestProjects = projects.slice(0, 3);

    const projectsContainer = document.querySelector('.projects');
    renderProjects(latestProjects, projectsContainer, 'h2');
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

loadLatestProjects();
