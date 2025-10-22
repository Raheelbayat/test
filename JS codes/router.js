import { initCapsules } from "./capsules.js";

const Router = {
  routes: {
    "/": () => `
      <div id="firstContainer">  
        <div>
          <h1>Your Capsules</h1>
          <p>Welcome! Create and manage your learning capsules.</p>
          <div class="container my-4">
            <button class="btn btn-primary1 fw-bold" id="newCapsBtnFromLibrary">Add Capsule</button>
          </div>
          <div id="noCapsulesMsg" class="p-4 bg-light rounded-3 shadow-sm text-center mt-3">
            <h3>No capsules yet</h3>
            <p>Create a capsule or import JSON to get started.</p>
          </div>
        </div>
      </div>
    `,
    "/author": () => `
      <div>
        <div id="authorControls" class="row align-items-center mt-3 g-2">
          <div class="col-md-6 mb-2 mb-md-0">
            <input type="text" id="capsuleInput" class="form-control" placeholder="Add your text here">
          </div>
          <div class="col-md-3 mb-2 mb-md-0">
            <select id="capsuleLevel" class="form-select">
              <option value="Beginner" selected>Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div class="col-md-3 d-flex justify-content-end gap-2">
            <button class="btn btn-primary1 fw-bold" id="newCapsBtn">Add Capsule</button>
            <button class="btn btn-json fw-bold" id="importJsonBtn">Import JSON</button>
            <button class="btn fw-bold" id="exportAllBtn">Export All</button>
          </div>
        </div>

        <div id="capsuleContainer" class="mt-4"></div>
        <div id="noCapsulesMsg" class="p-4 bg-light rounded-3 shadow-sm text-center mt-3">
          <h3>No capsules yet</h3>
          <p>Create a capsule or import JSON to get started.</p>
        </div>
      </div>
    `,
    "/library": () => `
      <h1>Library Page</h1>
      <p>View all your capsules here.</p>
      <div class="container my-4">
        <button class="btn btn-primary1 fw-bold" id="newCapsBtnFromLibrary">Add Capsule</button>
      </div>
    `
  },

  init: () => {
    // wait until DOM is loaded
    window.addEventListener("DOMContentLoaded", () => {
      // Nav link clicks
      document.querySelectorAll("a.nav-link").forEach(link => {
        link.addEventListener("click", e => {
          e.preventDefault();
          const route = link.getAttribute("href");
          Router.nav(route);
        });
      });

      // Popstate
      window.addEventListener("popstate", e => {
        const route = e.state?.route || "/";
        Router.nav(route, false);
      });

      Router.nav(window.location.pathname, false);
    });
  },

  nav: (route, addToHistory = true) => {
    if (addToHistory) history.pushState({ route }, null, route);

    const entry = document.querySelector("#entry");
    if (!entry) {
      console.error("Router container #entry not found!");
      return;
    }

    entry.innerHTML = Router.routes[route]?.() || "<h1>Page not found</h1>";

    // Initialize capsules only on author page
    if (route === "/author") initCapsules();

    // Library "Add Capsule" button
    const addCapsFromLibrary = document.getElementById("newCapsBtnFromLibrary");
    if (addCapsFromLibrary) {
      addCapsFromLibrary.addEventListener("click", () => Router.nav("/author"));
    }

    window.scrollTo(0, 0);
  }
};

export default Router;
