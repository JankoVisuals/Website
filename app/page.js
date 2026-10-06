import Interactions from "@/components/Interactions";
import WorkFrame from "@/components/WorkFrame";
import { site, hero, works, proof, process, contact } from "@/content/site";

const nav = [
  { href: "#radovi", label: "Radovi" },
  { href: "#rezultati", label: "Rezultati" },
  { href: "#proces", label: "Proces" },
  { href: "#kontakt", label: "Kontakt" },
];

// The one call to action: a glass capsule holding a record-button knob. The knob's metal ring
// catches a slow, hot, iridescent light, like heated alloy or a coated lens element.
function CallButton({ href, large = false, label = "Zakaži poziv" }) {
  return (
    <a className={large ? "btn-alloy btn-alloy-lg" : "btn-alloy"} href={href} target="_blank" rel="noopener">
      <span className="knob" aria-hidden="true">
        <span className="knob-ring">
          <i className="lit film" />
          <i className="lit spec" />
          <i className="lit hot" />
        </span>
        <span className="knob-face">
          <span className="knob-dot" />
        </span>
        <span className="knob-glow halo">
          <span className="knob-src">
            <i className="lit hot" />
          </span>
        </span>
        <span className="knob-glow bloom">
          <span className="knob-src">
            <i className="lit spec" />
            <i className="lit hot" />
          </span>
        </span>
      </span>
      <span className="btn-label">{label}</span>
    </a>
  );
}

const days = (s) => (s.start === s.end ? `Dan ${s.start}` : `Dan ${s.start}-${s.end}`);
const pad = (n) => String(n).padStart(2, "0");

export default function Home() {
  const tracks = [1, 2].map((t) => process.steps.filter((s) => s.track === t));

  return (
    <>
      <header className="site-header" id="top">
        <a className="wordmark" href="#pocetak">
          Janko <em>Visuals</em>
        </a>
        <nav className="nav" aria-label="Glavna navigacija">
          {nav.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
        <button className="menu-btn" id="menu-btn" aria-expanded="false" aria-controls="menu">
          Meni
        </button>
      </header>

      <div className="menu" id="menu" hidden>
        <p className="eyebrow">{site.name}</p>
        {nav.map((n) => (
          <a key={n.href} href={n.href}>
            {n.label}
          </a>
        ))}
      </div>

      <main>
        <section className="hero" id="pocetak">
          <video
            className="hero-video"
            poster="/showreel/poster.jpg"
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src="/showreel/showreel.webm" type="video/webm" />
            <source src="/showreel/showreel.mp4" type="video/mp4" />
          </video>
          <div className="slate mono" aria-hidden="true">
            <span className="rec">
              <i />
              Showreel
            </span>
            <span className="tc" id="tc">
              00:00:00:00
            </span>
          </div>
          <div className="hero-inner">
            <p className="eyebrow rise">{hero.eyebrow}</p>
            <h1 className="rise d1">
              {hero.titleBefore}
              <em>{hero.titleEmphasis}</em>
              {hero.titleAfter}
            </h1>
            <p className="hero-sub rise d2">{hero.sub}</p>
            <div className="hero-actions rise d3">
              <CallButton href={site.calendly} large />
              <a className="text-link" href="#radovi">
                Pogledajte radove
              </a>
            </div>
          </div>
          <div className="hero-note rise d4">
            <span className="mono ash">{hero.proof}</span>
          </div>
        </section>

        <section className="works" id="radovi" aria-labelledby="radovi-h">
          <div className="works-pin">
            <div className="works-head">
              <h2 id="radovi-h">Radovi</h2>
              <p>{works.intro}</p>
            </div>
            <div className="works-viewport">
              <ol className="track" id="track">
                {works.items.map((w, i) => (
                  <li key={i} className={w.vertical ? "work vertical" : "work"}>
                    {w.youtube ? (
                      <WorkFrame work={w} />
                    ) : (
                      <figure className="frame" style={{ "--ar": w.ratio }}>
                        <canvas data-scene={w.scene} aria-hidden="true" />
                        <span className="tag mono">Primer</span>
                        <span className="play" aria-hidden="true">
                          <svg viewBox="0 0 16 16">
                            <path d="M3 1.5v13l11-6.5z" fill="currentColor" />
                          </svg>
                        </span>
                        <figcaption className="frame-meta mono">
                          <span>{w.ratioLabel}</span>
                          <span>{w.duration}</span>
                        </figcaption>
                      </figure>
                    )}
                    <div className="work-meta">
                      <p className="mono ash">{w.category}</p>
                      <h3>{w.title}</h3>
                      <p className="desc">{w.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="works-foot" aria-hidden="true">
              <span className="count mono ash">
                <span id="count">01</span> / {pad(works.items.length)}
              </span>
              <div className="progress">
                <span id="progress" />
              </div>
              <span className="mono ash">Skrolujte</span>
            </div>
          </div>
        </section>

        <section className="proof" id="rezultati" aria-labelledby="rezultati-h">
          <h2 id="rezultati-h" className="eyebrow">
            Rezultati
          </h2>
          <div className="proof-grid">
            <p className="big-num" aria-label={`${proof.number} puta`}>
              {proof.number}
              <span>×</span>
            </p>
            <div>
              <p className="proof-line">{proof.line}</p>
              <p className="mono ash">{proof.client}</p>
            </div>
          </div>
          <ul className="clients" aria-label="Klijenti">
            {proof.clients.map((c) => (
              <li key={c}>{c}</li>
            ))}
            <li className="more">i drugi</li>
          </ul>
        </section>

        <section className="process" id="proces" aria-labelledby="proces-h">
          <div className="process-head">
            <p className="eyebrow">Proces</p>
            <h2 id="proces-h">{process.title}</h2>
            <p>{process.intro}</p>
          </div>
          <div className="tl" id="tl">
            <div className="tl-ruler mono" aria-hidden="true">
              <span />
              {Array.from({ length: 10 }, (_, i) => (
                <span key={i}>Dan {i + 1}</span>
              ))}
            </div>
            <div className="tl-tracks">
              {tracks.map((steps, t) => (
                <div className="tl-track" key={t}>
                  <span className="track-label mono">V{t + 1}</span>
                  {steps.map((s) => (
                    <div
                      key={s.name}
                      className={s.final ? "clip final" : "clip"}
                      style={{ "--s": s.start, "--e": s.end }}
                    >
                      <span className="clip-name">{s.name}</span>
                      <span className="clip-days mono">{days(s)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <span className="playhead" id="playhead" aria-hidden="true" />
          </div>
        </section>

        <section className="contact" id="kontakt" aria-labelledby="kontakt-h">
          <p className="eyebrow">Kontakt</p>
          <h2 id="kontakt-h">
            {contact.titleBefore}
            <em>{contact.titleEmphasis}</em>
          </h2>
          <div className="contact-row">
            <CallButton href={site.calendly} large label="Zakaži uvodni poziv" />
            <div className="mail">
              <span className="mono ash">ili pišite na</span>
              <a className="mail-addr" id="mail" href={`mailto:${site.email}`} style={{ textDecoration: "none" }}>
                {site.email}
              </a>
              <button className="btn btn-ghost" id="copy" type="button">
                <span>Kopiraj</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer mono">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <a className="text-link" href="#pocetak" style={{ fontSize: 12 }}>
          Na vrh
        </a>
      </footer>

      <div className="cta-dock" id="cta-dock" inert>
        <CallButton href={site.calendly} />
      </div>

      <Interactions />
    </>
  );
}
