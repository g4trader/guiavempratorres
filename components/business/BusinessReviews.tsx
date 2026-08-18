"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { RatingStars } from "@/components/business/RatingStars";

export type BusinessReview = { rating: number; comment: string | null; created_at: string; total_count?: number };
const pageSize = 10;

export function BusinessReviews({ businessId, initialReviews }: { businessId: string; initialReviews: BusinessReview[] }) {
  const [open, setOpen] = useState(false);
  const [reviews, setReviews] = useState<BusinessReview[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadPage(nextPage: number) {
    setLoading(true);
    setError("");
    const { data, error: loadError } = await createBrowserSupabaseClient().rpc("get_public_business_reviews", {
      p_business_id: businessId,
      p_offset: nextPage * pageSize,
      p_limit: pageSize
    });
    setLoading(false);
    if (loadError) return setError("Não foi possível carregar as avaliações.");
    const result = data ?? [];
    setReviews(result);
    setTotal(Number(result[0]?.total_count ?? 0));
    setPage(nextPage);
  }

  async function showAll() {
    setOpen(true);
    await loadPage(0);
  }

  return (
    <div className="business-reviews-list">
      {initialReviews.length ? (
        <>
          <h3>Avaliações mais recentes</h3>
          {initialReviews.map((review, index) => <ReviewItem review={review} key={`${review.created_at}-${index}`} />)}
          <button className="button secondary" type="button" onClick={() => void showAll()}>Ver todas as avaliações</button>
        </>
      ) : null}
      {open ? (
        <div className="reviews-modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}>
          <section className="reviews-modal" role="dialog" aria-modal="true" aria-label="Todas as avaliações">
            <button className="reviews-modal-close" type="button" aria-label="Fechar avaliações" onClick={() => setOpen(false)}>×</button>
            <h2>Todas as avaliações</h2>
            {loading ? <p>Carregando avaliações…</p> : null}
            {error ? <p role="alert">{error}</p> : null}
            {!loading && !error ? reviews.map((review, index) => <ReviewItem review={review} key={`${review.created_at}-${index}`} />) : null}
            <div className="reviews-pagination">
              <button className="button secondary" type="button" disabled={page === 0 || loading} onClick={() => void loadPage(page - 1)}>Anterior</button>
              <span>Página {page + 1} de {Math.max(1, Math.ceil(total / pageSize))}</span>
              <button className="button secondary" type="button" disabled={(page + 1) * pageSize >= total || loading} onClick={() => void loadPage(page + 1)}>Próxima</button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function ReviewItem({ review }: { review: BusinessReview }) {
  return (
    <article className="business-review-item">
      <div>
        <RatingStars value={review.rating} label={`${review.rating} de 5 estrelas`} />
        <time dateTime={review.created_at}>{new Intl.DateTimeFormat("pt-BR").format(new Date(review.created_at))}</time>
      </div>
      {review.comment ? <p>{review.comment}</p> : <p className="muted">Avaliação sem comentário.</p>}
    </article>
  );
}
