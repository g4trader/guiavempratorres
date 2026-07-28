"use client";

import { useRef, type ReactNode } from "react";

export function AdminModal({
  title,
  triggerLabel,
  children,
  compact = false
}: {
  title: string;
  triggerLabel: string;
  children: ReactNode;
  compact?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        className={compact ? "admin-icon-button" : "button admin-add-button"}
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label={triggerLabel}
      >
        {compact ? "✎" : `+ ${triggerLabel}`}
      </button>
      <dialog className="admin-modal" ref={dialogRef} onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}>
        <div className="admin-modal-card">
          <header>
            <div>
              <span className="eyebrow">Item da empresa</span>
              <h2>{title}</h2>
            </div>
            <button
              className="admin-modal-close"
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Fechar"
            >
              ×
            </button>
          </header>
          {children}
        </div>
      </dialog>
    </>
  );
}
