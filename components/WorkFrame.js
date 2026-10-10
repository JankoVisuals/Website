"use client";

import { useEffect, useRef, useState } from "react";

// A real work. The card is only the picture: no player, no buttons. A work
// hosted on the site loops silently on the card while it is in view; a
// YouTube work shows its still, since YouTube's player cannot be shown clean.
// The card carries no text; a click or tap opens the film full screen with
// sound and its story beside it, and closing it removes the player.
export default function WorkFrame({ work }) {
  const { youtube: id, video, title, ratio, category, desc } = work;
  const [a, b] = ratio.split("/").map(Number);
  const dialogRef = useRef(null);
  const loopRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [poster, setPoster] = useState(work.poster ?? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`);
  const fallback = () => id && setPoster(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);

  useEffect(() => {
    const d = dialogRef.current;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  // The silent loop plays only while the card is on screen and the film is closed.
  useEffect(() => {
    const v = loopRef.current;
    if (!v) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches || navigator.connection?.saveData;
    if (still) return;
    let visible = false;
    const sync = () => (visible && !open ? v.play().catch(() => {}) : v.pause());
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(v);
    sync();
    return () => io.disconnect();
  }, [open]);

  return (
    <>
      <figure className="frame" style={{ "--ar": ratio }}>
        <button type="button" className="poster" onClick={() => setOpen(true)} aria-label={`Pogledaj video: ${title}`}>
          {video ? (
            <video
              ref={loopRef}
              src={video}
              poster={poster}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={poster}
              alt=""
              loading="lazy"
              decoding="async"
              onLoad={(e) => {
                // YouTube answers a missing maxres still with a 120px gray image.
                if (e.currentTarget.naturalWidth <= 120) fallback();
              }}
              onError={fallback}
            />
          )}
        </button>
      </figure>

      <dialog
        ref={dialogRef}
        className="theater"
        aria-label={title}
        onClose={() => setOpen(false)}
        onClick={(e) => (e.target === e.currentTarget || e.target.classList.contains("theater-body")) && setOpen(false)}
      >
        <button type="button" className="theater-close" onClick={() => setOpen(false)}>
          Zatvori
        </button>
        <div className="theater-body" style={{ "--ar": ratio, "--arn": a / b }}>
          <div className="theater-screen">
            {open &&
              (video ? (
                <video src={video} poster={poster} controls autoPlay playsInline />
              ) : (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&iv_load_policy=3`}
                  title={title}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ))}
          </div>
          <div className="theater-caption">
            {category && <p className="theater-cat">{category}</p>}
            <h3>{title}</h3>
            {desc && <p className="theater-desc">{desc}</p>}
          </div>
        </div>
      </dialog>
    </>
  );
}
