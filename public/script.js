/* ============================================================
   The Forest Beneath the Water — script.js
   - scroll reveal (always on, lightweight)
   - mouse parallax, bubbles, particles (skipped if reduced motion)
   ============================================================ */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ----------------------------------------------------------
     1. SCROLL REVEAL
     Watch every .reveal element; when it enters the viewport,
     add .is-visible so the CSS transition runs. Runs once each.
  ---------------------------------------------------------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");

    // No IntersectionObserver support (or reduced motion): just show all.
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target); // reveal only once
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* ----------------------------------------------------------
     2. BUBBLES — soft circles rising from the bottom
  ---------------------------------------------------------- */
  function initBubbles() {
    const layer = document.querySelector(".bubbles");
    if (!layer) return;

    const COUNT = 14;
    for (let i = 0; i < COUNT; i++) {
      const b = document.createElement("span");
      b.className = "bubble";

      const size = rand(6, 26);                 // px
      b.style.width = size + "px";
      b.style.height = size + "px";
      b.style.left = rand(0, 100) + "%";
      b.style.animationDuration = rand(14, 30) + "s";
      b.style.animationDelay = -rand(0, 30) + "s"; // negative = start mid-cycle

      layer.appendChild(b);
    }
  }

  /* ----------------------------------------------------------
     3. PARTICLES — tiny gold motes drifting gently
  ---------------------------------------------------------- */
  function initParticles() {
    const layer = document.querySelector(".particles");
    if (!layer) return;

    const COUNT = 34;
    for (let i = 0; i < COUNT; i++) {
      const p = document.createElement("span");
      p.className = "particle";

      const s = rand(1.5, 3.5);
      p.style.width = s + "px";
      p.style.height = s + "px";
      p.style.left = rand(0, 100) + "%";
      p.style.top = rand(0, 100) + "%";
      p.style.opacity = rand(2, 7) / 10;
      p.style.animationDuration = rand(5, 12) + "s";
      p.style.animationDelay = -rand(0, 8) + "s";

      layer.appendChild(p);
    }
  }

  /* ----------------------------------------------------------
     4. MOUSE PARALLAX
     Elements with data-parallax move a fraction of the cursor
     offset. rAF-throttled so it stays smooth and cheap.
  ---------------------------------------------------------- */
  function initParallax() {
    const targets = Array.from(document.querySelectorAll("[data-parallax]"));
    if (!targets.length) return;

    let mouseX = 0;
    let mouseY = 0;
    let ticking = false;

    window.addEventListener(
      "mousemove",
      (e) => {
        // offset from screen center, range roughly -0.5 .. 0.5
        mouseX = e.clientX / window.innerWidth - 0.5;
        mouseY = e.clientY / window.innerHeight - 0.5;

        if (!ticking) {
          window.requestAnimationFrame(applyParallax);
          ticking = true;
        }
      },
      { passive: true }
    );

    function applyParallax() {
      targets.forEach((el) => {
        const depth = parseFloat(el.getAttribute("data-parallax")) || 0;
        const x = mouseX * depth * 100; // px
        const y = mouseY * depth * 100;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      ticking = false;
    }
  }

  /* ----------------------------------------------------------
     helper
  ---------------------------------------------------------- */
  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  /* ----------------------------------------------------------
     INIT
  ---------------------------------------------------------- */
  function init() {
    initReveal(); // always — content must appear

    if (prefersReducedMotion) return; // skip all heavy ambient motion

    initBubbles();
    initParticles();
    initParallax();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
