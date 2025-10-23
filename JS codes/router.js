import { initCapsules } from "./capsules.js";

const Router = {
  routes: {
    "/": () => `
      <div class="container text-center my-5">
        <h1>Learn Page</h1>
        <p>Welcome! Create and manage your learning capsules.</p>
        <button class="btn btn-primary1 fw-bold mt-3" id="newCapsBtnFromLibrary">Go to Author Page</button>
      </div>
    `,

    "/author": () => `
      <div class="container my-4">
        <h3 class="mb-3">Create Capsule</h3>

        <div class="row align-items-center mt-3">
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

        <div id="capsuleContainer" class="container-3-for-newCapsule mt-4"></div>

        <div id="noCapsulesMsg" class="p-4 bg-light rounded-3 shadow-sm text-center mt-3">
          <h3>No capsules yet</h3>
          <p>Create a capsule or import JSON to get started.</p>
        </div>
      </div>
    `,

    "/library": () => `
      <div class="container text-center my-5">
        <h1>Library Page</h1>
        <p>View all your saved capsules here.</p>
        <button class="btn btn-primary1 fw-bold mt-3" id="newCapsBtnFromLibrary">Go to Author Page</button>

        <div id="capsuleContainer" class="container-3-for-newCapsule mt-4"></div>

        <div id="noCapsulesMsg" class="p-4 bg-light rounded-3 shadow-sm text-center mt-3">
          <h3>No capsules in library</h3>
          <p>Add new ones from the Author Page.</p>
        </div>
      </div>
    `
  },

  // ✅ Initialize Router
  init: () => {
    // Nav links (e.g., top navbar)
    document.querySelectorAll("a.nav-link").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        const route = link.getAttribute("href");
        Router.nav(route);
      });
    });

    // Back/forward browser navigation
    window.addEventListener("popstate", e => {
      const route = e.state?.route || "/";
      Router.nav(route, false);
    });

    // Initial page load
    Router.nav(window.location.pathname, false);
  },

  // ✅ Navigation handler
  nav: (route, addToHistory = true) => {
    const entry = document.querySelector("#entry");
    if (!entry) {
      console.error("❌ #entry element missing in HTML!");
      return;
    }

    if (addToHistory) history.pushState({ route }, "", route);

    // Inject HTML content
    entry.innerHTML = Router.routes[route]?.() || "<h1>Page not found</h1>";

    // Initialize capsule logic only on /author
    if (route === "/author") initCapsules();

    // If user clicks "Go to Author Page" on Library or Learn Page
    const addCapsFromLibrary = document.getElementById("newCapsBtnFromLibrary");
    if (addCapsFromLibrary) {
      addCapsFromLibrary.addEventListener("click", () => Router.nav("/author"));
    }

    // Scroll to top for UX
    window.scrollTo(0, 0);
  }
};

export default Router;
