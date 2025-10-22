export function initCapsules() {
  const capsuleContainer = document.getElementById("capsuleContainer");
  const newCapsBtn = document.getElementById("newCapsBtn");
  const noCapsMsg = document.getElementById("noCapsulesMsg");

  if (!capsuleContainer || !newCapsBtn) {
    console.warn("Missing container or newCapsBtn");
    return;
  }

  // --- Helpers ---
  function updateNoCapsulesMessage() {
    if (noCapsMsg)
      noCapsMsg.style.display =
        capsuleContainer.children.length === 0 ? "block" : "none";
  }

  function saveAllCapsules() {
    const capsules = [];
    capsuleContainer.querySelectorAll(".capsule").forEach((c) => {
      const data = JSON.parse(c.dataset.capsule);
      capsules.push(data);
    });
    localStorage.setItem("capsules_full", JSON.stringify(capsules));
  }

  // --- Create Capsule Form ---
  function createCapsuleEditor(existing = null) {
    const capsule = document.createElement("div");
    capsule.className =
      "capsule card p-3 mb-4 shadow-sm bg-light border rounded";

    const data = existing || {
      title: "",
      subject: "",
      level: "Beginner",
      description: "",
      notes: [],
      flashcards: [],
      quiz: [],
      updatedAt: new Date().toLocaleString(),
    };
    capsule.dataset.capsule = JSON.stringify(data);

    capsule.innerHTML = `
      <h5>📘 Capsule Editor</h5>
      <div class="meta-form mb-3">
        <label>Title *</label>
        <input type="text" class="form-control title" value="${data.title}">
        <label>Subject</label>
        <input type="text" class="form-control subject" value="${data.subject}">
        <label>Level</label>
        <select class="form-select level">
          <option ${data.level === "Beginner" ? "selected" : ""}>Beginner</option>
          <option ${data.level === "Intermediate" ? "selected" : ""}>Intermediate</option>
          <option ${data.level === "Advanced" ? "selected" : ""}>Advanced</option>
        </select>
        <label>Description</label>
        <textarea class="form-control description">${data.description}</textarea>
      </div>

      <div class="notes-editor mb-3">
        <label>📝 Notes (one per line)</label>
        <textarea class="form-control notes" rows="6">${data.notes.join("\n")}</textarea>
      </div>

      <div class="flashcards-editor mb-3">
        <label>💡 Flashcards</label>
        <div class="cards"></div>
        <button class="btn btn-sm btn-light mt-2 add-flashcard">+ Add Card</button>
      </div>

      <div class="quiz-editor mb-3">
        <label>❓ Quiz</label>
        <div class="questions"></div>
        <button class="btn btn-sm btn-light mt-2 add-question">+ Add Question</button>
      </div>

      <div class="actions mt-3">
        <button class="btn btn-success save-btn">💾 Save</button>
        <button class="btn btn-danger delete-btn">🗑 Delete</button>
      </div>
    `;

    // --- DOM References ---
    const title = capsule.querySelector(".title");
    const subject = capsule.querySelector(".subject");
    const level = capsule.querySelector(".level");
    const description = capsule.querySelector(".description");
    const notes = capsule.querySelector(".notes");
    const flashcardsDiv = capsule.querySelector(".cards");
    const addFlashcardBtn = capsule.querySelector(".add-flashcard");
    const quizDiv = capsule.querySelector(".questions");
    const addQuestionBtn = capsule.querySelector(".add-question");
    const saveBtn = capsule.querySelector(".save-btn");
    const deleteBtn = capsule.querySelector(".delete-btn");

    // --- Flashcards Section ---
    function renderFlashcards() {
      flashcardsDiv.innerHTML = "";
      data.flashcards.forEach((fc, idx) => {
        const row = document.createElement("div");
        row.className = "d-flex gap-2 mb-2";
        row.innerHTML = `
          <input class="form-control front" placeholder="Front" value="${fc.front}">
          <input class="form-control back" placeholder="Back" value="${fc.back}">
          <button class="btn btn-sm btn-outline-danger">✖</button>
        `;
        row.querySelector("button").addEventListener("click", () => {
          data.flashcards.splice(idx, 1);
          renderFlashcards();
          autoSave();
        });
        row.querySelector(".front").addEventListener("input", (e) => {
          data.flashcards[idx].front = e.target.value;
          autoSave();
        });
        row.querySelector(".back").addEventListener("input", (e) => {
          data.flashcards[idx].back = e.target.value;
          autoSave();
        });
        flashcardsDiv.append(row);
      });
    }
    addFlashcardBtn.addEventListener("click", () => {
      data.flashcards.push({ front: "", back: "" });
      renderFlashcards();
      autoSave();
    });

    // --- Quiz Section ---
    function renderQuiz() {
      quizDiv.innerHTML = "";
      data.quiz.forEach((q, qi) => {
        const qBox = document.createElement("div");
        qBox.className = "border rounded p-2 mb-2";
        qBox.innerHTML = `
          <input class="form-control question" placeholder="Question" value="${q.q}">
          <div class="choices mt-2"></div>
          <label class="mt-1">Answer:</label>
          <select class="form-select answer">
            <option value="0">A</option>
            <option value="1">B</option>
            <option value="2">C</option>
            <option value="3">D</option>
          </select>
          <input class="form-control explanation mt-1" placeholder="Explanation (optional)" value="${q.explanation || ""}">
          <button class="btn btn-sm btn-outline-danger mt-2">Remove</button>
        `;
        const choicesDiv = qBox.querySelector(".choices");
        for (let i = 0; i < 4; i++) {
          const ch = document.createElement("input");
          ch.className = "form-control mb-1";
          ch.placeholder = `Choice ${String.fromCharCode(65 + i)}`;
          ch.value = q.choices[i] || "";
          ch.addEventListener("input", (e) => {
            q.choices[i] = e.target.value;
            autoSave();
          });
          choicesDiv.append(ch);
        }
        const ansSel = qBox.querySelector(".answer");
        ansSel.value = q.answerIndex;
        ansSel.addEventListener("change", (e) => {
          q.answerIndex = Number(e.target.value);
          autoSave();
        });
        qBox.querySelector(".question").addEventListener("input", (e) => {
          q.q = e.target.value;
          autoSave();
        });
        qBox.querySelector(".explanation").addEventListener("input", (e) => {
          q.explanation = e.target.value;
          autoSave();
        });
        qBox.querySelector("button").addEventListener("click", () => {
          data.quiz.splice(qi, 1);
          renderQuiz();
          autoSave();
        });
        quizDiv.append(qBox);
      });
    }
    addQuestionBtn.addEventListener("click", () => {
      data.quiz.push({
        q: "",
        choices: ["", "", "", ""],
        answerIndex: 0,
        explanation: "",
      });
      renderQuiz();
      autoSave();
    });

    // --- Auto-save when editing meta/notes ---
    function autoSave() {
      data.title = title.value.trim();
      data.subject = subject.value.trim();
      data.level = level.value;
      data.description = description.value.trim();
      data.notes = notes.value
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);
      data.updatedAt = new Date().toLocaleString();
      capsule.dataset.capsule = JSON.stringify(data);
      saveAllCapsules();
    }

    [title, subject, level, description, notes].forEach((el) =>
      el.addEventListener("input", autoSave)
    );

    // --- Save button (with validation) ---
    saveBtn.addEventListener("click", () => {
      autoSave();
      if (!data.title) return alert("❗ Title is required!");
      const hasContent =
        data.notes.length > 0 ||
        data.flashcards.length > 0 ||
        data.quiz.length > 0;
      if (!hasContent)
        return alert("❗ You must add Notes, Flashcards, or Quiz content!");
      alert("✅ Capsule saved!");
    });

    // --- Delete ---
    deleteBtn.addEventListener("click", () => {
      if (confirm("Delete this capsule?")) {
        capsule.remove();
        saveAllCapsules();
        updateNoCapsulesMessage();
      }
    });

    renderFlashcards();
    renderQuiz();

    capsuleContainer.prepend(capsule);
    updateNoCapsulesMessage();
  }

  // --- Add new capsule ---
  newCapsBtn.addEventListener("click", () => createCapsuleEditor());

  // --- Load saved capsules ---
  const saved = localStorage.getItem("capsules_full");
  if (saved) {
    try {
      JSON.parse(saved).forEach((c) => createCapsuleEditor(c));
    } catch (e) {
      console.error("Error loading capsules:", e);
    }
  }

  updateNoCapsulesMessage();
}
