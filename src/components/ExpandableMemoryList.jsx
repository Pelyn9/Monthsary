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
