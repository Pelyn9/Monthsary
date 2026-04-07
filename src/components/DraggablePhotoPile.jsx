import { useState } from "react";

function DraggablePhotoCard({ item, index }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  function handlePointerDown(event) {
    const startX = event.clientX;
    const startY = event.clientY;
    const initialOffset = { ...offset };

    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);

    function handlePointerMove(moveEvent) {
      setOffset({
        x: initialOffset.x + moveEvent.clientX - startX,
        y: initialOffset.y + moveEvent.clientY - startY,
      });
    }

    function handlePointerUp() {
      setDragging(false);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp, { once: true });
  }

  return (
    <article
      className={`draggable-card${dragging ? " is-dragging" : ""}`}
      onPointerDown={handlePointerDown}
      style={{
        "--left": item.left,
        "--top": item.top,
        "--rotate": item.rotate,
        transform: `translate(${offset.x}px, ${offset.y}px) rotate(${item.rotate})`,
        zIndex: dragging ? 20 : index + 1,
      }}
    >
      <img src={item.image} alt={item.title} className="draggable-card__image" />
      <div className="draggable-card__copy">
        <h3>{item.title}</h3>
        <p>{item.caption}</p>
      </div>
    </article>
  );
}

export function DraggablePhotoPile({ items }) {
  return (
    <div className="draggable-pile">
      <p className="draggable-pile__hint">
        A little pile of moments I always want close enough to touch.
      </p>

      <div className="draggable-pile__stage">
        {items.map((item, index) => (
          <DraggablePhotoCard key={`${item.title}-${index}`} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}
