console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'resume/', title: 'Resume' },
  { url: 'meta/', title: 'Meta' },
  { url: 'https://github.com/alexfrederick1/portfolio/', title: 'Github' }
];

const ARE_WE_HOME = document.documentElement.classList.contains('home');

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;
  url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add('current');
  }
  if (a.host !== location.host) {
    a.target = '_blank';
  }
  nav.append(a);
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
      <label class="color-scheme">
          Theme:
          <select id="theme-switcher">
              <option value="light dark" selected>Automatic</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
          </select>
      </label>
    `
);

const selectElement = document.getElementById("theme-switcher");
const savedColorScheme = localStorage.getItem("colorScheme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
selectElement.value = savedColorScheme || (prefersDark ? "dark" : "light");

function setColorScheme(colorScheme) {
  document.documentElement.style.setProperty('color-scheme', colorScheme);
  localStorage.setItem("colorScheme", colorScheme);
}

selectElement.addEventListener('input', function (event) {
  document.documentElement.style.setProperty('color-scheme', event.target.value);
  localStorage.colorScheme = event.target.value;
  console.log('color scheme changed to', event.target.value);
});

export async function fetchJSON(url) {
  try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }
      const data = await response.json();
      return data; 
  } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
  }
}

function displayProjects(projects) {
  const projectsContainer = document.querySelector('.projects');
  if (!projectsContainer) {
    console.error('Projects container not found!');
    return;
  }
  projectsContainer.innerHTML = '';

  projects.forEach(project => {
    const projectArticle = document.createElement('article');
    const titleElement = document.createElement('h2');
    titleElement.textContent = project.title;
    projectArticle.appendChild(titleElement);

    const imageElement = document.createElement('img');
    imageElement.setAttribute('src', project.image);
    imageElement.setAttribute('alt', project.title);
    projectArticle.appendChild(imageElement);

    const descriptionWrapper = document.createElement('div');
    descriptionWrapper.style.fontFamily = 'Baskerville, serif';
    
    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = project.description;
    descriptionWrapper.appendChild(descriptionElement);

    const yearElement = document.createElement('p');
    yearElement.textContent = project.year;
    yearElement.style.color = 'gray';
    yearElement.style.fontVariantNumeric = 'oldstyle-nums';
    descriptionWrapper.appendChild(yearElement);

    projectArticle.appendChild(descriptionWrapper);
    projectsContainer.appendChild(projectArticle);
  });
}

fetchJSON('path/to/your/projects.json').then(data => {
  if (data) {
    displayProjects(data);
  }
});

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';

  for(let project of projects){
    const article = document.createElement('article');
    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <div style="font-family: Baskerville, serif;">
        <p>${project.description}</p>
        <p style="color: gray; font-variant-numeric: oldstyle-nums;">${project.year}</p>
      </div>
    `;
    containerElement.appendChild(article);
  }
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}
