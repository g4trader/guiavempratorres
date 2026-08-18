export function RatingStars({ value, label }: { value: number; label: string }) {
  const rounded = Math.round(value);

  return (
    <span className="rating-stars" aria-label={label} role="img">
      {Array.from({ length: 5 }, (_, index) => (
        <span className={index < rounded ? "is-filled" : ""} aria-hidden="true" key={index}>★</span>
      ))}
    </span>
  );
}
