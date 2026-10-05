"use client";

import { useState } from "react";

// A real work: the YouTube still stands in as a poster, and the player
// (youtube-nocookie) loads only after a click, so the page stays light.
export default function WorkFrame({ work }) {
  const { youtube: id, title, ratio, ratioLabel, duration } = work;
  const [playing, setPlaying] = useState(false);
  const [poster, setPoster] = useState(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`);

  return (
    <figure className="frame" style={{ "--ar": ratio }}>
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button type="button" className="poster" onClick={() => setPlaying(true)} aria-label={`Pusti video: ${title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster}
            alt=""
            loading="lazy"
            decoding="async"
            onLoad={(e) => {
              // YouTube answers a missing maxres still with a 120px gray image.
              if (e.currentTarget.naturalWidth <= 120) setPoster(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
            }}
            onError={() => setPoster(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)}
          />
          <span className="play" aria-hidden="true">
            <svg viewBox="0 0 16 16">
              <path d="M3 1.5v13l11-6.5z" fill="currentColor" />
            </svg>
          </span>
          <span className="frame-meta mono">
            <span>{ratioLabel}</span>
            {duration && <span>{duration}</span>}
          </span>
        </button>
      )}
    </figure>
  );
}
