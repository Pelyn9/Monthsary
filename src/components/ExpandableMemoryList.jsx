import { useEffect, useRef, useState } from "react";

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

  return (
    <>
      <div className="expandable-list">
        {cards.map((card, index) => (
          <button
            key={card.title}
            type="button"
            className="expandable-list__item"
            onClick={() => setActive(card)}
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

      <div className={`expandable-modal${active ? " is-open" : ""}`}>
        <div className="expandable-modal__backdrop" />
        {active ? (
          <article className="expandable-modal__card" ref={dialogRef}>
            <button
              type="button"
              className="expandable-modal__close"
              onClick={() => setActive(null)}
              aria-label="Close story"
            >
              x
            </button>
            <img src={active.src} alt={active.title} className="expandable-modal__image" />
            <div className="expandable-modal__content">
              <p className="expandable-modal__eyebrow">Tap to edit in content.js</p>
              <h3>{active.title}</h3>
              <p className="expandable-modal__description">{active.description}</p>
              <div className="expandable-modal__body">
                {active.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </article>
        ) : null}
      </div>
    </>
  );
}
