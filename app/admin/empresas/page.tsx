import { randomUUID } from "node:crypto";
import {
  deleteBusiness,
  deleteGalleryImage,
  saveBusiness,
  saveGalleryImage
} from "@/app/admin/content-actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminCreatePanel } from "@/components/admin/AdminCreatePanel";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { requireAdmin } from "@/lib/supabase/auth-server";

export default async function BusinessesAdminPage() {
  const { client } = await requireAdmin();
  const [businessesResult, plansResult, categoriesResult, relationsResult, mediaResult] =
    await Promise.all([
      client.from("businesses").select("*").order("name"),
      client.from("plans").select("id,name").order("priority", { ascending: false }),
      client.from("categories").select("id,name").order("display_order"),
      client.from("business_categories").select("business_id,category_id"),
      client.from("business_media").select("*").eq("kind", "gallery").order("display_order")
    ]);
  if (
    businessesResult.error ||
    plansResult.error ||
    categoriesResult.error ||
    relationsResult.error ||
    mediaResult.error
  )
    throw new Error("Não foi possível carregar as empresas.");
  const options = { plans: plansResult.data, categories: categoriesResult.data };
  return (
    <>
      <AdminNav />
      <main className="container admin-page">
        <div className="admin-title">
          <div>
            <span className="eyebrow">Diretório</span>
            <h1>Empresas</h1>
          </div>
          <span>{businessesResult.data.length} cadastradas</span>
        </div>
        <AdminCreatePanel title="Nova empresa">
          <BusinessForm
            business={{ id: randomUUID(), city: "Torres", status: "draft" }}
            {...options}
            categoryIds={[]}
          />
        </AdminCreatePanel>
        <section className="admin-list">
          {businessesResult.data.map((business) => (
            <details className="panel" key={business.id}>
              <summary>
                <strong>{business.name}</strong>
                <span>{business.status}</span>
              </summary>
              <BusinessForm
                business={business}
                {...options}
                categoryIds={relationsResult.data
                  .filter((row) => row.business_id === business.id)
                  .map((row) => row.category_id)}
              />
              <GalleryManager
                businessId={business.id}
                images={mediaResult.data.filter((image) => image.business_id === business.id)}
              />
              <form action={deleteBusiness} className="danger-zone">
                <input type="hidden" name="id" value={business.id} />
                <ConfirmSubmitButton message={`Excluir “${business.name}” e seus itens/mídias?`}>
                  Excluir empresa
                </ConfirmSubmitButton>
              </form>
            </details>
          ))}
        </section>
      </main>
    </>
  );
}

type BusinessValues = Record<string, unknown> & { id: string; city?: string; status?: string };

