"use client";

import { useEffect } from "react";
import { scenes, grain } from "./scenes";

// Ponašanje stranice: header, meni na telefonu, showreel svetlo, horizontalni niz radova,
// vremenska linija procesa i kopiranje mejla. Markup je u app/page.js.
export default function Interactions() {
  useEffect(() => {
    const cleanups = [];
    const on = (target, type, fn, opts) => {
      target.addEventListener(type, fn, opts);
      cleanups.push(() => target.removeEventListener(type, fn, opts));
    };
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = matchMedia("(min-width: 821px) and (min-height: 561px)");
    const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
    const pad = (n) => String(n).padStart(2, "0");

    /* Header state */
    const header = document.querySelector(".site-header");
    const onHeader = () => header.classList.toggle("scrolled", window.scrollY > 40);

    /* Mobile menu */
    const menu = document.getElementById("menu");
    const menuBtn = document.getElementById("menu-btn");
    const setMenu = (open) => {
      if (open) {
        menu.hidden = false;
        requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add("open")));
      } else {
        menu.classList.remove("open");
        setTimeout(() => { if (!menu.classList.contains("open")) menu.hidden = true; }, 200);
      }
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.textContent = open ? "Zatvori" : "Meni";
      document.body.style.overflow = open ? "hidden" : "";
    };
    on(menuBtn, "click", () => setMenu(!menu.classList.contains("open")));
    menu.querySelectorAll("a").forEach((a) => on(a, "click", () => setMenu(false)));
    on(document, "keydown", (e) => { if (e.key === "Escape" && menu.classList.contains("open")) setMenu(false); });

    /* Hero: muted showreel + timecode synced to it */
    const hv = document.querySelector(".hero-video");
    const tcEl = document.getElementById("tc");
    const timecode = (sec) => {
      const f = Math.floor(sec * 25);
      return `${pad(Math.floor(f / 90000))}:${pad(Math.floor(f / 1500) % 60)}:${pad(Math.floor(f / 25) % 60)}:${pad(f % 25)}`;
    };
    const saveData = navigator.connection && navigator.connection.saveData;
    if (!reduce && !saveData) {
      hv.preload = "auto";
      const play = () => { const p = hv.play(); if (p) p.catch(() => {}); };
      let raf = 0;
      const tick = () => { tcEl.textContent = timecode(hv.currentTime); raf = requestAnimationFrame(tick); };
      const hio = new IntersectionObserver(([e]) => {
        cancelAnimationFrame(raf);
        if (e.isIntersecting) { play(); raf = requestAnimationFrame(tick); }
        else hv.pause();
      });
      hio.observe(hv);
      cleanups.push(() => { hio.disconnect(); cancelAnimationFrame(raf); hv.pause(); });
    }

    /* Work stills */
    const frames = [...document.querySelectorAll(".frame canvas")];
    const drawFrames = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      for (const cv of frames) {
        const r = cv.getBoundingClientRect();
        const w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
        cv.width = w; cv.height = h;
        const c = cv.getContext("2d");
        const scene = scenes[cv.dataset.scene];
        if (scene) { scene(c, w, h); grain(c, w, h, 14); }
      }
    };

    /* Works: vertical scroll drives the horizontal reel on desktop */
    const works = document.getElementById("radovi");
    const track = document.getElementById("track");
    const viewport = track.parentElement;
    const progress = document.getElementById("progress");
    const countEl = document.getElementById("count");
    const items = track.children.length;
    let dist = 0;
    const layoutWorks = () => {
      if (desktop.matches) {
        dist = Math.max(0, track.scrollWidth - viewport.clientWidth);
        works.style.height = `${window.innerHeight + dist}px`;
      } else {
        dist = 0;
        works.style.height = "";
        track.style.transform = "";
      }
    };
    const onWorks = () => {
      if (!desktop.matches || dist === 0) return;
      const top = works.getBoundingClientRect().top;
      const p = clamp(-top / dist, 0, 1);
      track.style.transform = `translate3d(${-p * dist}px, 0, 0)`;
      progress.style.transform = `scaleX(${p})`;
      countEl.textContent = pad(Math.round(p * (items - 1)) + 1);
    };

    /* Process: playhead sweeps the 10 days once when the timeline comes into view */
    const tl = document.getElementById("tl");
    if (!reduce) {
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now(), dur = 2600;
        const step = (now) => {
          const k = clamp((now - t0) / dur, 0, 1);
          const eased = 1 - Math.pow(1 - k, 3);
          tl.style.setProperty("--p", eased.toFixed(4));
          if (k < 1) requestAnimationFrame(step);
        };
        tl.style.setProperty("--p", "0");
        requestAnimationFrame(step);
      }, { threshold: 0.5 });
      io.observe(tl);
      cleanups.push(() => io.disconnect());
    }

    /* CTA: lives in the hero, docks at the bottom once that button has scrolled away */
    const dock = document.getElementById("cta-dock");
    const heroCta = document.querySelector(".hero-actions .btn-alloy");
    const setDock = (show) => { dock.classList.toggle("show", show); dock.inert = !show; };
    const dio = new IntersectionObserver(([e]) => setDock(!e.isIntersecting && e.boundingClientRect.top < 0));
    dio.observe(heroCta);
    cleanups.push(() => dio.disconnect());

    /* Process on phones: from the moment it is on screen, light one step every 2 s, D1 to D10, then again */
    const mobile = matchMedia("(max-width: 820px)");
    const clips = [...tl.querySelectorAll(".clip")].sort(
      (a, b) => a.style.getPropertyValue("--s") - b.style.getPropertyValue("--s")
    );
    let cycle = 0, lit = 0, tlVisible = false;
    const light = (i) => clips.forEach((c, j) => c.classList.toggle("on", i === j));
    const startCycle = () => {
      if (cycle || !mobile.matches || !tlVisible) return;
      tl.classList.add("cycling");
      lit = 0; light(lit);
      cycle = setInterval(() => { lit = (lit + 1) % clips.length; light(lit); }, 2000);
    };
    const stopCycle = () => {
      clearInterval(cycle); cycle = 0;
      tl.classList.remove("cycling"); light(-1);
    };
    const cio = new IntersectionObserver(([e]) => {
      tlVisible = e.isIntersecting;
      if (tlVisible) startCycle(); else stopCycle();
    }, { threshold: 0.3 });
    cio.observe(tl);
    on(mobile, "change", () => { stopCycle(); startCycle(); });
    cleanups.push(() => { cio.disconnect(); stopCycle(); });

    /* Phone: frames below the fold open like a shutter as they scroll in */
    if (!reduce && !desktop.matches) {
      const ro = new IntersectionObserver((entries) => {
        for (const e of entries) if (e.isIntersecting) { e.target.classList.remove("pending"); ro.unobserve(e.target); }
      }, { rootMargin: "0px 0px -12% 0px" });
      document.querySelectorAll(".frame").forEach((f) => {
        if (f.getBoundingClientRect().top > window.innerHeight) { f.classList.add("pending"); ro.observe(f); }
      });
      cleanups.push(() => ro.disconnect());
    }

    /* Copy email */
    const copyBtn = document.getElementById("copy");
    const mail = document.getElementById("mail");
    on(copyBtn, "click", () => {
      const label = copyBtn.querySelector("span");
      const swap = (text) => {
        copyBtn.classList.add("swap");
        setTimeout(() => { label.textContent = text; copyBtn.classList.remove("swap"); }, 140);
      };
      const done = () => { swap("Kopirano"); setTimeout(() => swap("Kopiraj"), 1800); };
      const fallback = () => {
        const s = window.getSelection(); const r = document.createRange();
        r.selectNodeContents(mail); s.removeAllRanges(); s.addRange(r); swap("Označeno");
      };
      try { navigator.clipboard.writeText(mail.textContent.trim()).then(done, fallback); } catch { fallback(); }
    });

    /* Wiring */
    let ticking = false;
    on(window, "scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { onHeader(); onWorks(); ticking = false; });
    }, { passive: true });
    let rt;
    const relayout = () => { layoutWorks(); drawFrames(); onWorks(); };
    on(window, "resize", () => { clearTimeout(rt); rt = setTimeout(relayout, 120); });
    on(desktop, "change", relayout);
    relayout();
    onHeader();
    if (document.fonts?.ready) document.fonts.ready.then(() => { layoutWorks(); onWorks(); });

    return () => { clearTimeout(rt); cleanups.forEach((fn) => fn()); };
  }, []);

  return null;
}
