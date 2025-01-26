console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

document.addEventListener('DOMContentLoaded', () => {
  let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'resume/', title: 'Resume' }
    { url: 'https://github.com/alexfrederick1/portfolio', title: 'Github' }
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

  const navLinks = $$('nav a');
  const currentLink = navLinks.find(
    (a) => a.host === location.host && a.pathname === location.pathname
  );
  currentLink?.classList.add('current');

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
    console.log('color scheme changed to', event.target.value);
    setColorScheme(event.target.value);
  });

  setColorScheme(selectElement.value);
});