function BusinessForm({
  business,
  plans,
  categories,
  categoryIds
}: {
  business: BusinessValues;
  plans: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  categoryIds: string[];
}) {
  const value = (name: string) => (business[name] as string | number | null | undefined) ?? "";
  return (
    <form action={saveBusiness} className="admin-form">
      <input type="hidden" name="id" value={business.id} />
      <div className="admin-form-row">
        <label>
          Nome
          <input name="name" required defaultValue={value("name")} />
        </label>
        <label>
          Slug
          <input name="slug" defaultValue={value("slug")} />
        </label>
        <label>
          Plano
          <select name="plan_id" required defaultValue={value("plan_id")}>
            <option value="">Selecione</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Resumo
        <input name="short_description" defaultValue={value("short_description")} />
      </label>
      <label>
        Descrição
        <textarea name="description" rows={5} defaultValue={value("description")} />
      </label>
      <fieldset className="checkbox-grid">
        <legend>Categorias (a primeira será a principal)</legend>
        {categories.map((category) => (
          <label key={category.id}>
            <input
              type="checkbox"
              name="category_ids"
              value={category.id}
              defaultChecked={categoryIds.includes(category.id)}
            />
            {category.name}
          </label>
        ))}
      </fieldset>
      <div className="admin-form-row">
        <ImageUpload
          bucket="business-logos"
          entityId={business.id}
          name="logo_path"
          label="Logo"
          currentPath={value("logo_path") as string}
        />
        <ImageUpload
          bucket="business-hero-images"
          entityId={business.id}
          name="hero_image_path"
          label="Hero"
          currentPath={value("hero_image_path") as string}
        />
        <label>
          Alt do Hero
          <input name="hero_image_alt" defaultValue={value("hero_image_alt")} />
        </label>
      </div>
      <div className="admin-form-row">
        <label>
          Status
          <select name="status" defaultValue={value("status")}>
            <option value="draft">Rascunho</option>
            <option value="published">Publicada</option>
            <option value="suspended">Suspensa</option>
            <option value="archived">Arquivada</option>
          </select>
        </label>
        <label>
          Publicada em
          <input
            name="published_at"
            type="datetime-local"
            defaultValue={String(value("published_at")).slice(0, 16)}
          />
        </label>
        <label>
          CEP
          <input name="postal_code" defaultValue={value("postal_code")} />
        </label>
      </div>
      <div className="admin-form-row">
        <label>
          Endereço
          <input name="address_line" defaultValue={value("address_line")} />
        </label>
        <label>
          Bairro
          <input name="neighborhood" defaultValue={value("neighborhood")} />
        </label>
        <label>
          Cidade
          <input name="city" required defaultValue={value("city") || "Torres"} />
        </label>
      </div>
      <div className="admin-form-row">
        <label>
          Latitude
          <input name="latitude" type="number" step="any" defaultValue={value("latitude")} />
        </label>
        <label>
          Longitude
          <input name="longitude" type="number" step="any" defaultValue={value("longitude")} />
        </label>
      </div>
      <div className="admin-form-row">
        <label>
          WhatsApp
          <input name="whatsapp" defaultValue={value("whatsapp")} />
        </label>
        <label>
          Telefone
          <input name="phone" defaultValue={value("phone")} />
        </label>
        <label>
          E-mail
          <input name="email" type="email" defaultValue={value("email")} />
        </label>
      </div>
      <div className="admin-form-row">
        <label>
          Website
          <input name="website_url" type="url" defaultValue={value("website_url")} />
        </label>
        <label>
          Instagram
          <input name="instagram_url" type="url" defaultValue={value("instagram_url")} />
        </label>
      </div>
      <div className="admin-form-row">
        <label>
          Título SEO
          <input name="seo_title" defaultValue={value("seo_title")} />
        </label>
        <label>
          Descrição SEO
          <input name="seo_description" defaultValue={value("seo_description")} />
        </label>
      </div>
      <button className="button" type="submit">
        Salvar empresa
      </button>
    </form>
  );
}

function GalleryManager({
  businessId,
  images
}: {
  businessId: string;
  images: { id: string; storage_path: string; image_alt: string; display_order: number }[];
}) {
  const uploadId = randomUUID();
  return (
    <section className="gallery-admin">
      <h3>Galeria</h3>
      {images.map((image) => (
        <form action={deleteGalleryImage} className="gallery-admin-item" key={image.id}>
          <span>{image.image_alt}</span>
          <input type="hidden" name="id" value={image.id} />
          <ConfirmSubmitButton message="Remover esta imagem da galeria?">
            Remover
          </ConfirmSubmitButton>
        </form>
      ))}
      <form action={saveGalleryImage} className="admin-form">
        <input type="hidden" name="business_id" value={businessId} />
        <ImageUpload
          bucket="business-gallery"
          entityId={businessId}
          name="storage_path"
          label="Nova imagem da galeria"
        />
        <label>
          Texto alternativo
          <input name="image_alt" required />
        </label>
        <label>
          Ordem
          <input name="display_order" type="number" min="0" defaultValue={images.length} />
        </label>
        <input type="hidden" value={uploadId} readOnly />
        <button className="button secondary" type="submit">
          Adicionar à galeria
        </button>
      </form>
    </section>
  );
}
