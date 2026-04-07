import { useMemo, useState } from "react";

export function LetterStack({ cards }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalCards = cards?.length ?? 0;

  const stack = useMemo(() => {
    if (!totalCards) {
      return [];
    }

    return cards.map((_, index) => cards[(activeIndex + index) % cards.length]);
  }, [activeIndex, cards, totalCards]);

  if (!totalCards) {
    return null;
  }

  function nextCard() {
    setActiveIndex((index) => (index + 1) % totalCards);
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
        aria-label="Show the next letter"
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
                <div className="letter-stack__meta">
                  <p className="letter-stack__name">{card.name}</p>
                </div>
                <h3>{card.designation}</h3>
                <p>{card.content}</p>
              </article>
            );
          })}
      </div>
    </div>
  );
}
