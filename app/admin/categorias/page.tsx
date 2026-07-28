import { randomUUID } from "node:crypto";
import { deleteCategory, saveCategory } from "@/app/admin/content-actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminCreatePanel } from "@/components/admin/AdminCreatePanel";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { requireAdmin } from "@/lib/supabase/auth-server";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_path: string | null;
  image_alt: string | null;
  display_order: number;
  is_active: boolean;
  seo_title: string | null;
  seo_description: string | null;
};

export default async function CategoriesAdminPage() {
  const { client } = await requireAdmin();
  const { data, error } = await client.from("categories").select("*").order("display_order");
  if (error) throw new Error("Não foi possível carregar as categorias.");
  return (
    <>
      <AdminNav />
      <main className="container admin-page">
        <div className="admin-title">
          <div>
            <span className="eyebrow">Conteúdo</span>
            <h1>Categorias</h1>
          </div>
          <span>{data.length} cadastradas</span>
        </div>
        <AdminCreatePanel title="Nova categoria">
          <CategoryForm category={{ id: randomUUID() }} />
        </AdminCreatePanel>
        <section className="admin-list">
          {data.map((category) => (
            <details className="panel" key={category.id}>
              <summary>
                <strong>{category.name}</strong>
                <span>{category.is_active ? "Ativa" : "Inativa"}</span>
              </summary>
              <CategoryForm category={category} />
              <form action={deleteCategory} className="danger-zone">
                <input type="hidden" name="id" value={category.id} />
                <ConfirmSubmitButton message={`Excluir “${category.name}”?`}>
                  Excluir categoria
                </ConfirmSubmitButton>
              </form>
            </details>
          ))}
        </section>
      </main>
    </>
  );
}

function CategoryForm({ category }: { category: Partial<Category> & { id: string } }) {
  return (
    <form action={saveCategory} className="admin-form">
      <input type="hidden" name="id" value={category.id} />
      <div className="admin-form-row">
        <label>
          Nome
          <input name="name" required defaultValue={category.name} />
        </label>
        <label>
          Slug
          <input name="slug" defaultValue={category.slug} />
        </label>
        <label>
          Ordem
          <input
            name="display_order"
            type="number"
            min="0"
            defaultValue={category.display_order ?? 0}
          />
        </label>
      </div>
      <label>
        Descrição
        <textarea name="description" rows={3} defaultValue={category.description ?? ""} />
      </label>
      <ImageUpload
        bucket="category-images"
        entityId={category.id}
        name="image_path"
        label="Imagem da categoria"
        currentPath={category.image_path}
      />
      <label>
        Texto alternativo
        <input name="image_alt" defaultValue={category.image_alt ?? ""} />
      </label>
      <div className="admin-form-row">
        <label>
          Título SEO
          <input name="seo_title" defaultValue={category.seo_title ?? ""} />
        </label>
        <label>
          Descrição SEO
          <input name="seo_description" defaultValue={category.seo_description ?? ""} />
        </label>
      </div>
      <label className="checkbox-line">
        <input name="is_active" type="checkbox" defaultChecked={category.is_active ?? true} />
        Categoria ativa
      </label>
      <button className="button" type="submit">
        Salvar categoria
      </button>
    </form>
  );
}
