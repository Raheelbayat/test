export function initCapsules() {
  const capsuleContainer = document.getElementById("capsuleContainer");
  const newCapsBtn = document.getElementById("newCapsBtn");
  const capsuleInput = document.getElementById("capsuleInput");
  const importJsonBtn = document.getElementById("importJsonBtn");
  const exportAllBtn = document.getElementById("exportAllBtn");
  const capsuleLevel = document.getElementById("capsuleLevel");
  const noCapsMsg = document.getElementById("noCapsulesMsg");

  if (!capsuleContainer || !newCapsBtn || !capsuleInput || !capsuleLevel) {
    console.error("❌ Missing one or more HTML elements in initCapsules()");
    return;
  }

  // ✅ Show or hide “No capsules yet” message
  function updateNoCapsulesMessage() {
    if (!noCapsMsg) return;
    noCapsMsg.style.display = capsuleContainer.children.length === 0 ? "block" : "none";
  }

  // ✅ Save all capsules to localStorage
  function saveCapsules() {
    const capsules = [];
    capsuleContainer.querySelectorAll(".capsule").forEach(c => {
      const text = c.querySelector("p")?.textContent || "";
      const level = c.querySelector(".capsule-level")?.textContent || "Unknown";
      capsules.push({ text, level });
    });
    localStorage.setItem("capsules", JSON.stringify(capsules));
  }

  // ✅ Create a capsule card
  function createCapsule(text, levelValue = "Beginner") {
    if (!text) return;
    if (noCapsMsg) noCapsMsg.style.display = "none";

    const capsule = document.createElement("div");
    capsule.className = "p-3 mb-3 bg-light rounded shadow-sm capsule position-relative";

    // Header with time + level
    const header = document.createElement("div");
    header.className = "d-flex justify-content-between align-items-center mb-2";

    const time = document.createElement("small");
    time.textContent = `Updated: ${new Date().toLocaleString()}`;

    const level = document.createElement("small");
    level.textContent = levelValue;
    level.classList.add("capsule-level", "text-secondary");

    header.append(time, level);

    // Capsule text
    const capsuleText = document.createElement("p");
    capsuleText.textContent = text;

    // Buttons row
    const buttons = document.createElement("div");
    buttons.className = "d-flex justify-content-start gap-2 mt-2";

    const btnLearn = document.createElement("button");
    btnLearn.textContent = "Learn";
    btnLearn.className = "btn btn-pink";
    btnLearn.addEventListener("click", () => alert("Learn clicked!"));

    const btnEdit = document.createElement("button");
    btnEdit.textContent = "Edit";
    btnEdit.className = "btn btn-lightblue";
    btnEdit.addEventListener("click", () => {
      const newText = prompt("Edit capsule text:", capsuleText.textContent);
      if (newText !== null && newText.trim() !== "") {
        capsuleText.textContent = newText.trim();
        saveCapsules();
      }
    });

    const btnExport = document.createElement("button");
    btnExport.textContent = "Export";
    btnExport.className = "btn btn-lightgreen";
    btnExport.addEventListener("click", () => {
      const capsuleData = { text: capsuleText.textContent, level: level.textContent };
      navigator.clipboard
        .writeText(JSON.stringify(capsuleData, null, 2))
        .then(() => alert("✅ Capsule JSON copied!"));
    });

    // ❌ DELETE CROSS (optional)
    const deleteCross = document.createElement("span");
    deleteCross.textContent = "✖️";
    Object.assign(deleteCross.style, {
      position: "absolute",
      top: "5px",
      right: "10px",
      cursor: "pointer",
      color: "red",
      fontWeight: "bold",
      fontSize: "18px"
    });
    deleteCross.addEventListener("click", () => {
      capsule.remove();
      saveCapsules();
      updateNoCapsulesMessage();
    });

    // Build capsule
    buttons.append(btnLearn, btnEdit, btnExport);
    capsule.append(deleteCross, header, capsuleText, buttons);
    capsuleContainer.prepend(capsule);

    saveCapsules();
    updateNoCapsulesMessage();
  }

  // ✅ Add a new capsule
  function handleAddCapsule() {
    const text = capsuleInput.value.trim();
    const levelValue = capsuleLevel.value;
    if (text) {
      createCapsule(text, levelValue);
      capsuleInput.value = "";
    } else {
      alert("Please enter text for the capsule!");
    }
  }

  // Event listeners
  newCapsBtn.addEventListener("click", handleAddCapsule);
  capsuleInput.addEventListener("keydown", e => {
    if (e.key === "Enter") handleAddCapsule();
  });

  importJsonBtn?.addEventListener("click", () => {
    const json = prompt("Paste your JSON array of capsules:");
    if (!json) return;
    try {
      const arr = JSON.parse(json);
      if (Array.isArray(arr)) {
        arr.forEach(item => {
          if (typeof item === "string") createCapsule(item);
          else if (item.text) createCapsule(item.text, item.level);
        });
        saveCapsules();
      } else {
        alert("Invalid JSON! Must be an array.");
      }
    } catch (err) {
      alert("Invalid JSON! " + err.message);
    }
  });

  exportAllBtn?.addEventListener("click", () => {
    const capsules = [];
    capsuleContainer.querySelectorAll(".capsule").forEach(c => {
      capsules.push({
        text: c.querySelector("p")?.textContent || "",
        level: c.querySelector(".capsule-level")?.textContent || "Unknown"
      });
    });
    navigator.clipboard
      .writeText(JSON.stringify(capsules, null, 2))
      .then(() => alert("✅ All capsules copied to clipboard!"));
  });

  // ✅ Load saved capsules
  const saved = localStorage.getItem("capsules");
  if (saved) {
    try {
      JSON.parse(saved).forEach(c => createCapsule(c.text, c.level));
    } catch (err) {
      console.error("Error loading capsules:", err);
    }
  }

  updateNoCapsulesMessage();
}
