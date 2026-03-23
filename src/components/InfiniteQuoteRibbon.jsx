export function InfiniteQuoteRibbon({ items }) {
  const loopedItems = [...items, ...items];

  return (
    <div className="infinite-quotes">
      <div className="infinite-quotes__track">
        {loopedItems.map((item, index) => (
          <article className="infinite-quotes__card" key={`${item.quote}-${index}`}>
            <p className="infinite-quotes__quote">"{item.quote}"</p>
            <div className="infinite-quotes__meta">
              <strong>{item.name}</strong>
              <span>{item.title}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
