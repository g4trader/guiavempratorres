export default function Loading() {
  return (
    <div className="container section" aria-busy="true" aria-label="Carregando conteúdo">
      <div className="skeleton skeleton-title" />
      <div className="grid">
        <div className="skeleton skeleton-card" />
        <div className="skeleton skeleton-card" />
        <div className="skeleton skeleton-card" />
      </div>
    </div>
  );
}
