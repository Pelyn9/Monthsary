import { useMemo, useState } from "react";

export function LetterStack({ cards }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const stack = useMemo(() => {
    return cards.map((_, index) => cards[(activeIndex + index) % cards.length]);
  }, [activeIndex, cards]);

  function nextCard() {
    setActiveIndex((index) => (index + 1) % cards.length);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      nextCard();
    }
  }

  return (
    <div className="letter-stack">
      <div
        className="letter-stack__stage"
        onClick={nextCard}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
        {stack
          .slice(0, 3)
          .reverse()
          .map((card, index) => {
            const visualIndex = 2 - index;

            return (
              <article
                key={card.id}
                className={`letter-stack__card letter-stack__card--${visualIndex}`}
              >
                <p className="letter-stack__name">{card.name}</p>
                <h3>{card.designation}</h3>
                <p>{card.content}</p>
              </article>
            );
          })}
      </div>

      <button type="button" className="letter-stack__button" onClick={nextCard}>
        Next letter
      </button>
    </div>
  );
}
