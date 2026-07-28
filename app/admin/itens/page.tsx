import { createBusinessItem, deleteBusinessItem, updateBusinessItem } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminCreatePanel } from "@/components/admin/AdminCreatePanel";
import { BusinessItemForm } from "@/components/admin/BusinessItemForm";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { requireAdmin } from "@/lib/supabase/auth-server";

type Props = { searchParams: Promise<{ erro?: string; busca?: string; tipo?: string }> };

export default async function ItemsPage({ searchParams }: Props) {
  const { client } = await requireAdmin();
  const params = await searchParams;
  const search = params.busca?.trim() ?? "";
  const type = params.tipo ?? "";

  const [{ data: businesses, error: businessesError }, itemsResult] = await Promise.all([
    client.from("businesses").select("id,name").order("name"),
    (() => {
      let query = client.from("business_items").select("*,businesses(name)").order("display_order");
      if (search) query = query.ilike("title", `%${search}%`);
      if (["PRODUCT", "SERVICE", "PROMOTION", "MENU", "CATALOG"].includes(type)) {
        query = query.eq("type", type as "PRODUCT" | "SERVICE" | "PROMOTION" | "MENU" | "CATALOG");
      }
      return query;
    })()
  ]);
  if (businessesError || itemsResult.error) throw new Error("Não foi possível carregar os itens.");
  const items = itemsResult.data;

  return (
    <>
      <AdminNav />
      <main className="container admin-page">
        <div className="admin-title">
          <div>
            <span className="eyebrow">Catálogo</span>
            <h1>Itens das empresas</h1>
          </div>
          <span>{items.length} encontrados</span>
        </div>
        {params.erro ? (
          <p className="form-message error" role="alert">
            {params.erro}
          </p>
        ) : null}
        <form className="panel admin-filters">
          <label>
            Pesquisa
            <input name="busca" defaultValue={search} placeholder="Título do item" />
          </label>
          <label>
            Tipo
            <select name="tipo" defaultValue={type}>
              <option value="">Todos</option>
              <option value="PRODUCT">Produto</option>
              <option value="SERVICE">Serviço</option>
              <option value="PROMOTION">Promoção</option>
              <option value="MENU">Menu</option>
              <option value="CATALOG">Catálogo</option>
            </select>
          </label>
          <button className="button secondary" type="submit">
            Filtrar
          </button>
        </form>
        <AdminCreatePanel title="Novo item">
          <BusinessItemForm
            action={createBusinessItem}
            businesses={businesses}
            submitLabel="Criar item"
          />
        </AdminCreatePanel>
        <section className="admin-list" aria-label="Itens cadastrados">
          {items.map((item) => (
            <details className="panel" key={item.id}>
              <summary>
                <strong>{item.title}</strong>
                <span>
                  {item.businesses?.name} · {item.type}
                </span>
              </summary>
              <BusinessItemForm
                action={updateBusinessItem}
                businesses={businesses}
                values={item}
                submitLabel="Salvar alterações"
              />
              <form action={deleteBusinessItem} className="danger-zone">
                <input type="hidden" name="id" value={item.id} />
                <ConfirmSubmitButton message={`Excluir o item “${item.title}”?`}>
                  Excluir item
                </ConfirmSubmitButton>
              </form>
            </details>
          ))}
        </section>
      </main>
    </>
  );
}
