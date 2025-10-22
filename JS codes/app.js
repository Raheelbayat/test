let capsules = [];
let capsuleContainer, capsuleInput, capsuleLevel;

// ---------------- Pages ---------------- //

function renderLibrary() {
  document.getElementById("entry").innerHTML = `
    <div class="container my-4">
      <div class="p-4 bg-light rounded-3 shadow-sm mb-3 d-flex justify-content-between align-items-center">
        <h3>Your Capsules</h3>
        <button class="btn btn-primary1 fw-bold" id="addCapsLibrary">Add Capsule</button>
      </div>
      <div id="capsuleContainer"></div>
      <div id="noCapsulesMsg" class="p-4 bg-light rounded-3 shadow-sm text-center mt-3">
        <h3>No capsules yet</h3>
        <p>Create a new capsule in Author page.</p>
      </div>
    </div>
  `;

  capsuleContainer = document.getElementById("capsuleContainer");
  updateLibraryCapsules();

  document.getElementById("addCapsLibrary").addEventListener("click", () => {
    renderAuthor();
  });
}

function renderAuthor() {
  document.getElementById("entry").innerHTML = `
    <div class="container my-4">
      <div class="p-4 bg-light rounded-3 shadow-sm mb-3">
        <h3>Create Capsule</h3>
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
            <button class="btn btn-primary1 fw-bold" id="addCapsBtn">Add Capsule</button>
            <button class="btn btn-json fw-bold" id="importJsonBtn">Import JSON</button>
            <button class="btn fw-bold" id="exportAllBtn">Export All</button>
          </div>
        </div>
      </div>

      <div id="capsuleContainer"></div>
      <div id="noCapsulesMsg" class="p-4 bg-light rounded-3 shadow-sm text-center mt-3">
        <h3>No capsules yet</h3>
        <p>Create a capsule or import JSON to get started.</p>
      </div>
    </div>
  `;

  capsuleContainer = document.getElementById("capsuleContainer");
  capsuleInput = document.getElementById("capsuleInput");
  capsuleLevel = document.getElementById("capsuleLevel");

  document.getElementById("addCapsBtn").addEventListener("click", handleAddCapsule);
  capsuleInput.addEventListener("keydown", e => {
    if(e.key === "Enter") handleAddCapsule();
  });
  document.getElementById("importJsonBtn").addEventListener("click", importJSON);
  document.getElementById("exportAllBtn").addEventListener("click", exportAllJSON);

  updateAuthorCapsules();
}

function renderLearn() {
  document.getElementById("entry").innerHTML = `
    <div class="container my-4">
      <h1>Learn Page</h1>
      <p>This is where learning happens!</p>
    </div>
  `;
}

// ---------------- Capsule Functions ---------------- //

function handleAddCapsule() {
  const text = capsuleInput.value.trim();
  const level = capsuleLevel.value;

  if(!text) return alert("Please enter text for the capsule!");
  capsules.push({ text, level });
  saveCapsules();
  capsuleInput.value = "";
  updateAuthorCapsules();
}

function updateAuthorCapsules() {
  if(!capsuleContainer) return;
  capsuleContainer.innerHTML = "";

  if(capsules.length === 0) {
    document.getElementById("noCapsulesMsg").style.display = "block";
  } else {
    document.getElementById("noCapsulesMsg").style.display = "none";
    capsules.forEach((c, i) => {
      const div = document.createElement("div");
      div.className = "p-3 mb-3 bg-light rounded shadow-sm capsule position-relative";
      div.innerHTML = `
        <span class="delete-cross">&times;</span>
        <div class="d-flex justify-content-between align-items-center mb-2">
          <small>Updated: ${new Date().toLocaleString()}</small>
          <small class="text-secondary">${c.level}</small>
        </div>
        <p>${c.text}</p>
        <div class="d-flex justify-content-start gap-2 mt-2">
          <button class="btn btn-pink">Learn</button>
          <button class="btn btn-lightblue">Edit</button>
          <button class="btn btn-lightgreen">Export</button>
          <button class="btn btn-salmon">Delete</button>
        </div>
      `;

      const deleteBtn = div.querySelector(".delete-cross");
      deleteBtn.addEventListener("click", () => {
        capsules.splice(i,1);
        saveCapsules();
        updateAuthorCapsules();
      });

      const btnDelete = div.querySelector(".btn-salmon");
      btnDelete.addEventListener("click", () => {
        capsules.splice(i,1);
        saveCapsules();
        updateAuthorCapsules();
      });

      const btnEdit = div.querySelector(".btn-lightblue");
      btnEdit.addEventListener("click", () => {
        const newText = prompt("Edit capsule text:", c.text);
        if(newText !== null) {
          capsules[i].text = newText;
          saveCapsules();
          updateAuthorCapsules();
        }
      });

      const btnExport = div.querySelector(".btn-lightgreen");
      btnExport.addEventListener("click", () => {
        navigator.clipboard.writeText(JSON.stringify(c, null, 2))
          .then(()=> alert("Capsule copied!"));
      });

      const btnLearn = div.querySelector(".btn-pink");
      btnLearn.addEventListener("click", () => alert("Learn clicked!"));

      capsuleContainer.prepend(div);
    });
  }
}

function updateLibraryCapsules() {
  capsuleContainer = document.getElementById("capsuleContainer");
  if(!capsuleContainer) return;
  capsuleContainer.innerHTML = "";
  if(capsules.length === 0) {
    document.getElementById("noCapsulesMsg").style.display = "block";
  } else {
    document.getElementById("noCapsulesMsg").style.display = "none";
    capsules.forEach(c => {
      const div = document.createElement("div");
      div.className = "p-3 mb-3 bg-light rounded shadow-sm capsule";
      div.innerHTML = `<p>${c.text} - <small>${c.level}</small></p>`;
      capsuleContainer.append(div);
    });
  }
}

// ---------------- LocalStorage ---------------- //

function saveCapsules() {
  localStorage.setItem("capsules", JSON.stringify(capsules));
}

function loadCapsules() {
  capsules = JSON.parse(localStorage.getItem("capsules") || "[]");
}

// ---------------- JSON ---------------- //

function importJSON() {
  const json = prompt("Paste your JSON array of capsules:");
  if(!json) return;
  try {
    const arr = JSON.parse(json);
    if(Array.isArray(arr)) {
      arr.forEach(item => capsules.push({ text: item.text || item, level: item.level || "Beginner" }));
      saveCapsules();
      updateAuthorCapsules();
    } else {
      alert("JSON must be an array!");
    }
  } catch(e) {
    alert("Invalid JSON: " + e.message);
  }
}

function exportAllJSON() {
  navigator.clipboard.writeText(JSON.stringify(capsules, null,2))
    .then(()=> alert("All capsules copied!"));
}

// ---------------- Navigation ---------------- //

document.getElementById("nav-library").addEventListener("click", renderLibrary);
document.getElementById("nav-author").addEventListener("click", renderAuthor);
document.getElementById("nav-learn").addEventListener("click", renderLearn);

// ---------------- Init ---------------- //
loadCapsules();
renderLibrary();
