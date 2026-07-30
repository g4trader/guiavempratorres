"use client";

import { useEffect, useRef, useState } from "react";
import { validateCommercialHighlight } from "@/lib/admin/commercial-validation";

type Props = {
  featured: boolean;
  order: string;
  startsAt: string;
  endsAt: string;
};

export function BusinessCommercialFields({
  featured,
  order: initialOrder,
  startsAt: initialStartsAt,
  endsAt: initialEndsAt
}: Props) {
  const [enabled, setEnabled] = useState(featured);
  const [order, setOrder] = useState(initialOrder);
  const [startsAt, setStartsAt] = useState(initialStartsAt);
  const [endsAt, setEndsAt] = useState(initialEndsAt);
  const orderRef = useRef<HTMLInputElement>(null);
  const endsAtRef = useRef<HTMLInputElement>(null);

  const { orderError, periodError } = validateCommercialHighlight({
    enabled,
    order,
    startsAt,
    endsAt
  });

  useEffect(() => {
    orderRef.current?.setCustomValidity(orderError);
    endsAtRef.current?.setCustomValidity(periodError);
  }, [orderError, periodError]);

  return (
    <fieldset className="admin-commercial-fieldset">
      <legend>Destaque comercial na Home</legend>
      <label className="checkbox-line">
        <input
          name="featured_home"
          type="checkbox"
          checked={enabled}
          onChange={(event) => setEnabled(event.target.checked)}
        />
        Exibir em “Empresas em destaque”
      </label>
      <p className="field-hint">
        Ao ativar, informe obrigatoriamente a ordem. O período é opcional, mas a data final deve
        ser posterior à inicial.
      </p>
      <div className="admin-form-row">
        <label>
          <span>
            Ordem {enabled ? <strong className="required-mark">*</strong> : null}
          </span>
          <input
            ref={orderRef}
            name="featured_home_order"
            type="number"
            min="0"
            step="1"
            required={enabled}
            disabled={!enabled}
            value={order}
            onChange={(event) => setOrder(event.target.value)}
            aria-invalid={Boolean(orderError)}
            aria-describedby={orderError ? "featured-home-order-error" : undefined}
          />
          {orderError ? (
            <small className="field-error" id="featured-home-order-error">
              {orderError}
            </small>
          ) : null}
        </label>
        <label>
          Início da veiculação
          <input
            name="featured_home_starts_at"
            type="datetime-local"
            disabled={!enabled}
            value={startsAt}
            onChange={(event) => setStartsAt(event.target.value)}
          />
        </label>
        <label>
          Fim da veiculação
          <input
            ref={endsAtRef}
            name="featured_home_ends_at"
            type="datetime-local"
            min={startsAt || undefined}
            disabled={!enabled}
            value={endsAt}
            onChange={(event) => setEndsAt(event.target.value)}
            aria-invalid={Boolean(periodError)}
            aria-describedby={periodError ? "featured-home-period-error" : undefined}
          />
          {periodError ? (
            <small className="field-error" id="featured-home-period-error">
              {periodError}
            </small>
          ) : null}
        </label>
      </div>
      <small>O plano da empresa também precisa permitir destaque na Home.</small>
    </fieldset>
  );
}
