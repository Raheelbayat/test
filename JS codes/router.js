import { initCapsules } from "./capsule.js";

const Router = {
  routes: {
    "/": () => `
      <div class="container my-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 class="mb-0">Library</h3>
            <p class="text-muted mb-0">Your saved capsules</p>
          </div>
          <div class="d-flex gap-2">
            <button id="importFileBtn" class="btn btn-json">Import JSON</button>
            <button class="btn btn-primary1 fw-bold" id="newCapsBtnFromLibrary">New Capsule</button>
          </div>
        </div>

        <div id="capsuleContainer" class="container-3-for-newCapsule mt-4"></div>

        <div id="noCapsulesMsg" class="p-4 bg-light rounded-3 shadow-sm text-center mt-3">
          <h3>No capsules in library</h3>
          <p>Create a capsule or import JSON to get started.</p>
        </div>
      </div>
    `,

    "/author": () => `
      <div class="container my-4">
        <h3 class="mb-3">Create Capsule (Author)</h3>

        <form id="capsuleForm" class="mb-3">
          <div class="row g-3">
            <div class="col-md-6">
              <label for="metaTitle" class="form-label">Title *</label>
              <input type="text" id="metaTitle" class="form-control" placeholder="Capsule title">
            </div>

            <div class="col-md-6">
              <label for="metaSubject" class="form-label">Subject</label>
              <input type="text" id="metaSubject" class="form-control" placeholder="Subject or tag">
            </div>

            <div class="col-md-4">
              <label for="metaLevel" class="form-label">Level</label>
              <select id="metaLevel" class="form-select">
                <option value="Beginner" selected>Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div class="col-12">
              <label for="metaDescription" class="form-label">Description</label>
              <textarea id="metaDescription" class="form-control" rows="2" placeholder="Short description"></textarea>
            </div>
          </div>

          <hr />

          <!-- Notes editor -->
          <h5>Notes</h5>
          <p class="text-muted">Enter multiple lines; each line is one note (Markdown-lite supported).</p>
          <textarea id="notesEditor" class="form-control mb-3" rows="5" placeholder="One note per line or Markdown-lite"></textarea>

          <!-- Flashcards editor -->
          <h5 class="mt-3">Flashcards</h5>
          <div id="flashcardsContainer" class="mb-2"></div>
          <div class="mb-3">
            <button type="button" class="btn btn-json me-2" id="addFlashcardBtn">Add Flashcard</button>
          </div>

          <!-- Quiz editor -->
          <h5 class="mt-3">Quiz</h5>
          <div id="quizContainer" class="mb-2"></div>
          <div class="mb-3">
            <button type="button" class="btn btn-pink me-2" id="addQuestionBtn">Add Question</button>
          </div>

          <div class="d-flex gap-2">
            <button type="button" id="saveCapsuleBtn" class="btn btn-lightgreen">Save Capsule</button>
            <button type="button" id="clearDraftBtn" class="btn btn-salmon">Clear Draft</button>
            <button type="button" id="exportAllBtn" class="btn btn-secondary">Export All</button>
            <button type="button" id="importJsonBtn" class="btn btn-json">Import JSON</button>
          </div>
        </form>

        <div id="capsuleContainer" class="container-3-for-newCapsule mt-4"></div>

        <div id="noCapsulesMsg" class="p-4 bg-light rounded-3 shadow-sm text-center mt-3">
          <h3>No capsules yet</h3>
          <p>Create a capsule or import JSON to get started.</p>
        </div>
      </div>
    `,

    "/learn": () => `
      <div class="container my-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 class="mb-0">Learn</h3>
            <p class="text-muted mb-0">Select a capsule to study</p>
          </div>
          <div class="d-flex gap-2 align-items-center">
            <select id="selectCapsule" class="form-select"></select>
            <button id="exportSelectedBtn" class="btn btn-json">Export</button>
            <button class="btn btn-primary1" id="newCapsBtnFromLibrary">Author</button>
          </div>
        </div>

        <!-- Tabs -->
        <ul class="nav nav-tabs" id="learnTabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="notes-tab" data-bs-toggle="tab" data-bs-target="#notes" type="button" role="tab">Notes</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="flashcards-tab" data-bs-toggle="tab" data-bs-target="#flashcards" type="button" role="tab">Flashcards</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="quiz-tab" data-bs-toggle="tab" data-bs-target="#quiz" type="button" role="tab">Quiz</button>
          </li>
        </ul>

        <div class="tab-content p-3 border border-top-0" id="learnTabContent">
          <div class="tab-pane fade show active" id="notes" role="tabpanel">
            <div class="mb-2 d-flex gap-2">
              <input id="notesSearch" class="form-control" placeholder="Search notes...">
              <div id="notesCount" class="text-muted align-self-center">0</div>
            </div>
            <ul id="notesList" class="list-group"></ul>
          </div>

          <div class="tab-pane fade" id="flashcards" role="tabpanel">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <div>
                <span id="fcCounter">0 / 0</span>
                <span id="fcKnownCount" class="ms-3 text-success"></span>
              </div>
              <div class="d-flex gap-2">
                <button id="fcPrev" class="btn btn-light">Prev</button>
                <button id="fcNext" class="btn btn-light">Next</button>
                <button id="fcToggleKnown" class="btn btn-pink">Mark Known</button>
              </div>
            </div>
            <div id="flashcardCard" class="d-flex justify-content-center">
              <!-- flashcard injected here -->
            </div>
          </div>

          <div class="tab-pane fade" id="quiz" role="tabpanel">
            <div class="mb-2">
              <div id="quizProgress" class="text-muted">Question <span id="quizIndex">0</span> / <span id="quizTotal">0</span></div>
              <h5 id="quizQuestion">Select a capsule first</h5>
            </div>
            <div id="quizChoices" class="d-grid gap-2 mb-2"></div>
            <div id="quizFeedback" class="mb-2"></div>
            <div class="d-flex justify-content-between align-items-center">
              <div id="quizScore" class="fw-bold"></div>
              <div id="bestScore" class="text-muted"></div>
            </div>
          </div>
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
  // nav(route, addToHistory = true, afterRender)
  nav: (route, addToHistory = true, afterRender) => {
    const entry = document.querySelector("#entry");
    if (!entry) {
      console.error("❌ #entry element missing in HTML!");
      return;
    }

    if (addToHistory) history.pushState({ route }, "", route);

    // Inject HTML content
    entry.innerHTML = Router.routes[route]?.() || "<h1>Page not found</h1>";

    // Initialize capsule logic on routes that render #capsuleContainer (library, author, learn)
    if (route === "/author" || route === "/" || route === "/learn") initCapsules();

    // Call afterRender hook if provided (run after initCapsules)
    if (typeof afterRender === 'function') {
      try { afterRender(); } catch (err) { console.error('afterRender callback failed', err); }
    }

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
