import { isValidElement, useEffect, useState } from "react";

function DockIcon({ icon }) {
  if (isValidElement(icon)) {
    return icon;
  }

  if (icon === "home") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5.5 9.5V21h13V9.5" />
      </svg>
    );
  }

  if (icon === "photos") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="m7.5 15 3.5-3.5 2.5 2.5 3.5-4 3 4" />
        <circle cx="9" cy="9" r="1.25" />
      </svg>
    );
  }

  if (icon === "sparkle") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 1.75 5.25L19 10l-5.25 1.75L12 17l-1.75-5.25L5 10l5.25-1.75Z" />
      </svg>
    );
  }

  if (icon === "book") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21Z" />
        <path d="M5 5.5V21" />
      </svg>
    );
  }

  if (icon === "letter") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 20-1.3-1.2C5.4 14 2 10.9 2 7.2 2 4.3 4.3 2 7.2 2c1.8 0 3.5.9 4.5 2.3C12.8 2.9 14.5 2 16.3 2 19.2 2 21.5 4.3 21.5 7.2c0 3.7-3.4 6.8-8.7 11.6Z" />
    </svg>
  );
}

export function FloatingDock({ items }) {
  const [activeHref, setActiveHref] = useState(items[0]?.href ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.querySelector(item.href))
      .filter(Boolean);

    if (!sections.length || !("IntersectionObserver" in window)) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveHref(`#${visible.target.id}`);
        }
      },
      {
        threshold: [0.2, 0.4, 0.6],
        rootMargin: "-20% 0px -35% 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="floating-dock" aria-label="Section navigation">
      {items.map((item) => (
        <a
          key={item.title}
          href={item.href}
          className={`floating-dock__item${activeHref === item.href ? " is-active" : ""}`}
          aria-current={activeHref === item.href ? "page" : undefined}
        >
          <span className="floating-dock__icon">
            <DockIcon icon={item.icon} />
          </span>
          <span className="floating-dock__text">{item.title}</span>
        </a>
      ))}
    </nav>
  );
}
