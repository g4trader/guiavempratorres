import type { ReactNode } from "react";

export function AdminCreatePanel({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details className="admin-create">
      <summary aria-label={title} title={title}>
        <span aria-hidden="true">+</span>
      </summary>
      <section className="panel admin-create-content">
        <div className="admin-create-heading">
          <span className="eyebrow">Novo cadastro</span>
          <h2>{title}</h2>
        </div>
        {children}
      </section>
    </details>
  );
}
