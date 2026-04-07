import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function useOutsideClick(ref, onOutsideClick) {
  useEffect(() => {
    function handleClick(event) {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      onOutsideClick();
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onOutsideClick, ref]);
}

function CassettePlayer({ audio, storyTitle }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const source = audio?.src?.trim();
  const shouldAutoPlay = audio?.autoPlay !== false;

  useEffect(() => {
    const node = audioRef.current;

    if (!node || !source) {
      return undefined;
    }

    node.currentTime = 0;
    setHasError(false);

    if (!shouldAutoPlay) {
      return () => {
        node.pause();
        node.currentTime = 0;
      };
    }

    const playPromise = node.play();

    if (playPromise?.catch) {
      playPromise.catch(() => {
        setIsPlaying(!node.paused);
      });
    }

    return () => {
      node.pause();
      node.currentTime = 0;
    };
  }, [shouldAutoPlay, source]);

  if (!source) {
    return null;
  }

  function togglePlayback() {
    const node = audioRef.current;

    if (!node) {
      return;
    }

    if (node.paused) {
      const playPromise = node.play();

      if (playPromise?.catch) {
        playPromise.catch(() => {
          setHasError(true);
        });
      }

      return;
    }

    node.pause();
  }

  return (
    <section
      className={`cassette-player${isPlaying ? " is-playing" : ""}${hasError ? " has-error" : ""}`}
      aria-label={`Music player for ${storyTitle}`}
    >
      <div className="cassette-player__tape" aria-hidden="true">
        <span className="cassette-player__top-strip" />
        <span className="cassette-player__window" />
        <span className="cassette-player__bridge" />
        <span className="cassette-player__reel cassette-player__reel--left" />
        <span className="cassette-player__reel cassette-player__reel--right" />
      </div>

      <div className="cassette-player__copy">
        <p className="cassette-player__eyebrow">
          {audio.label ?? "Cassette tape"}
        </p>
        <strong>{audio.title ?? storyTitle}</strong>
        <p>
          {hasError
            ? "The audio file could not be played. Check the path in content.js."
            : audio.note ?? "This chapter starts playing your song as soon as it opens."}
        </p>
      </div>

      <button
        type="button"
        className="cassette-player__toggle"
        onClick={togglePlayback}
      >
        {isPlaying ? "Pause tape" : "Play tape"}
      </button>

      <audio
        ref={audioRef}
        src={source}
        preload={audio?.preload ?? "metadata"}
        autoPlay={shouldAutoPlay}
        loop={audio?.loop ?? true}
        onPlay={() => {
          setIsPlaying(true);
          setHasError(false);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false);
          setHasError(true);
        }}
      />
    </section>
  );
}

export function ExpandableMemoryList({ cards }) {
  const [active, setActive] = useState(null);
  const dialogRef = useRef(null);

  useOutsideClick(dialogRef, () => setActive(null));

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    document.body.style.overflow = active ? "hidden" : "auto";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [active]);

  function openStory(card, index) {
    setActive({ card, index });
  }

  const modal = active ? (
    <div className="expandable-modal is-open">
      <div className="expandable-modal__backdrop" />
      <article
        className="expandable-modal__card"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={active.card.title}
      >
        <button
          type="button"
          className="expandable-modal__close"
          onClick={() => setActive(null)}
          aria-label="Close story"
        >
          {"\u00D7"}
        </button>
        <img
          src={active.card.src}
          alt={active.card.title}
          className="expandable-modal__image"
        />
        <div className="expandable-modal__content">
          <p className="expandable-modal__eyebrow">
            Chapter {String(active.index + 1).padStart(2, "0")}
          </p>
          <h3>{active.card.title}</h3>
          <p className="expandable-modal__description">
            {active.card.description}
          </p>
          <CassettePlayer
            audio={active.card.audio}
            storyTitle={active.card.title}
          />
          <div className="expandable-modal__body">
            {active.card.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
    </div>
  ) : null;

  return (
    <>
      <div className="expandable-list">
        {cards.map((card, index) => (
          <button
            key={card.title}
            type="button"
            className="expandable-list__item"
            onClick={() => openStory(card, index)}
            aria-label={`Open story ${card.title}`}
          >
            <img src={card.src} alt={card.title} />
            <div className="expandable-list__meta">
              <div>
                <span className="expandable-list__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
              <span>{card.ctaText}</span>
            </div>
          </button>
        ))}
      </div>

      {typeof document !== "undefined"
        ? createPortal(modal, document.body)
        : null}
    </>
  );
}
