"use client";

import { useEffect, useRef, useState } from "react";

const HOST = "https://www.youtube-nocookie.com";

// A real work. While it is on screen the clip loops muted as a living still;
// hovering pauses it and offers play, leaving resumes it. A click swaps in
// the full player with sound and controls.
export default function WorkFrame({ work }) {
  const { youtube: id, title, ratio, ratioLabel, duration } = work;
  const ref = useRef(null);
  const iframeRef = useRef(null);
  const hovered = useRef(false);
  const [near, setNear] = useState(false); // mount the preview only near the viewport
  const [live, setLive] = useState(false); // preview is actually playing, so the poster can go
  const [playing, setPlaying] = useState(false);
  const [poster, setPoster] = useState(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`);

  const send = (func) =>
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), HOST);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setNear(true);
        else send("pauseVideo");
        if (e.isIntersecting && !hovered.current) send("playVideo");
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!near || playing) return;
    const onMessage = (e) => {
      if (e.origin !== HOST || e.source !== iframeRef.current?.contentWindow) return;
      let data;
      try { data = JSON.parse(e.data); } catch { return; }
      const state = data.info?.playerState ?? (data.event === "onStateChange" ? data.info : undefined);
      if (state === 1) setLive(true);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [near, playing]);

  const listen = () => {
    // Ask the player to report its state, so the poster stays up until frames are moving.
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "listening", id }), HOST);
  };

  const enter = () => { hovered.current = true; send("pauseVideo"); };
  const leave = () => { hovered.current = false; send("playVideo"); };

  const preview =
    `${HOST}/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}` +
    `&playsinline=1&rel=0&disablekb=1&iv_load_policy=3&fs=0&enablejsapi=1`;

  return (
    <figure ref={ref} className="frame" style={{ "--ar": ratio }}>
      {playing ? (
        <iframe
          src={`${HOST}/embed/${id}?autoplay=1&rel=0&playsinline=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <>
          {near && (
            <iframe
              ref={iframeRef}
              className="preview"
              src={preview}
              title={`${title}, pregled bez zvuka`}
              allow="autoplay; encrypted-media"
              tabIndex={-1}
              aria-hidden="true"
              onLoad={listen}
            />
          )}
          <button
            type="button"
            className={live ? "poster live" : "poster"}
            onClick={() => setPlaying(true)}
            onPointerEnter={(e) => e.pointerType === "mouse" && enter()}
            onPointerLeave={(e) => e.pointerType === "mouse" && leave()}
            aria-label={`Pusti video sa zvukom: ${title}`}
          >
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
        </>
      )}
    </figure>
  );
}
