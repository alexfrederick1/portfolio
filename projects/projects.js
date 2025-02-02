import { fetchJSON, renderProjects } from '../global.js';

async function loadProjects() {
  try {
    const projects = await fetchJSON('../lib/projects.json');
    const projectsContainer = document.querySelector('.projects');
    const projectsTitle = document.querySelector('.projects-title');

    if (projects && projects.length > 0) {
      renderProjects(projects, projectsContainer, 'h2');
      projectsTitle.textContent = `Projects: Alex Frederick (${projects.length} projects)`;
    } else {
      const placeholderMessage = document.createElement('p');
      placeholderMessage.textContent = 'No projects available at the moment.';
      projectsContainer.appendChild(placeholderMessage);
      projectsTitle.textContent = 'Projects: Alex Frederick (0 projects)';
    }
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

loadProjects();
