console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

document.addEventListener('DOMContentLoaded', () => {
  // Step 3.1: Define pages
  let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'resume/', title: 'Resume' }
    // Add any other pages here
  ];

  // Check if we're on the home page
  const ARE_WE_HOME = document.documentElement.classList.contains('home');

  // Create <nav> element
  let nav = document.createElement('nav');
  document.body.prepend(nav);  // Insert it at the top of the body

  // Step 3.1: Loop through the pages and create links
  for (let p of pages) {
    let url = p.url;
    let title = p.title;

    // Adjust URL if not on the home page
    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;

    // Create <a> element
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;

    // Add the 'current' class if it's the current page
    if (a.host === location.host && a.pathname === location.pathname) {
      a.classList.add('current');
    }

    // Open external links in a new tab (e.g., GitHub link)
    if (a.host !== location.host) {
      a.target = '_blank';
    }

    // Append the link to the navigation
    nav.append(a);
  }

  // ** Step 2 Update (Retaining previous logic for highlighting current page) **
  // Get all nav links (this is no longer strictly needed but kept for previous structure)
  const navLinks = $$('nav a');
  
  // Find the link to the current page (for backward compatibility or debugging)
  const currentLink = navLinks.find(
    (a) => a.host === location.host && a.pathname === location.pathname
  );
  
  // Add the 'current' class if the link is found, with optional chaining
  currentLink?.classList.add('current');
  
  // Step 4.2: Adding HTML for the dark mode switch
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

  // Step 4.4: Actually making it work (Setting the color scheme)
  const selectElement = document.getElementById("theme-switcher");

  // Set initial value based on the system's color scheme or from localStorage
  const savedColorScheme = localStorage.getItem("colorScheme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  selectElement.value = savedColorScheme || (prefersDark ? "dark" : "light");

  // Function to apply the selected color scheme
  function setColorScheme(colorScheme) {
    document.documentElement.style.setProperty('color-scheme', colorScheme);
    localStorage.setItem("colorScheme", colorScheme); // Save the preference to localStorage
  }

  // Apply the color scheme when the user selects an option
  selectElement.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    setColorScheme(event.target.value);
  });

  // Step 4.5: Persist the color scheme across page loads (already done)
  setColorScheme(selectElement.value); // Apply the color scheme on initial load
});
