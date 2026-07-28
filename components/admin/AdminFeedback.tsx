"use client";

import { useEffect, useState } from "react";

export function AdminFeedback({
  error,
  message
}: {
  error?: string;
  message?: string;
}) {
  const text = error || message;
  if (!text) return null;

  return <FeedbackMessage key={`${error ? "error" : "success"}:${text}`} error={Boolean(error)} text={text} />;
}

function FeedbackMessage({ error, text }: { error: boolean; text: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (error) return;
    const timeout = window.setTimeout(() => setVisible(false), 5000);
    return () => window.clearTimeout(timeout);
  }, [error]);

  if (!visible) return null;

  return (
    <div
      className={`admin-feedback ${error ? "error" : "success"}`}
      role={error ? "alert" : "status"}
      aria-live={error ? "assertive" : "polite"}
    >
      <span aria-hidden="true">{error ? "!" : "✓"}</span>
      <p>{text}</p>
      <button type="button" onClick={() => setVisible(false)} aria-label="Fechar mensagem">
        ×
      </button>
    </div>
  );
}
