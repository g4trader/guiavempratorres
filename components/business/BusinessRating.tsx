import { saveBusinessRating } from "@/app/empresas/actions";

export function RatingStars({
  value,
  label
}: {
  value: number;
  label: string;
}) {
  const rounded = Math.round(value);

  return (
    <span className="rating-stars" aria-label={label} role="img">
      {Array.from({ length: 5 }, (_, index) => (
        <span className={index < rounded ? "is-filled" : ""} aria-hidden="true" key={index}>
          ★
        </span>
      ))}
    </span>
  );
}

export function BusinessRating({
  business,
  currentRating
}: {
  business: {
    id: string;
    slug: string;
    ratingAverage: number;
    ratingCount: number;
  };
  currentRating: number | null;
}) {
  return (
    <section className="panel business-rating">
      <h2>Avaliações</h2>
      <div className="rating-summary">
        <strong>{business.ratingAverage.toFixed(1).replace(".", ",")}</strong>
        <div>
          <RatingStars
            value={business.ratingAverage}
            label={`${business.ratingAverage.toFixed(1)} de 5 estrelas`}
          />
          <span>
            {business.ratingCount === 0
              ? "Empresa nova"
              : `${business.ratingCount} ${
                  business.ratingCount === 1 ? "avaliação" : "avaliações"
                }`}
          </span>
        </div>
      </div>
      <form action={saveBusinessRating} className="rating-form">
        <input type="hidden" name="business_id" value={business.id} />
        <input type="hidden" name="slug" value={business.slug} />
        <fieldset>
          <legend>{currentRating ? "Sua avaliação" : "Avalie esta empresa"}</legend>
          <div className="rating-options">
            {[1, 2, 3, 4, 5].map((rating) => (
              <label key={rating}>
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  defaultChecked={currentRating === rating}
                  required
                />
                <span aria-hidden="true">★</span>
                <span className="sr-only">{rating} estrelas</span>
              </label>
            ))}
          </div>
        </fieldset>
        <button className="button secondary" type="submit">
          {currentRating ? "Atualizar avaliação" : "Enviar avaliação"}
        </button>
      </form>
    </section>
  );
}
