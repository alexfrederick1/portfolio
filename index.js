import { fetchGitHubData, renderProjects } from './global.js';

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

async function loadGitHubProfile() {
  try {
    const githubData = await fetchGitHubData('alexfrederick1'); // replace with your GitHub username

    const githubProfileContainer = document.querySelector('.github-profile');

    const usernameElement = document.createElement('h3');
    usernameElement.textContent = githubData.login;

    const bioElement = document.createElement('p');
    bioElement.textContent = githubData.bio || 'No bio available';

    const avatarElement = document.createElement('img');
    avatarElement.src = githubData.avatar_url;
    avatarElement.alt = `${githubData.login}'s avatar`;
    avatarElement.width = 100;

    const repoCountElement = document.createElement('p');
    repoCountElement.textContent = `Public Repositories: ${githubData.public_repos}`;

    githubProfileContainer.appendChild(usernameElement);
    githubProfileContainer.appendChild(bioElement);
    githubProfileContainer.appendChild(avatarElement);
    githubProfileContainer.appendChild(repoCountElement);
  } catch (error) {
    console.error('Error loading GitHub profile:', error);
  }
}

loadLatestProjects();
loadGitHubProfile();
