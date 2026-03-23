import { useEffect, useState } from "react";

export function LayoutTextFlip({ text, words }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!words.length) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, 2400);

    return () => window.clearInterval(timer);
  }, [words]);

  return (
    <div className="layout-text-flip">
      <span className="layout-text-flip__static">{text}</span>
      <span className="layout-text-flip__window" aria-live="polite">
        <span key={words[index]} className="layout-text-flip__word">
          {words[index]}
        </span>
      </span>
    </div>
  );
}
