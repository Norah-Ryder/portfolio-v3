/* Nora Murphy research program — interactive bits, progressively enhanced. */
(function () {
  "use strict";

  /* ---------- Reading paths over the node map ---------- */
  var hints = {
    new: "New to the ideas → The Literal Machine (the mechanism), then the two faces it bends into: The Human Measuring Stick and the Contextual Drift in LLMs overview.",
    research: "Researcher / skeptic → the Method & falsifiability, then the Grok 4.1 walkthrough, then the Synthesis inside Contextual Drift in LLMs.",
    design: "Practitioner / designer → The Onboarding Problem (method seed + benign fix), then From Research to First Message (the buildable workflow)."
  };

  var pathButtons = Array.prototype.slice.call(document.querySelectorAll("[data-path]"));
  var nodes = Array.prototype.slice.call(document.querySelectorAll(".svg-map .node, .svg-map .edge"));
  var hintEl = document.getElementById("pathhint");
  var active = null;

  function applyPath(path) {
    nodes.forEach(function (n) {
      var routes = (n.getAttribute("data-route") || "").split(" ");
      var dimmed = path && routes.indexOf(path) < 0;
      n.classList.toggle("dim", !!dimmed);
    });
  }

  pathButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var p = btn.getAttribute("data-path");
      if (active === p) {
        active = null;
        btn.setAttribute("aria-pressed", "false");
        if (hintEl) hintEl.textContent = "Pick a path to light up its route through the map. These are entry points, not a fixed order.";
        applyPath(null);
        return;
      }
      active = p;
      pathButtons.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      btn.setAttribute("aria-pressed", "true");
      if (hintEl) hintEl.textContent = hints[p] || "";
      applyPath(p);
    });
  });

  /* clicking a node navigates if it carries an href */
  Array.prototype.slice.call(document.querySelectorAll(".svg-map .node[data-href]")).forEach(function (g) {
    g.setAttribute("role", "link");
    g.setAttribute("tabindex", "0");
    function go() { window.location.href = g.getAttribute("data-href"); }
    g.addEventListener("click", go);
    g.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
    });
  });

  /* ---------- Tabbed exhibits ---------- */
  Array.prototype.slice.call(document.querySelectorAll(".exhibits")).forEach(function (group) {
    var tabs = Array.prototype.slice.call(group.querySelectorAll(".tab"));
    var panels = Array.prototype.slice.call(group.querySelectorAll(".tabpanel"));
    function select(i) {
      tabs.forEach(function (t, j) {
        t.setAttribute("aria-selected", j === i ? "true" : "false");
        t.setAttribute("tabindex", j === i ? "0" : "-1");
      });
      panels.forEach(function (p, j) { p.hidden = j !== i; });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(i); });
      t.addEventListener("keydown", function (e) {
        var n = tabs.length, idx = i;
        if (e.key === "ArrowRight") idx = (i + 1) % n;
        else if (e.key === "ArrowLeft") idx = (i - 1 + n) % n;
        else return;
        e.preventDefault();
        tabs[idx].focus();
        select(idx);
      });
    });
    select(0);
  });

  /* ---------- Active cite target: persistent highlight on the landed-on span ----------
     Clicking a [src] sup deep-links to #cite-<log>-<id>. :target styles that mark, but
     in a dense exhibit the landed-on span needs to stay distinct beyond the pulse. On
     load and on every hashchange we resolve the fragment to its mark(s) and set
     .active-cite — clearing the previous one so exactly one span is active at a time.
     Each span is a single <mark> today; the data-span lookup keeps it correct if a
     span ever renders as multiple slices. Works for C and X, and for arrivals from the
     homepage hooks (the fragment is in the URL on load). Cosmetic only. */
  var activeCite = [];
  function setActiveCite() {
    activeCite.forEach(function (el) { el.classList.remove("active-cite"); });
    activeCite = [];
    var id = (window.location.hash || "").replace(/^#/, "");
    if (!id) return;
    var els = [];
    var el = document.getElementById(id);
    if (el && el.classList && el.classList.contains("cite-span")) els.push(el);
    Array.prototype.slice.call(document.querySelectorAll('[data-span="' + id + '"]')).forEach(function (s) {
      if (els.indexOf(s) < 0) els.push(s);
    });
    els.forEach(function (s) { s.classList.add("active-cite"); });
    activeCite = els;
  }
  window.addEventListener("hashchange", setActiveCite);
  setActiveCite();
})();
