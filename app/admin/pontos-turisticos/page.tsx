import { randomUUID } from "node:crypto";
import { deleteTouristAttraction, saveTouristAttraction } from "./actions";
import { AdminCreatePanel } from "@/components/admin/AdminCreatePanel";
import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminStatusIcon } from "@/components/admin/AdminStatusIcon";
import { BusinessLocationFields } from "@/components/admin/BusinessLocationFields";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { TouristAttractionBlockEditor } from "@/components/admin/TouristAttractionBlockEditor";
import type { TouristAttractionBlock } from "@/lib/domain";
import { requireAdmin } from "@/lib/supabase/auth-server";

type Attraction = Record<string, unknown> & { id: string; title?: string };
type Props = { searchParams: Promise<{ erro?: string; mensagem?: string }> };

export default async function TouristAttractionsAdminPage({ searchParams }: Props) {
  const { client } = await requireAdmin();
  const { erro, mensagem } = await searchParams;
  const { data, error } = await client.from("tourist_attractions").select("*").order("title");
  if (error) throw new Error("Não foi possível carregar os pontos turísticos.");
  return (
    <>
      <AdminNav />
      <main className="container admin-page">
        <div className="admin-title">
          <div>
            <span className="eyebrow">Conteúdo</span>
            <h1>Pontos turísticos</h1>
          </div>
          <span>{data.length} cadastrados</span>
        </div>
        <AdminFeedback error={erro} message={mensagem} />
        <AdminCreatePanel title="Novo ponto turístico">
          <AttractionForm attraction={{ id: randomUUID(), status: "draft" }} />
        </AdminCreatePanel>
        <section className="admin-list">
          {data.map((attraction) => (
            <details className="panel" key={attraction.id}>
              <summary>
                <strong>{attraction.title}</strong>
                <AdminStatusIcon status={attraction.status} />
              </summary>
              <AttractionForm attraction={attraction} />
              <form action={deleteTouristAttraction} className="danger-zone">
                <input type="hidden" name="id" value={attraction.id} />
                <ConfirmSubmitButton message={`Excluir “${attraction.title}”?`}>
                  Excluir ponto turístico
                </ConfirmSubmitButton>
              </form>
            </details>
          ))}
        </section>
      </main>
    </>
  );
}

function AttractionForm({ attraction }: { attraction: Attraction }) {
  const value = (name: string) => (attraction[name] as string | number | null | undefined) ?? "";
  return (
    <form action={saveTouristAttraction} className="admin-form">
      <input type="hidden" name="id" value={attraction.id} />
      <div className="admin-form-row">
        <label>
          Título <strong className="required-mark">*</strong>
          <input name="title" required defaultValue={value("title")} />
        </label>
        <label>
          Slug
          <input name="slug" defaultValue={value("slug")} />
        </label>
        <label>
          Status
          <select name="status" defaultValue={value("status")}>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
            <option value="suspended">Suspenso</option>
            <option value="archived">Arquivado</option>
          </select>
        </label>
      </div>
      <RichTextEditor
        name="excerpt"
        label="Resumo para o card"
        defaultValue={value("excerpt") as string}
      />
      <ImageUpload
        bucket="tourist-attraction-images"
        entityId={attraction.id}
        name="card_image_path"
        label="Imagem do card"
        currentPath={value("card_image_path") as string}
      />
      <label>
        Texto alternativo da imagem
        <input name="card_image_alt" defaultValue={value("card_image_alt")} />
      </label>
      <TouristAttractionBlockEditor
        entityId={attraction.id}
        initialBlocks={(attraction.content_blocks as TouristAttractionBlock[] | undefined) ?? []}
      />
      <BusinessLocationFields
        initial={{
          googleMapsUrl: value("google_maps_url") as string,
          addressLine: value("address_line") as string,
          neighborhood: value("neighborhood") as string,
          city: value("city") as string,
          state: value("state") as string,
          postalCode: value("postal_code") as string,
          latitude: value("latitude") as number | undefined,
          longitude: value("longitude") as number | undefined
        }}
      />
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
        Salvar ponto turístico
      </button>
    </form>
  );
}
