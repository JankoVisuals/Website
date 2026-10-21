"use client";

import { useEffect, useState } from "react";
import WorkFrame from "./WorkFrame";

// The works as a feed, like Pinterest: columns filled by height, so tall reels
// and wide films sit side by side as equals. Two columns on a phone, three on
// a computer; the second column starts lower, so the grid never reads as rows.
const wide = "(min-width: 821px)";

// Each work goes to the shortest column, in order, but never under a work by the same
// client, and preferably not beside one either, so one client's films stay apart.
function distribute(items, cols) {
  const columns = Array.from({ length: cols }, () => ({ h: 0, items: [] }));
  const has = (c, client) => c && c.items.some((w) => w.client === client);
  for (const w of items) {
    const [a, b] = w.ratio.split("/").map(Number);
    const score = (c, i) =>
      c.h + (has(c, w.client) ? 100 : 0) + (has(columns[i - 1], w.client) || has(columns[i + 1], w.client) ? 0.5 : 0);
    let best = 0;
    columns.forEach((c, i) => {
      if (score(c, i) < score(columns[best], best)) best = i;
    });
    columns[best].items.push(w);
    columns[best].h += b / a;
  }
  return columns.map((c) => c.items);
}

export default function WorksFeed({ items }) {
  const [cols, setCols] = useState(2);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = matchMedia(wide);
    const sync = () => setCols(mq.matches ? 3 : 2);
    sync();
    setReady(true);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div className={ready ? "feed ready" : "feed"}>
      {distribute(items, cols).map((column, i) => (
        <ul className="feed-col" key={`${cols}-${i}`}>
          {column.map((w) => (
            <li key={w.title}>
              <WorkFrame work={w} />
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
