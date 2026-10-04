// Privremeni kadrovi za radove, crtani na canvasu dok ne stignu pravi snimci.

const seeded = (s) => () => {
  s |= 0; s = (s + 0x6d2b79f5) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const rr = (c, x, y, w, h, r) => { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); };
const glow = (c, x, y, r, a, col = "236, 228, 214") => {
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${col}, ${a})`);
  g.addColorStop(1, `rgba(${col}, 0)`);
  c.fillStyle = g;
  c.fillRect(x - r, y - r, r * 2, r * 2);
};
export const grain = (c, w, h, amt) => {
  const id = c.getImageData(0, 0, w, h); const d = id.data;
  for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - 0.5) * amt; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  c.putImageData(id, 0, 0);
};

export const scenes = {
  vsl(c, w, h) {
    const rnd = seeded(7);
    const bg = c.createLinearGradient(0, 0, w, 0);
    bg.addColorStop(0, "#1b1a18"); bg.addColorStop(1, "#0d0d0c");
    c.fillStyle = bg; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 14; i++) glow(c, rnd() * w * 0.5, rnd() * h * 0.8, (0.03 + rnd() * 0.06) * w, 0.05 + rnd() * 0.12);
    glow(c, w * 0.15, h * 0.3, w * 0.6, 0.12);
    const cx = w * 0.62, hy = h * 0.42, hr = h * 0.13;
    c.fillStyle = "#080807";
    c.beginPath(); c.ellipse(cx, hy, hr * 0.82, hr, 0, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.moveTo(cx - h * 0.36, h); c.quadraticCurveTo(cx - h * 0.32, hy + hr * 1.5, cx, hy + hr * 1.35); c.quadraticCurveTo(cx + h * 0.32, hy + hr * 1.5, cx + h * 0.36, h); c.fill();
    c.strokeStyle = "rgba(236, 228, 214, 0.35)"; c.lineWidth = Math.max(1, w / 500);
    c.beginPath(); c.ellipse(cx, hy, hr * 0.82, hr, 0, Math.PI * 0.6, Math.PI * 1.35); c.stroke();
  },
  product(c, w, h) {
    const bg = c.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#151513"); bg.addColorStop(0.7, "#0b0b0a"); bg.addColorStop(1, "#121211");
    c.fillStyle = bg; c.fillRect(0, 0, w, h);
    glow(c, w * 0.5, h * 0.05, h * 0.9, 0.16);
    const pw = w * 0.17, ph = h * 0.46, px = w * 0.5 - pw / 2, py = h * 0.7 - ph;
    c.fillStyle = "rgba(0, 0, 0, 0.6)"; c.beginPath(); c.ellipse(w * 0.5, h * 0.71, pw * 0.9, h * 0.025, 0, 0, Math.PI * 2); c.fill();
    const body = c.createLinearGradient(px, 0, px + pw, 0);
    body.addColorStop(0, "#0e0e0d"); body.addColorStop(0.35, "#34322e"); body.addColorStop(0.6, "#191917"); body.addColorStop(1, "#0c0c0b");
    c.fillStyle = body; rr(c, px, py, pw, ph, pw * 0.14); c.fill();
    c.strokeStyle = "rgba(236, 228, 214, 0.4)"; c.lineWidth = Math.max(1, w / 600);
    rr(c, px, py, pw, ph, pw * 0.14); c.stroke();
    c.save(); c.globalAlpha = 0.1; c.translate(0, h * 1.4); c.scale(1, -1);
    c.fillStyle = body; rr(c, px, py, pw, ph, pw * 0.14); c.fill(); c.restore();
    const fade = c.createLinearGradient(0, h * 0.7, 0, h);
    fade.addColorStop(0, "rgba(11, 11, 10, 0)"); fade.addColorStop(1, "rgba(11, 11, 10, 0.9)");
    c.fillStyle = fade; c.fillRect(0, h * 0.7, w, h * 0.3);
  },
  narrative(c, w, h) {
    const sky = c.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#1d1e1f"); sky.addColorStop(0.58, "#5f5c56"); sky.addColorStop(0.6, "#141413"); sky.addColorStop(1, "#090908");
    c.fillStyle = sky; c.fillRect(0, 0, w, h);
    glow(c, w * 0.3, h * 0.58, h * 0.7, 0.28);
    glow(c, w * 0.3, h * 0.58, h * 0.12, 0.6);
    const fx = w * 0.64, fy = h * 0.6, fh = h * 0.2;
    c.fillStyle = "#070706";
    c.fillRect(fx - fh * 0.09, fy - fh, fh * 0.18, fh);
    c.beginPath(); c.arc(fx, fy - fh - fh * 0.1, fh * 0.1, 0, Math.PI * 2); c.fill();
    c.fillStyle = "rgba(0, 0, 0, 0.5)";
    c.beginPath(); c.moveTo(fx - fh * 0.09, fy); c.lineTo(fx + fh * 0.09, fy); c.lineTo(w, fy + h * 0.12); c.lineTo(w, fy + h * 0.06); c.fill();
  },
  app(c, w, h) {
    c.fillStyle = "#0c0c0b"; c.fillRect(0, 0, w, h);
    glow(c, w * 0.5, h * 0.45, w * 0.9, 0.12);
    const sw = w * 0.66, sh = h * 0.74, sx = (w - sw) / 2, sy = h * 0.1, r = sw * 0.12;
    c.save(); c.shadowColor = "rgba(236, 228, 214, 0.18)"; c.shadowBlur = w * 0.12;
    const sg = c.createLinearGradient(0, sy, 0, sy + sh);
    sg.addColorStop(0, "#22211f"); sg.addColorStop(1, "#121211");
    c.fillStyle = sg; rr(c, sx, sy, sw, sh, r); c.fill(); c.restore();
    c.strokeStyle = "rgba(236, 228, 214, 0.25)"; c.lineWidth = Math.max(1, w / 300); rr(c, sx, sy, sw, sh, r); c.stroke();
    const ix = sx + sw * 0.1, iw = sw * 0.8;
    c.fillStyle = "rgba(236, 228, 214, 0.5)"; rr(c, ix, sy + sh * 0.1, iw * 0.45, sh * 0.03, sh * 0.015); c.fill();
    c.fillStyle = "rgba(236, 228, 214, 0.08)"; rr(c, ix, sy + sh * 0.18, iw, sh * 0.26, sw * 0.05); c.fill();
    c.fillStyle = "rgba(236, 228, 214, 0.06)";
    for (let i = 0; i < 3; i++) { rr(c, ix, sy + sh * (0.5 + i * 0.1), iw, sh * 0.075, sw * 0.04); c.fill(); }
    c.fillStyle = "rgba(236, 228, 214, 0.85)"; rr(c, ix, sy + sh * 0.86, iw, sh * 0.07, sh * 0.035); c.fill();
  },
};
