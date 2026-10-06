"use client";

import { useEffect, useRef, useState } from "react";

// A real work. The card is only the picture: no player, no buttons. On a
// mouse, a quiet "Pogledaj" follows the cursor; a click or tap opens the
// film full screen, and closing it removes the player so the sound stops.
export default function WorkFrame({ work }) {
  const { youtube: id, title, ratio } = work;
  const dialogRef = useRef(null);
  const cueRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [poster, setPoster] = useState(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`);
  const fallback = () => setPoster(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);

  useEffect(() => {
    const d = dialogRef.current;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const moveCue = (e) => {
    if (e.pointerType !== "mouse" || !cueRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    cueRef.current.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px)`;
  };

  return (
    <>
      <figure className="frame" style={{ "--ar": ratio }}>
        <button
          type="button"
          className="poster"
          onClick={() => setOpen(true)}
          onPointerMove={moveCue}
          onPointerEnter={moveCue}
          aria-label={`Pogledaj video: ${title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
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
          <span className="cue" ref={cueRef} aria-hidden="true">
            <span>Pogledaj</span>
          </span>
        </button>
      </figure>

      <dialog
        ref={dialogRef}
        className="theater"
        aria-label={title}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
      >
        <button type="button" className="theater-close" onClick={() => setOpen(false)}>
          Zatvori
        </button>
        <div className="theater-screen" style={{ "--ar": ratio }}>
          {open && (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&iv_load_policy=3`}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          )}
        </div>
      </dialog>
    </>
  );
}
