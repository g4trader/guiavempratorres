"use client";

import { useEffect, useRef, useState } from "react";

export function CampaignPeriodFields({
  startsAt: initialStartsAt,
  endsAt: initialEndsAt,
  displayOrder
}: {
  startsAt: string;
  endsAt: string;
  displayOrder: number;
}) {
  const [startsAt, setStartsAt] = useState(initialStartsAt);
  const [endsAt, setEndsAt] = useState(initialEndsAt);
  const endsAtRef = useRef<HTMLInputElement>(null);
  const periodError =
    startsAt && endsAt && new Date(endsAt).getTime() <= new Date(startsAt).getTime()
      ? "A data final deve ser posterior à data inicial."
      : "";

  useEffect(() => {
    endsAtRef.current?.setCustomValidity(periodError);
  }, [periodError]);

  return (
    <div className="admin-form-row">
      <label>
        <span>
          Início <strong className="required-mark">*</strong>
        </span>
        <input
          name="starts_at"
          type="datetime-local"
          required
          value={startsAt}
          onChange={(event) => setStartsAt(event.target.value)}
        />
      </label>
      <label>
        <span>
          Fim <strong className="required-mark">*</strong>
        </span>
        <input
          ref={endsAtRef}
          name="ends_at"
          type="datetime-local"
          required
          min={startsAt || undefined}
          value={endsAt}
          onChange={(event) => setEndsAt(event.target.value)}
          aria-invalid={Boolean(periodError)}
          aria-describedby={periodError ? "campaign-period-error" : undefined}
        />
        {periodError ? (
          <small className="field-error" id="campaign-period-error">
            {periodError}
          </small>
        ) : null}
      </label>
      <label>
        Ordem
        <input name="display_order" type="number" min="0" step="1" defaultValue={displayOrder} />
      </label>
    </div>
  );
}
