import { saveBusinessRating } from "@/app/empresas/actions";
import { BusinessReviews, type BusinessReview } from "@/components/business/BusinessReviews";
import { RatingStars } from "@/components/business/RatingStars";

export function BusinessRating({
  business,
  currentRating,
  currentComment,
  initialReviews
}: {
  business: {
    id: string;
    slug: string;
    ratingAverage: number;
    ratingCount: number;
  };
  currentRating: number | null;
  currentComment: string;
  initialReviews: BusinessReview[];
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
        <label className="rating-comment-field">
          Comentário <span className="muted">(opcional)</span>
          <textarea
            name="comment"
            maxLength={150}
            rows={4}
            defaultValue={currentComment}
            placeholder="Conte como foi sua experiência"
          />
          <small>Até 150 caracteres.</small>
        </label>
        <button className="button secondary" type="submit">
          {currentRating ? "Atualizar avaliação" : "Enviar avaliação"}
        </button>
      </form>
      <BusinessReviews businessId={business.id} initialReviews={initialReviews} />
    </section>
  );
}
