import { useEffect, useState } from "react";

export function SmoothCarousel({ slides }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!slides.length) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCurrent((index) => (index + 1) % slides.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [slides]);

  function goTo(index) {
    setCurrent(index);
  }

  function next() {
    setCurrent((index) => (index + 1) % slides.length);
  }

  function previous() {
    setCurrent((index) => (index - 1 + slides.length) % slides.length);
  }

  return (
    <div className="smooth-carousel">
      <div className="smooth-carousel__topline">
        <div className="smooth-carousel__progress">
          <span
            className="smooth-carousel__progress-fill"
            style={{ width: `${((current + 1) / slides.length) * 100}%` }}
          />
        </div>
        <p className="smooth-carousel__counter">
          {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </p>
      </div>

      <div className="smooth-carousel__viewport">
        <div
          className="smooth-carousel__track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide) => (
            <article className="smooth-carousel__slide" key={slide.title}>
              <img src={slide.src} alt={slide.title} />
              <div className="smooth-carousel__overlay">
                <span className="smooth-carousel__eyebrow">Purple memory reel</span>
                <h3>{slide.title}</h3>
                <p>{slide.caption}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="smooth-carousel__controls">
        <button type="button" onClick={previous} aria-label="Previous slide">
          Prev
        </button>
        <div className="smooth-carousel__dots">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              className={index === current ? "is-active" : ""}
              onClick={() => goTo(index)}
              aria-label={`Go to ${slide.title}`}
            />
          ))}
        </div>
        <button type="button" onClick={next} aria-label="Next slide">
          Next
        </button>
      </div>
    </div>
  );
}
