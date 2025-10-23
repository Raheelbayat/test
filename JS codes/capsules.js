import Storage from './storage.js';

export function initCapsules() {
  const capsuleContainer = document.getElementById("capsuleContainer");
  const metaTitle = document.getElementById("metaTitle");
  const metaSubject = document.getElementById("metaSubject");
  const metaLevel = document.getElementById("metaLevel");
  const metaDescription = document.getElementById("metaDescription");
  const notesEditor = document.getElementById("notesEditor");
  const flashcardsContainer = document.getElementById("flashcardsContainer");
  const addFlashcardBtn = document.getElementById("addFlashcardBtn");
  const quizContainer = document.getElementById("quizContainer");
  const addQuestionBtn = document.getElementById("addQuestionBtn");
  const saveCapsuleBtn = document.getElementById("saveCapsuleBtn");
  const clearDraftBtn = document.getElementById("clearDraftBtn");
  const newCapsBtn = document.getElementById("newCapsBtn");
  const capsuleInput = document.getElementById("capsuleInput");
  const importJsonBtn = document.getElementById("importJsonBtn");
  const exportAllBtn = document.getElementById("exportAllBtn");
  const capsuleLevel = document.getElementById("capsuleLevel");
  const noCapsMsg = document.getElementById("noCapsulesMsg");

  if (!capsuleContainer) {
    console.error("❌ #capsuleContainer is missing in initCapsules()");
    return;
  }

//autosave
  const DRAFT_KEY = "capsule_draft";

  // Show or hide “No capsules yet” message
  function updateNoCapsulesMessage() {
    if (!noCapsMsg) return;
    noCapsMsg.style.display = capsuleContainer.children.length === 0 ? "block" : "none";
  }

  // Save all capsules to localStorage
  function saveCapsules() {
    const capsules = [];
    capsuleContainer.querySelectorAll(".capsule").forEach(c => {
      const text = c.querySelector("p")?.textContent || "";
      const level = c.querySelector(".capsule-level")?.textContent || "Unknown";
      capsules.push({ text, level });
    });
    localStorage.setItem("capsules", JSON.stringify(capsules));
  }

  // Create a capsule card
  function createCapsule(text, levelValue = "Beginner") {
    if (!text) return;
    if (noCapsMsg) noCapsMsg.style.display = "none";

    const capsule = document.createElement("div");
    capsule.className = "p-3 mb-3 bg-light rounded shadow-sm capsule position-relative";

    // Header + time + level
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
    btnLearn.textContent = "📖 Learn";
    btnLearn.className = "btn btn-pink";
    btnLearn.addEventListener("click", () => alert("Learn clicked!"));

    const btnEdit = document.createElement("button");
    btnEdit.textContent = "✏️ Edit";
    btnEdit.className = "btn btn-lightblue";
    btnEdit.addEventListener("click", () => {
      const newText = prompt("Edit capsule text:", capsuleText.textContent);
      if (newText !== null && newText.trim() !== "") {
        capsuleText.textContent = newText.trim();
        saveCapsules();
      }
    });

    const btnExport = document.createElement("button");
    btnExport.textContent = "📤 Export";
    btnExport.className = "btn btn-lightgreen";
    btnExport.addEventListener("click", () => {
      const capsuleData = { text: capsuleText.textContent, level: level.textContent };
      navigator.clipboard
        .writeText(JSON.stringify(capsuleData, null, 2))
        .then(() => alert("✅ Capsule JSON copied!"));
    });

    // DELETE Btn (removes this capsule)
    const btnDelete = document.createElement("button");
    btnDelete.textContent = "❌ Delete";
    btnDelete.className = "btn btn-salmon";
    btnDelete.addEventListener("click", () => {
      capsule.remove();
      saveCapsules();
      updateNoCapsulesMessage();
    });

    // Build capsule
    buttons.append(btnLearn, btnEdit, btnExport, btnDelete);
    // If a previous deleteCross exists, don't rely on it; append the constructed capsule
    capsule.append(/*deleteCross,*/ header, capsuleText, buttons);
    capsuleContainer.prepend(capsule);

    saveCapsules();
    updateNoCapsulesMessage();
  }

  //Author form and structured capsule support
  // Utilities to create flashcard and quiz item DOM rows
  function createFlashcardRow(f = { front: "", back: "" }) {
    const row = document.createElement("div");
    row.className = "d-flex gap-2 mb-2 align-items-start";
    row.innerHTML = `
      <input class="form-control" placeholder="Front" value="${escapeHtml(f.front)}">
      <input class="form-control" placeholder="Back" value="${escapeHtml(f.back)}">
      <button class="btn btn-salmon btn-sm">Remove</button>
    `;
    const removeBtn = row.querySelector("button");
    removeBtn.addEventListener("click", () => {
      row.remove();
      autosaveDraft();
    });
    Array.from(row.querySelectorAll("input")).forEach(inp => inp.addEventListener("input", autosaveDraft));
    return row;
  }

  function createQuestionRow(q = { question: "", choices: ["", "", "", ""], answer: 0, explanation: "" }) {
    const row = document.createElement("div");
    row.className = "card card-body mb-2";
    row.innerHTML = `
      <div class="mb-2"><input class="form-control" placeholder="Question" value="${escapeHtml(q.question)}"></div>
      <div class="mb-2">
        <div class="d-flex gap-2 mb-2">
          <input class="form-control" placeholder="Choice A" value="${escapeHtml(q.choices[0])}">
          <input class="form-control" placeholder="Choice B" value="${escapeHtml(q.choices[1])}">
        </div>
        <div class="d-flex gap-2">
          <input class="form-control" placeholder="Choice C" value="${escapeHtml(q.choices[2])}">
          <input class="form-control" placeholder="Choice D" value="${escapeHtml(q.choices[3])}">
        </div>
      </div>
      <div class="d-flex gap-2 align-items-center">
        <label class="form-label mb-0 me-2">Correct</label>
        <select class="form-select correct-select" style="width:120px">
          <option value="0">A</option>
          <option value="1">B</option>
          <option value="2">C</option>
          <option value="3">D</option>
        </select>
        <input class="form-control ms-2" placeholder="Explanation (optional)" value="${escapeHtml(q.explanation)}">
        <button class="btn btn-salmon btn-sm ms-2">Remove</button>
      </div>
    `;
    row.querySelector(".correct-select").value = String(q.answer || 0);
    row.querySelector("button").addEventListener("click", () => {
      row.remove();
      autosaveDraft();
    });
    Array.from(row.querySelectorAll("input, select")).forEach(el => el.addEventListener("input", autosaveDraft));
    Array.from(row.querySelectorAll("select")).forEach(el => el.addEventListener("change", autosaveDraft));
    return row;
  }

  function escapeHtml(s) {
    return (s||"")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Read the draft from the author form and write to localStorage
  function autosaveDraft() {
    if (!metaTitle) return;
    const draft = {
      meta: {
        title: metaTitle.value.trim(),
        subject: metaSubject.value.trim(),
        level: metaLevel.value,
        description: metaDescription.value.trim()
      },
      notes: (notesEditor?.value || "").split(/\r?\n/).map(l => l.trim()).filter(Boolean),
      flashcards: Array.from(flashcardsContainer?.children || []).map(row => {
        const inputs = row.querySelectorAll("input");
        return { front: inputs[0].value.trim(), back: inputs[1].value.trim() };
      }),
      quiz: Array.from(quizContainer?.children || []).map(card => {
        const inputs = card.querySelectorAll("input");
        const selects = card.querySelectorAll("select");
        return {
          question: inputs[0].value.trim(),
          choices: [inputs[1].value.trim(), inputs[2].value.trim(), inputs[3].value.trim(), inputs[4].value.trim()],
          answer: parseInt(selects[0].value || "0", 10),
          explanation: inputs[5]?.value.trim() || ""
        };
      })
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }

  function loadDraftToForm() {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw || !metaTitle) return;
    try {
      const draft = JSON.parse(raw);
      metaTitle.value = draft.meta?.title || "";
      metaSubject.value = draft.meta?.subject || "";
      metaLevel.value = draft.meta?.level || "Beginner";
      metaDescription.value = draft.meta?.description || "";
      notesEditor.value = (draft.notes || []).join("\n");
      flashcardsContainer.innerHTML = "";
      (draft.flashcards || []).forEach(f => flashcardsContainer.append(createFlashcardRow(f)));
      quizContainer.innerHTML = "";
      (draft.quiz || []).forEach(q => quizContainer.append(createQuestionRow(q)));
    } catch (err) {
      console.error("Failed to load draft:", err);
    }
  }

  // Save the structured capsule to storage (validated prior)
  function saveStructuredCapsule() {
    const capsule = {
      meta: {
        title: metaTitle.value.trim(),
        subject: metaSubject.value.trim(),
        level: metaLevel.value,
        description: metaDescription.value.trim()
      },
      notes: (notesEditor?.value || "").split(/\r?\n/).map(l => l.trim()).filter(Boolean),
      flashcards: Array.from(flashcardsContainer?.children || []).map(row => {
        const inputs = row.querySelectorAll("input");
        return { front: inputs[0].value.trim(), back: inputs[1].value.trim() };
      }),
      quiz: Array.from(quizContainer?.children || []).map(card => {
        const inputs = card.querySelectorAll("input");
        const selects = card.querySelectorAll("select");
        return {
          question: inputs[0].value.trim(),
          choices: [inputs[1].value.trim(), inputs[2].value.trim(), inputs[3].value.trim(), inputs[4].value.trim()],
          answer: parseInt(selects[0].value || "0", 10),
          explanation: inputs[5]?.value.trim() || ""
        };
      }),
      updatedAt: new Date().toISOString()
    };

    // Append to existing structured capsules list
    const key = "structured_capsules";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.unshift(capsule);
    localStorage.setItem(key, JSON.stringify(existing));
    // clear draft after save
    localStorage.removeItem(DRAFT_KEY);
    alert("Capsule saved.");
    // Refresh displayed capsules
    loadStructuredCapsules();
    updateNoCapsulesMessage(); // Ensure noCapsulesMsg is hidden after saving
  }

  function loadStructuredCapsules() {
    const idx = Storage.listIndex();
    capsuleContainer.innerHTML = "";
    if (!idx.length) return;
    idx.forEach(m => {
      const c = Storage.loadCapsule(m.id) || {};
      const card = document.createElement("div");
      card.className = "p-3 mb-3 bg-light rounded shadow-sm capsule";
      card.innerHTML = `
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h5 class="mb-1">${escapeHtml(m.title)}</h5>
            <small class="text-muted">${escapeHtml(m.subject || '')} • <span class="badge bg-secondary">${escapeHtml(m.level || '')}</span></small>
            <p class="mt-2 mb-1">${escapeHtml(c.meta?.description || '')}</p>
            <small class="text-muted">Updated: ${new Date(m.updatedAt).toLocaleString()}</small>
          </div>
          <div class="d-flex flex-column align-items-end gap-2">
            <div>
              <button class="btn btn-pink btn-sm me-1 learn-btn" data-id="${m.id}">Learn</button>
              <button class="btn btn-lightblue btn-sm me-1 edit-btn" data-id="${m.id}">Edit</button>
              <button class="btn btn-lightgreen btn-sm me-1 export-btn" data-id="${m.id}">Export</button>
              <button class="btn btn-salmon btn-sm delete-btn" data-id="${m.id}">Delete</button>
            </div>
            <div>
              <small class="text-muted">Best: ${Storage.getProgress(m.id).bestScore || 0}%</small>
              <small class="text-success ms-2">Known: ${Storage.getProgress(m.id).knownFlashcards?.length || 0}</small>
            </div>
          </div>
        </div>
      `;
      capsuleContainer.append(card);
    });
      updateNoCapsulesMessage(); // Ensure noCapsulesMsg is hidden after loading structured capsules

    // delegate actions
    capsuleContainer.querySelectorAll('.learn-btn').forEach(b => b.addEventListener('click', e => {
      const id = e.target.dataset.id;

      if (window.app && window.app.router && typeof window.app.router.nav === 'function') {
        window.app.router.nav('/learn', true, () => {
          const sel = document.getElementById('selectCapsule');
          if (sel) {
            sel.value = id;
            sel.dispatchEvent(new Event('change', { bubbles: true }));
            // focus for better UX
            sel.focus();
          }
        });
      } else {
        // fallback: use the history API 
        history.pushState({ route: '/learn' }, '', '/learn');
        window.dispatchEvent(new PopStateEvent('popstate', { state: { route: '/learn' } }));
        setTimeout(() => {
          const sel = document.getElementById('selectCapsule');
          if (sel) {
            sel.value = id;
            sel.dispatchEvent(new Event('change', { bubbles: true }));
            sel.focus();
          }
        }, 120);
      }
    }));

    capsuleContainer.querySelectorAll('.edit-btn').forEach(b => b.addEventListener('click', e => {
      const id = e.target.dataset.id;
      const cap = Storage.loadCapsule(id);
      if (!cap) return alert('Capsule not found');
      // navigate to author and load into form
  history.pushState({ route: '/author' }, '', '/author');
  window.dispatchEvent(new PopStateEvent('popstate', { state: { route: '/author' } }));
      setTimeout(() => {
        metaTitle.value = cap.meta.title || '';
        metaSubject.value = cap.meta.subject || '';
        metaLevel.value = cap.meta.level || 'Beginner';
        metaDescription.value = cap.meta.description || '';
        notesEditor.value = (cap.notes || []).join('\n');
        flashcardsContainer.innerHTML = '';
        (cap.flashcards || []).forEach(f => flashcardsContainer.append(createFlashcardRow(f)));
        quizContainer.innerHTML = '';
        (cap.quiz || []).forEach(q => quizContainer.append(createQuestionRow(q)));
      }, 50);
    }));

    capsuleContainer.querySelectorAll('.export-btn').forEach(b => b.addEventListener('click', e => {
      const id = e.target.dataset.id;
      const cap = Storage.loadCapsule(id);
      if (!cap) return alert('Capsule not found');
      const blob = new Blob([Storage.exportCapsuleJSON(cap)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${m.title || 'capsule'}.json`;
      a.click();
    }));

    capsuleContainer.querySelectorAll('.delete-btn').forEach(b => b.addEventListener('click', e => {
      const id = e.target.dataset.id;
      if (!confirm('Delete this capsule?')) return;
      Storage.deleteCapsule(id);
      loadStructuredCapsules();
      populateSelector && populateSelector();
    }));
  }

  // Validation and event wiring for author form
  if (metaTitle) {
    loadDraftToForm();

    // Wire autosave on input
    [metaTitle, metaSubject, metaLevel, metaDescription, notesEditor].forEach(el => el?.addEventListener("input", autosaveDraft));

    addFlashcardBtn?.addEventListener("click", () => {
      flashcardsContainer.append(createFlashcardRow());
      autosaveDraft();
    });

    addQuestionBtn?.addEventListener("click", () => {
      quizContainer.append(createQuestionRow());
      autosaveDraft();
    });

    saveCapsuleBtn?.addEventListener("click", () => {
      // Validation of my capssss items in the author page
      const title = metaTitle.value.trim();
      const notes = (notesEditor?.value || "").split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const fcs = Array.from(flashcardsContainer?.children || []);
      const qs = Array.from(quizContainer?.children || []);
      if (!title) return alert("Title is required.");
      if (!notes.length && !fcs.length && !qs.length) return alert("Please add at least one note, flashcard, or quiz question.");
      saveStructuredCapsule();
    });

    clearDraftBtn?.addEventListener("click", () => {
      if (!confirm("Clear current draft?")) return;
      localStorage.removeItem(DRAFT_KEY);
      loadDraftToForm();
    });

    loadStructuredCapsules();
  }

//Learn features
  const selectCapsule = document.getElementById("selectCapsule");
  const notesSearch = document.getElementById("notesSearch");
  const notesList = document.getElementById("notesList");
  const notesCount = document.getElementById("notesCount");
  const fcPrev = document.getElementById("fcPrev");
  const fcNext = document.getElementById("fcNext");
  const fcToggleKnown = document.getElementById("fcToggleKnown");
  const fcCounter = document.getElementById("fcCounter");
  const fcKnownCount = document.getElementById("fcKnownCount");
  const flashcardCard = document.getElementById("flashcardCard");
  const exportSelectedBtn = document.getElementById("exportSelectedBtn");
  const quizIndexEl = document.getElementById("quizIndex");
  const quizTotalEl = document.getElementById("quizTotal");
  const quizQuestion = document.getElementById("quizQuestion");
  const quizChoices = document.getElementById("quizChoices");
  const quizFeedback = document.getElementById("quizFeedback");
  const quizScore = document.getElementById("quizScore");
  const bestScore = document.getElementById("bestScore");

  let structured = Storage.listIndex();
  let currentIndex = -1;
  let fcIndex = 0;
  let fcKnownSet = new Set(JSON.parse(localStorage.getItem("fc_known") || "[]"));
  let quizState = { idx: 0, score: 0, total: 0 };

  function populateSelector() {
    if (!selectCapsule) return;
    const idx = Storage.listIndex();
    selectCapsule.innerHTML = "";
    selectCapsule.append(new Option("-- Select capsule --", ""));
    idx.forEach((m, i) => selectCapsule.append(new Option(m.title || `Untitled ${i+1}`, m.id)));
  }

  function renderNotes(notes = []) {
    if (!notesList) return;
    const q = (notesSearch?.value || "").toLowerCase();
    notesList.innerHTML = "";
    const filtered = notes.filter(n => n.toLowerCase().includes(q));
    filtered.forEach(n => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = n;
      notesList.append(li);
    });
    notesCount && (notesCount.textContent = `${filtered.length}`);
  }

  function renderFlashcard() {
    if (!flashcardCard) return;
  const capsule = Storage.loadCapsule(currentIndex);
    if (!capsule || !capsule.flashcards || capsule.flashcards.length === 0) {
      flashcardCard.innerHTML = `<div class="text-muted">No flashcards</div>`;
      fcCounter && (fcCounter.textContent = `0 / 0`);
      fcKnownCount && (fcKnownCount.textContent = '');
      return;
    }
    const fc = capsule.flashcards;
    fcIndex = Math.max(0, Math.min(fcIndex, fc.length -1));
    const item = fc[fcIndex];
    flashcardCard.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'flashcard-wrapper';
    const card = document.createElement('div');
    card.className = 'flashcard';
    card.innerHTML = `
      <div class="flashcard-face flashcard-front"><div>${escapeHtml(item.front)}</div></div>
      <div class="flashcard-face flashcard-back"><div>${escapeHtml(item.back)}</div></div>
    `;
    card.addEventListener('click', () => card.classList.toggle('is-flipped'));
    wrap.append(card);
    flashcardCard.append(wrap);
    fcCounter && (fcCounter.textContent = `${fcIndex+1} / ${fc.length}`);
    const prog = Storage.getProgress(currentIndex) || { knownFlashcards: [] };
    const knownSet = new Set(prog.knownFlashcards || []);
    fcKnownCount && (fcKnownCount.textContent = `Known: ${knownSet.size}`);
    fcToggleKnown && (fcToggleKnown.textContent = knownSet.has(fcIndex) ? 'Unmark Known' : 'Mark Known');
  }

  function toggleKnown() {
    if (currentIndex < 0) return;
    const prog = Storage.getProgress(currentIndex) || { knownFlashcards: [] };
    const known = new Set(prog.knownFlashcards || []);
    if (known.has(fcIndex)) known.delete(fcIndex);
    else known.add(fcIndex);
    prog.knownFlashcards = Array.from(known);
    Storage.saveProgress(currentIndex, prog);
    renderFlashcard();
  }

  function renderQuiz() {
    if (!quizQuestion) return;
    const capsule = Storage.loadCapsule(currentIndex);
    if (!capsule || !capsule.quiz || capsule.quiz.length === 0) {
      quizQuestion.textContent = 'No quiz questions';
      quizChoices.innerHTML = '';
      quizTotalEl && (quizTotalEl.textContent = '0');
      quizIndexEl && (quizIndexEl.textContent = '0');
      return;
    }
  quizState.total = capsule.quiz.length;
    quizIndexEl && (quizIndexEl.textContent = String(quizState.idx+1));
    quizTotalEl && (quizTotalEl.textContent = String(quizState.total));
    const q = capsule.quiz[quizState.idx];
    quizQuestion.textContent = q.question || '';
    quizChoices.innerHTML = '';
    q.choices.forEach((choice, i) => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-light';
      btn.textContent = `${String.fromCharCode(65+i)}. ${choice}`;
      btn.addEventListener('click', () => {
        const correct = q.answer === i;
        quizFeedback.textContent = correct ? 'Correct!' : `Incorrect. ${q.explanation || ''}`;
        if (correct) quizState.score++;
        // disable choices
        Array.from(quizChoices.children).forEach(b => b.disabled = true);
        // move to next after a short delay
        setTimeout(() => {
          quizState.idx++;
          if (quizState.idx >= quizState.total) finishQuiz();
          else renderQuiz();
        }, 800);
      });
      quizChoices.append(btn);
    });
    quizScore && (quizScore.textContent = `Score: ${quizState.score} / ${quizState.total}`);
    quizFeedback && (quizFeedback.textContent = '');
  }

  function finishQuiz() {
    const pct = Math.round((quizState.score / Math.max(1, quizState.total)) * 100);
    quizQuestion.textContent = `Quiz complete — Score: ${quizState.score} / ${quizState.total} (${pct}%)`;
    quizChoices.innerHTML = '';
    quizFeedback && (quizFeedback.textContent = '');
    // store best score per capsule
    const prog = Storage.getProgress(currentIndex) || {};
    const prev = prog.bestScore || 0;
    if (pct > prev) { prog.bestScore = pct; Storage.saveProgress(currentIndex, prog); }
    bestScore && (bestScore.textContent = `Best: ${Storage.getProgress(currentIndex).bestScore || 0}%`);
  }

  // Event wiring for learn UI
  if (selectCapsule) {
    populateSelector();
    selectCapsule.addEventListener('change', () => {
      currentIndex = selectCapsule.value;
      if (!currentIndex) { currentIndex = -1; return; }
      const cap = Storage.loadCapsule(currentIndex) || {};
      // Notes
      renderNotes(cap.notes || []);
      // Flashcards
      fcIndex = 0;
      renderFlashcard();
      // Quiz
      quizState = { idx: 0, score: 0, total: 0 };
      renderQuiz();
      bestScore && (bestScore.textContent = `Best: ${Storage.getProgress(currentIndex).bestScore || 0}%`);
    });

    notesSearch?.addEventListener('input', () => {
      const cap = Storage.loadCapsule(currentIndex) || {};
      renderNotes(cap.notes || []);
    });

    fcPrev?.addEventListener('click', () => { fcIndex = Math.max(0, fcIndex-1); renderFlashcard(); });
  fcNext?.addEventListener('click', () => { const cap = Storage.loadCapsule(currentIndex); if (!cap) return; fcIndex = Math.min((cap.flashcards||[]).length-1, fcIndex+1); renderFlashcard(); });
    fcToggleKnown?.addEventListener('click', toggleKnown);

    exportSelectedBtn?.addEventListener('click', () => {
      if (!currentIndex) return alert('No capsule selected');
      const data = Storage.loadCapsule(currentIndex);
      if (!data) return alert('No capsule data found');
      navigator.clipboard.writeText(JSON.stringify({ schema: 'pocket-classroom/v1', capsule: data }, null, 2)).then(() => alert('✅ Capsule JSON copied'));
    });
  }

  //adding a new capsule
  function handleAddCapsule() {
    if (!capsuleInput || !capsuleLevel) return;
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
  newCapsBtn?.addEventListener("click", handleAddCapsule);
  capsuleInput?.addEventListener("keydown", e => {
    if (e.key === "Enter") handleAddCapsule();
  });

  importJsonBtn?.addEventListener("click", () => {
    const json = prompt("Paste your JSON array (either simple capsules or structured capsules):");
    if (!json) return;
    try {
      const arr = JSON.parse(json);
      if (!Array.isArray(arr)) return alert("Invalid JSON!");
      // detect structured objects
      const structuredKey = "structured_capsules";
      const isStructured = arr.length && typeof arr[0] === 'object' && !!arr[0].meta;
      if (isStructured) {
        // merge into structured_capsules
        const existing = JSON.parse(localStorage.getItem(structuredKey) || '[]');
        const merged = arr.concat(existing);
        localStorage.setItem(structuredKey, JSON.stringify(merged));
        loadStructuredCapsules();
        populateSelector && populateSelector();
        alert('Imported structured capsules.');
      } else {
        // assume simple format
        arr.forEach(item => {
          if (typeof item === "string") createCapsule(item);
          else if (item.text) createCapsule(item.text, item.level);
        });
        saveCapsules();
        alert('Imported simple capsules.');
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
      .then(() => alert("All capsules copied to clipboard!"));
  });

  //Load saved capsules
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
