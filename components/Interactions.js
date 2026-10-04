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

    /* Hero: placeholder showreel light + running timecode */
    const hc = document.querySelector(".hero-canvas");
    const hx = hc.getContext("2d");
    let hw = 1, hh = 1;
    const sizeHero = () => {
      const r = hc.getBoundingClientRect();
      hc.width = Math.max(1, Math.round(r.width * 0.5));
      hc.height = Math.max(1, Math.round(r.height * 0.5));
      hw = hc.width; hh = hc.height;
    };
    const drawHero = (t) => {
      hx.globalCompositeOperation = "source-over";
      hx.fillStyle = "#0b0b0a";
      hx.fillRect(0, 0, hw, hh);
      hx.globalCompositeOperation = "lighter";
      const m = Math.max(hw, hh);
      const lights = [
        [0.72 + 0.06 * Math.sin(t * 0.00011), 0.36 + 0.05 * Math.cos(t * 0.00009), 0.55, 0.2],
        [0.24 + 0.05 * Math.cos(t * 0.00007), 0.62 + 0.04 * Math.sin(t * 0.00012), 0.42, 0.1],
        [0.52 + 0.1 * Math.sin(t * 0.00005 + 1), 0.12, 0.32, 0.07],
      ];
      for (const [x, y, r, a] of lights) {
        const g = hx.createRadialGradient(x * hw, y * hh, 0, x * hw, y * hh, r * m);
        g.addColorStop(0, `rgba(236, 228, 214, ${a})`);
        g.addColorStop(1, "rgba(236, 228, 214, 0)");
        hx.fillStyle = g;
        hx.fillRect(0, 0, hw, hh);
      }
      const sx = clamp(0.72 + 0.06 * Math.sin(t * 0.00011), 0.05, 0.95);
      const sy = hh * (0.36 + 0.05 * Math.cos(t * 0.00009));
      const sg = hx.createLinearGradient(0, 0, hw, 0);
      sg.addColorStop(0, "rgba(205, 214, 222, 0)");
      sg.addColorStop(sx, "rgba(205, 214, 222, 0.22)");
      sg.addColorStop(1, "rgba(205, 214, 222, 0)");
      hx.fillStyle = sg;
      hx.fillRect(0, sy - 0.75, hw, 1.5);
      hx.globalCompositeOperation = "source-over";
      const v = hx.createRadialGradient(hw / 2, hh / 2, Math.min(hw, hh) * 0.3, hw / 2, hh / 2, m * 0.75);
      v.addColorStop(0, "rgba(11, 11, 10, 0)");
      v.addColorStop(1, "rgba(11, 11, 10, 0.85)");
      hx.fillStyle = v;
      hx.fillRect(0, 0, hw, hh);
    };
    const tcEl = document.getElementById("tc");
    const timecode = (ms) => {
      const f = Math.floor(ms / 40);
      return `${pad(Math.floor(f / 90000))}:${pad(Math.floor(f / 1500) % 60)}:${pad(Math.floor(f / 25) % 60)}:${pad(f % 25)}`;
    };
    let heroVisible = true;
    let raf = 0;
    const start = performance.now();
    const loop = (now) => {
      if (heroVisible) {
        drawHero(now);
        tcEl.textContent = timecode(now - start);
      }
      raf = requestAnimationFrame(loop);
    };
    sizeHero();
    drawHero(0);
    if (!reduce) {
      const hio = new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; });
      hio.observe(hc);
      cleanups.push(() => hio.disconnect());
      raf = requestAnimationFrame(loop);
      cleanups.push(() => cancelAnimationFrame(raf));
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
    const relayout = () => { sizeHero(); if (reduce) drawHero(0); layoutWorks(); drawFrames(); onWorks(); };
    on(window, "resize", () => { clearTimeout(rt); rt = setTimeout(relayout, 120); });
    on(desktop, "change", relayout);
    relayout();
    onHeader();
    if (document.fonts?.ready) document.fonts.ready.then(() => { layoutWorks(); onWorks(); });

    return () => { clearTimeout(rt); cleanups.forEach((fn) => fn()); };
  }, []);

  return null;
}
