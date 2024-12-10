export function toProperCase(string) {
  return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
    return parent.querySelector(selector);
  }
  // or a more concise version if you are into that sort of thing:
  // export const qs = (selector, parent = document) => parent.querySelector(selector);
  
  // retrieve data from localstorage
  export function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  }
  // save data to local storage
  export function setLocalStorage(key, data) {
    if (!Array.isArray(data)) {
      data = [data]; // Wrap the single item in an array
    }
    localStorage.setItem(key, JSON.stringify(data));
  }
  // set a listener for both touchend and click
  export function setClick(selector, callback) {
    qs(selector).addEventListener("touchend", (event) => {
      event.preventDefault();
      callback();
    });
    qs(selector).addEventListener("click", callback);
  }
  // get item details
  export function getParams(param) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const product = urlParams.get(param)
    return product
  }
  // generates content with HTML template 
  export async function renderListWithTemplate(template, parentElement, list, position="afterbegin", clear=false) {
    if (clear) {
      parentElement.insertAdjacentHTML(position, ``); 
    } else {
      const html = list.map(template);
      parentElement.insertAdjacentHTML(position, html.join(""));
    }
  }
  
  export function renderWithTemplate(template, parentElement, position="afterbegin", date, callback) {
    parentElement.insertAdjacentHTML(position, template);
    if (callback) {
      callback(data);
    }
  }
  
  export async function loadHeaderFooter(callback=null) {
    //Load the header and footer and nav templates in from our partials
    const headerTemplate = await loadTemplate("../partials/header.html");
    const footerTemplate = await loadTemplate("../partials/footer.html");
    const navTemplate = await loadTemplate("../partials/nav.html");
  
    // Grab the header and footer and nav elements out of the DOM.
    const headerElement = qs("header");
    const footerElement = qs("footer");
    const navElement = qs("nav");
  
    // Render the header and footer and nav
    renderWithTemplate(headerTemplate, headerElement);
    renderWithTemplate(footerTemplate, footerElement);
    renderWithTemplate(navTemplate, navElement);
    if (callback) {
      callback()
    }
  }

  export async function loadHeaderFooterMain(callback=null) {
    //Load the header and footer and nav templates in from our partials
    const headerTemplate = await loadTemplate("./partials/header.html");
    const footerTemplate = await loadTemplate("./partials/footer.html");
    const navTemplate = await loadTemplate("./partials/nav.html");
  
    // Grab the header and footer and nav elements out of the DOM.
    const headerElement = qs("header");
    const footerElement = qs("footer");
    const navElement = qs("nav");
  
    // Render the header and footer and nav
    renderWithTemplate(headerTemplate, headerElement);
    renderWithTemplate(footerTemplate, footerElement);
    renderWithTemplate(navTemplate, navElement);
    if (callback) {
      callback()
    }
  }
  
  async function loadTemplate(path) {
    const responce = await fetch(path);
    const template = await responce.text();
    return template;
  }
  // alerts
  export function alertMessage(message, scroll=true) {
    const alert = document.createElement('div');
    alert.classList.add('alert');
    alert.innerHTML = `<p>${message}</p><span>X</span>`;
  
    alert.addEventListener('click', function(e) {
        if(e.target.tagName == "SPAN") {
          main.removeChild(this);
        }
    })
    const main = document.querySelector('main');
    main.prepend(alert);
    if(scroll)
      window.scrollTo(0,0);
  }
  
  export function clearAlerts() {
    const alerts = document.querySelectorAll('.alert');
  
    alerts.forEach(alert => {
      document.querySelector("main").removeChild(alert);
    }); 
  }