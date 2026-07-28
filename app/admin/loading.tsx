export default function AdminLoading() {
  return (
    <div className="container admin-page" aria-busy="true" aria-label="Carregando painel">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-panel" />
    </div>
  );
}
