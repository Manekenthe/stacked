/* ==========================================================================
   Stacked – behaviour
   - renders cards from tools.js
   - category filter + search
   - "Add a new tool" modal
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- Config ---------- */
  var CONFIG = {
    // Where the "Add a new tool" form is sent (POST, JSON). Works with Formspree,
    // Web3Forms, Basin, your own endpoint… Leave empty to fall back to a
    // pre-filled e-mail draft (mailto) instead.
    submitEndpoint: "",
    fallbackEmail: "addtostacked@proton.me",
    thanksDuration: 3000 // ms the button shows "Thanks a ton!"
  };

  var tools = Array.isArray(window.STACKED_TOOLS) ? window.STACKED_TOOLS : [];

  /* ---------- Helpers ---------- */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var norm = function (s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  };

  /* ---------- Tool counter ---------- */
  $("#tool-count").textContent = String(tools.length).padStart(5, "0");

  /* ---------- Cards ---------- */
  var grid = $("#grid");
  var empty = $("#empty");

  var items = tools.map(function (tool) {
    var hasUrl = !!tool.url;
    var card = document.createElement("a");
    card.className = "card";
    card.href = hasUrl ? tool.url : "#";
    if (hasUrl) {
      card.target = "_blank";
      card.rel = "noopener noreferrer";
    } else {
      card.addEventListener("click", function (e) { e.preventDefault(); });
    }

    var img = document.createElement("img");
    img.className = "card__image";
    img.src = tool.image || "";
    img.alt = "";
    img.width = 560;
    img.height = 350;
    img.loading = "lazy";
    img.decoding = "async";

    var text = document.createElement("div");
    text.className = "card__text";

    var title = document.createElement("h3");
    title.className = "card__title";
    title.appendChild(document.createTextNode(tool.title));
    title.insertAdjacentHTML("beforeend", '<svg class="icon card__link" aria-hidden="true"><use href="#i-link"/></svg>');

    var desc = document.createElement("p");
    desc.className = "card__desc";
    desc.textContent = tool.description;

    text.appendChild(title);
    text.appendChild(desc);
    card.appendChild(img);
    card.appendChild(text);
    grid.appendChild(card);

    return {
      el: card,
      categories: (tool.categories || []).map(norm),
      haystack: norm(tool.title + " " + tool.description)
    };
  });

  /* ---------- Filter + search ---------- */
  var state = { category: "all", query: "" };

  function applyFilters() {
    var visible = 0;
    var q = norm(state.query.trim());
    items.forEach(function (item) {
      var okCat = state.category === "all" || item.categories.indexOf(state.category) !== -1;
      var okQuery = !q || item.haystack.indexOf(q) !== -1;
      var show = okCat && okQuery;
      item.el.hidden = !show;
      if (show) visible++;
    });
    empty.hidden = visible !== 0;
  }

  var chips = $$(".chip");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle("is-selected", on);
        c.setAttribute("aria-pressed", String(on));
      });
      state.category = norm(chip.dataset.category);
      applyFilters();
    });
  });

  var searchForm = $("#search-form");
  var search = $("#search");
  var clearBtn = $("#search-clear");

  function syncSearch() {
    var has = search.value.length > 0;
    searchForm.classList.toggle("has-value", has);
    clearBtn.hidden = !has;
    state.query = search.value;
    applyFilters();
  }

  search.addEventListener("input", syncSearch);
  searchForm.addEventListener("submit", function (e) { e.preventDefault(); });
  clearBtn.addEventListener("click", function () {
    search.value = "";
    syncSearch();
    search.focus();
  });
  search.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && search.value) {
      e.preventDefault();
      search.value = "";
      syncSearch();
    }
  });

  applyFilters();

  /* ---------- Modal ---------- */
  var overlay = $("#overlay");
  var modal = $("#modal");
  var openBtn = $("#open-modal");
  var closeBtn = $("#close-modal");
  var form = $("#tool-form");
  var submitBtn = $("#submit-btn");
  var DEFAULT_LABEL = submitBtn.textContent;
  var lastFocus = null;
  var resetTimer = null;

  function openModal() {
    lastFocus = document.activeElement;
    var root = document.documentElement;
    root.style.setProperty("--scrollbar", (window.innerWidth - root.clientWidth) + "px");
    overlay.hidden = false;
    root.classList.add("modal-open");
    $("#f-name").focus();
  }

  function closeModal() {
    overlay.hidden = true;
    document.documentElement.classList.remove("modal-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("mousedown", function (e) {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener("keydown", function (e) {
    if (overlay.hidden) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
      return;
    }
    if (e.key === "Tab") {           // keep focus inside the dialog
      var f = $$("button, input, a[href]", modal).filter(function (el) { return !el.disabled; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === modal)) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  });

  function normalizeLink(v) {
    v = v.trim();
    return /^[a-z][a-z0-9+.-]*:\/\//i.test(v) ? v : "https://" + v;
  }

  function validLink(v) {
    try {
      var u = new URL(normalizeLink(v));
      return /^https?:$/.test(u.protocol) && u.hostname.indexOf(".") > 0;
    } catch (_) { return false; }
  }

  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }

  function setLabel(text, busy) {
    submitBtn.textContent = text;
    submitBtn.disabled = !!busy;
  }

  function resetForm() {
    form.reset();
    $$(".input", form).forEach(function (i) { i.removeAttribute("aria-invalid"); });
    setLabel(DEFAULT_LABEL, false);
  }

  $$(".input", form).forEach(function (input) {
    input.addEventListener("input", function () { input.removeAttribute("aria-invalid"); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (submitBtn.disabled) return;

    var data = {
      firstName: $("#f-name").value.trim(),
      email: $("#f-email").value.trim(),
      toolName: $("#f-tool").value.trim(),
      toolLink: $("#f-link").value.trim()
    };

    var checks = [
      ["#f-name", !!data.firstName],
      ["#f-email", validEmail(data.email)],
      ["#f-tool", !!data.toolName],
      ["#f-link", validLink(data.toolLink)]
    ];
    var firstBad = null;
    checks.forEach(function (c) {
      var el = $(c[0]);
      if (c[1]) { el.removeAttribute("aria-invalid"); }
      else { el.setAttribute("aria-invalid", "true"); firstBad = firstBad || el; }
    });
    if (firstBad) { firstBad.focus(); return; }

    data.toolLink = normalizeLink(data.toolLink);
    setLabel("Sending…", true);

    var done = function (ok) {
      setLabel(ok ? "Thanks a ton!" : "Something went wrong", true);
      clearTimeout(resetTimer);
      resetTimer = setTimeout(function () {
        if (ok) resetForm(); else setLabel(DEFAULT_LABEL, false);
      }, CONFIG.thanksDuration);
    };

    if (CONFIG.submitEndpoint) {
      fetch(CONFIG.submitEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      }).then(function (r) { done(r.ok); }).catch(function () { done(false); });
    } else {
      var body = "Tool: " + data.toolName + "\nLink: " + data.toolLink +
                 "\n\nFrom: " + data.firstName + " (" + data.email + ")";
      window.location.href = "mailto:" + CONFIG.fallbackEmail +
        "?subject=" + encodeURIComponent("New tool for Stacked: " + data.toolName) +
        "&body=" + encodeURIComponent(body);
      done(true);
    }
  });
})();
