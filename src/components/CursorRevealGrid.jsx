function RevealCard({ card, index }) {
  function handlePointerMove(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;

    event.currentTarget.style.setProperty("--pointer-x", `${x}px`);
    event.currentTarget.style.setProperty("--pointer-y", `${y}px`);
  }

  return (
    <article className="cursor-reveal-card" onPointerMove={handlePointerMove}>
      <div className="cursor-reveal-card__shine" />
      <div className="cursor-reveal-card__content">
        <div className="cursor-reveal-card__meta">
          <span className="cursor-reveal-card__index">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="cursor-reveal-card__subtitle">{card.subtitle}</p>
        </div>
        <h3>{card.title}</h3>
        <p>{card.detail}</p>
      </div>
    </article>
  );
}

export function CursorRevealGrid({ cards }) {
  return (
    <div className="cursor-reveal-grid">
      {cards.map((card, index) => (
        <RevealCard key={card.title} card={card} index={index} />
      ))}
    </div>
  );
}
