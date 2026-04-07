import { useEffect, useMemo, useRef } from "react";
import { siteContent } from "./content";
import { FloatingDock } from "./components/FloatingDock";
import { LayoutTextFlip } from "./components/LayoutTextFlip";
import { DraggablePhotoPile } from "./components/DraggablePhotoPile";
import { SmoothCarousel } from "./components/SmoothCarousel";
import { ExpandableMemoryList } from "./components/ExpandableMemoryList";
import { CursorRevealGrid } from "./components/CursorRevealGrid";
import { LetterStack } from "./components/LetterStack";
import { InfiniteQuoteRibbon } from "./components/InfiniteQuoteRibbon";

// Reverse the sequence so the trail reads left-to-right as "I LOVE YOU"
// while the characters follow behind the cursor.
const CURSOR_TRAIL = [..."I LOVE YOU"].reverse();

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

function addMonthsPreservingDay(date, monthsToAdd) {
  const result = new Date(date);
  const originalDay = result.getDate();

  result.setDate(1);
  result.setMonth(result.getMonth() + monthsToAdd);
  result.setDate(
    Math.min(
      originalDay,
      new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate(),
    ),
  );

  return result;
}

function getRelationshipStats(startDateString) {
  const start = new Date(`${startDateString}T00:00:00`);

  if (Number.isNaN(start.getTime())) {
    return null;
  }

  const today = new Date();
  const todayAtMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const daysTogether = Math.max(
    1,
    Math.floor((todayAtMidnight.getTime() - start.getTime()) / 86400000) + 1,
  );

  let monthsTogether =
    (todayAtMidnight.getFullYear() - start.getFullYear()) * 12 +
    (todayAtMidnight.getMonth() - start.getMonth());

  if (addMonthsPreservingDay(start, monthsTogether) > todayAtMidnight) {
    monthsTogether -= 1;
  }

  monthsTogether = Math.max(monthsTogether, 0);

  return {
    monthsTogether,
    daysTogether,
    nextMonthsary: dateFormatter.format(
      addMonthsPreservingDay(start, monthsTogether + 1),
    ),
    togetherSince: dateFormatter.format(start),
  };
}

function SectionHeading({ eyebrow, title, description, note }) {
  return (
    <div className="section-heading" data-reveal>
      <p className="section-heading__eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p className="section-heading__description">{description}</p>
      {note ? <p className="section-heading__note">{note}</p> : null}
    </div>
  );
}

function SectionShell({ id, className = "", children }) {
  return (
    <section className={`section-shell ${className}`.trim()} id={id} data-reveal>
      <div className="section-shell__inner">{children}</div>
    </section>
  );
}

function TulipCursor() {
  const cursorRef = useRef(null);
  const trailLayerRef = useRef(null);
  const trailRefs = useRef([]);
  const trailTimeoutRef = useRef(null);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !window.matchMedia("(pointer: fine)").matches
    ) {
      return undefined;
    }

    const cursor = cursorRef.current;
    const trailLayer = trailLayerRef.current;

    if (!cursor || !trailLayer) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    document.body.classList.add("has-tulip-cursor");

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let frameId = 0;
    let hasInteracted = false;
    const trailPoints = CURSOR_TRAIL.map(() => ({
      x: targetX + 18,
      y: targetY - 16,
    }));
    const trailNodes = trailRefs.current;

    function showCursorAtPosition(x, y) {
      targetX = x;
      targetY = y;

      if (!hasInteracted) {
        hasInteracted = true;
        currentX = x;
        currentY = y;
      }

      trailPoints.forEach((point) => {
        point.x = x + 18;
        point.y = y - 16;
      });

      cursor.classList.add("is-visible");
    }

    function showTrail() {
      trailLayer.classList.add("is-visible");

      if (trailTimeoutRef.current) {
        window.clearTimeout(trailTimeoutRef.current);
      }

      trailTimeoutRef.current = window.setTimeout(() => {
        trailLayer.classList.remove("is-visible");
        trailTimeoutRef.current = null;
      }, prefersReducedMotion ? 80 : 180);
    }

    function render() {
      const easing = prefersReducedMotion ? 1 : 0.24;

      currentX += (targetX - currentX) * easing;
      currentY += (targetY - currentY) * easing;

      cursor.style.left = `${currentX}px`;
      cursor.style.top = `${currentY}px`;

      let followX = currentX + 18;
      let followY = currentY - 16;

      trailNodes.forEach((node, index) => {
        if (!node) {
          return;
        }

        const point = trailPoints[index];
        const trailEase = prefersReducedMotion
          ? 1
          : Math.max(0.18, 0.38 - index * 0.02);

        point.x += (followX - point.x) * trailEase;
        point.y += (followY - point.y) * trailEase;

        const scale = Math.max(0.58, 1 - index * 0.045);
        const opacity = Math.max(
          node.dataset.space === "true" ? 0.18 : 0.32,
          0.96 - index * 0.085,
        );

        node.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) scale(${scale})`;
        node.style.opacity = `${opacity}`;

        followX = point.x - (node.dataset.space === "true" ? 7 : 11);
        followY = point.y + 1.5;
      });

      frameId = window.requestAnimationFrame(render);
    }

    function handlePointerMove(event) {
      if (!hasInteracted) {
        showCursorAtPosition(event.clientX, event.clientY);
      } else {
        targetX = event.clientX;
        targetY = event.clientY;
      }

      showTrail();
    }

    function handlePointerEnter(event) {
      showCursorAtPosition(event.clientX, event.clientY);
    }

    function handlePointerDown() {
      cursor.classList.add("is-pressed");
    }

    function handlePointerUp() {
      cursor.classList.remove("is-pressed");
    }

    function handlePointerExit() {
      cursor.classList.remove("is-visible");
      cursor.classList.remove("is-pressed");
      trailLayer.classList.remove("is-visible");

      if (trailTimeoutRef.current) {
        window.clearTimeout(trailTimeoutRef.current);
        trailTimeoutRef.current = null;
      }
    }

    function handleMouseLeaveDocument(event) {
      if (!event.relatedTarget) {
        handlePointerExit();
      }
    }

    frameId = window.requestAnimationFrame(render);

    document.addEventListener("pointerenter", handlePointerEnter, true);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("blur", handlePointerExit);
    document.addEventListener("mouseout", handleMouseLeaveDocument);

    return () => {
      window.cancelAnimationFrame(frameId);
      document.body.classList.remove("has-tulip-cursor");
      if (trailTimeoutRef.current) {
        window.clearTimeout(trailTimeoutRef.current);
      }
      document.removeEventListener("pointerenter", handlePointerEnter, true);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("blur", handlePointerExit);
      document.removeEventListener("mouseout", handleMouseLeaveDocument);
    };
  }, []);

  return (
    <>
      <div className="cursor-love-trail" ref={trailLayerRef} aria-hidden="true">
        {CURSOR_TRAIL.map((character, index) => (
          <span
            key={`${character}-${index}`}
            ref={(node) => {
              trailRefs.current[index] = node;
            }}
            className={`cursor-love-trail__char${character === " " ? " is-space" : ""}`}
            data-space={character === " " ? "true" : "false"}
          >
            {character === " " ? "\u00A0" : character}
          </span>
        ))}
      </div>

      <div className="cursor-tulip" ref={cursorRef} aria-hidden="true">
        <div className="cursor-tulip__flower">
          <span className="cursor-tulip__stem" />
          <span className="cursor-tulip__leaf cursor-tulip__leaf--left" />
          <span className="cursor-tulip__leaf cursor-tulip__leaf--right" />
          <span className="cursor-tulip__petal cursor-tulip__petal--left" />
          <span className="cursor-tulip__petal cursor-tulip__petal--center" />
          <span className="cursor-tulip__petal cursor-tulip__petal--right" />
        </div>
      </div>
    </>
  );
}

function App() {
  const stats = useMemo(
    () => getRelationshipStats(siteContent.relationshipStart),
    [],
  );

  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="app-shell">
      <TulipCursor />
      <div className="background-orb background-orb--one" aria-hidden="true" />
      <div className="background-orb background-orb--two" aria-hidden="true" />
      <div className="background-orb background-orb--three" aria-hidden="true" />
      <FloatingDock items={siteContent.dockLinks} />

      <main className="page">
        <section className="hero" id="home">
          <div className="hero__copy">
            <div className="hero__topline" data-reveal>
              <p className="hero__eyebrow">{siteContent.hero.eyebrow}</p>
              {stats ? (
                <p className="hero__microcopy">
                  Together since {stats.togetherSince}
                </p>
              ) : null}
            </div>

            <LayoutTextFlip
              text={siteContent.hero.intro}
              words={siteContent.hero.words}
            />
            <h1>
              {siteContent.hero.title}
              <span>{siteContent.names.toName}</span>
            </h1>
            <p className="hero__description">{siteContent.hero.description}</p>

            <div className="hero__badges" data-reveal>
              {siteContent.hero.badges.map((badge) => (
                <span key={badge}>{badge}</span>
              ))}
            </div>

            {stats ? (
              <div className="hero__stats" data-reveal>
                <article>
                  <strong>{stats.monthsTogether}</strong>
                  <span>months together</span>
                </article>
                <article>
                  <strong>{stats.daysTogether}</strong>
                  <span>days of choosing us</span>
                </article>
                <article>
                  <strong>{stats.nextMonthsary}</strong>
                  <span>next monthsary date</span>
                </article>
              </div>
            ) : null}

            <div className="hero__actions" data-reveal>
              <a href="#photos" className="button button--primary">
                See our photos
              </a>
              <a href="#letters" className="button button--secondary">
                Read the letters
              </a>
            </div>
          </div>

          <aside className="hero__panel" data-reveal>
            <p className="hero__panel-tag">Purple tulip edition</p>
            <h2>{siteContent.hero.cardTitle}</h2>
            <p>{siteContent.hero.cardText}</p>

            <blockquote className="hero__quote">
              {siteContent.hero.sideQuote}
            </blockquote>

            {stats ? (
              <div className="hero__panel-meta">
                <span>Together since {stats.togetherSince}</span>
                <span>My favorite person</span>
              </div>
            ) : null}

            <div className="hero__signature">
              <span>Always yours,</span>
              <strong>{siteContent.names.fromName}</strong>
            </div>
          </aside>
        </section>

        <SectionShell id="photos" className="section">
          <SectionHeading
            eyebrow="Draggable Memories"
            title="A photo pile you can move around."
            description="This section is inspired by the draggable Aceternity card layout, but rewritten for this monthsary site and tuned for your own couple photos."
            note="Edit the image URLs and captions in src/content.js."
          />
          <DraggablePhotoPile items={siteContent.draggablePhotos} />
        </SectionShell>

        <SectionShell id="moments" className="section">
          <SectionHeading
            eyebrow="Smooth Carousel"
            title="Moments that glide instead of just sitting there."
            description="A softer, smoother carousel section for romantic highlights, date memories, or future dream shots."
            note="Edit the carouselSlides array in src/content.js."
          />
          <SmoothCarousel slides={siteContent.carouselSlides} />
        </SectionShell>

        <SectionShell id="stories" className="section">
          <SectionHeading
            eyebrow="Expandable Stories"
            title="Tap a memory and open the full story."
            description="This takes the expandable card idea and turns it into a more romantic memory list for your relationship."
            note="Edit the expandableStories array in src/content.js."
          />
          <ExpandableMemoryList cards={siteContent.expandableStories} />
        </SectionShell>

        <SectionShell id="letters" className="section">
          <SectionHeading
            eyebrow="Letters"
            title="Soft notes, kept close."
            description="Hover through a few things I love about you, then turn through the little letters one by one."
          />

          <div className="letters-section">
            <div className="letters-section__stack">
              <div className="letters-section__copy" data-reveal>
                <p className="letters-section__label">Cursor Glow</p>
                <h3>Three little reasons I keep returning to you.</h3>
                <p>Move slowly and let each note light up on its own.</p>
              </div>
              <CursorRevealGrid cards={siteContent.hoverLetters} />
            </div>

            <div className="letters-section__stack">
              <div className="letters-section__copy" data-reveal>
                <p className="letters-section__label">Card Stack</p>
                <h3>Little letters for the quiet parts of us.</h3>
                <p>Tap through the notes and let them take their turn.</p>
              </div>
              <LetterStack cards={siteContent.stackLetters} />
            </div>
          </div>
        </SectionShell>

        <SectionShell id="forever" className="section">
          <SectionHeading
            eyebrow="Infinite Words"
            title="Promises that keep moving, just like us."
            description="A scrolling quote ribbon for vows, favorite lines, or tiny love notes that repeat around the page."
            note="Edit the movingQuotes array in src/content.js."
          />
          <InfiniteQuoteRibbon items={siteContent.movingQuotes} />
        </SectionShell>
      </main>
    </div>
  );
}

export default App;
