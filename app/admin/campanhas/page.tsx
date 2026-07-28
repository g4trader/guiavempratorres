import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { deleteCampaign, saveCampaign } from "@/app/admin/content-actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminCreatePanel } from "@/components/admin/AdminCreatePanel";
import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { AdminStatusIcon } from "@/components/admin/AdminStatusIcon";
import { CampaignAudienceFields } from "@/components/admin/CampaignAudienceFields";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { canManageCampaigns } from "@/lib/auth/authorization";
import { requireAdmin } from "@/lib/supabase/auth-server";

type PageProps = { searchParams: Promise<{ erro?: string; mensagem?: string }> };

export default async function CampaignsAdminPage({ searchParams }: PageProps) {
  const { client, role } = await requireAdmin();
  const { erro, mensagem } = await searchParams;
  if (!canManageCampaigns(role)) redirect("/admin?erro=permissao");
  const [
    campaignsResult,
    businessesResult,
    placementsResult,
    creativesResult,
    categoriesResult,
    campaignCategoriesResult
  ] = await Promise.all([
      client.from("ad_campaigns").select("*").order("starts_at", { ascending: false }),
      client.from("businesses").select("id,name,slug").order("name"),
      client.from("ad_placements").select("id,name,code").order("name"),
      client.from("ad_creatives").select("*"),
      client.from("categories").select("id,name").eq("is_active", true).order("name"),
      client.from("ad_campaign_categories").select("campaign_id,category_id")
    ]);
  if (
    campaignsResult.error ||
    businessesResult.error ||
    placementsResult.error ||
    creativesResult.error ||
    categoriesResult.error ||
    campaignCategoriesResult.error
  )
    throw new Error("Não foi possível carregar as campanhas.");
  const options = {
    businesses: businessesResult.data,
    placements: placementsResult.data,
    categories: categoriesResult.data
  };
  return (
    <>
      <AdminNav />
      <main className="container admin-page">
        <div className="admin-title">
          <div>
            <span className="eyebrow">Publicidade</span>
            <h1>Banners e Heroes</h1>
          </div>
          <span>{campaignsResult.data.length} campanhas</span>
        </div>
        <AdminFeedback error={erro} message={mensagem} />
        <AdminCreatePanel title="Nova campanha">
          <CampaignForm
            campaign={{
              id: randomUUID(),
              status: "draft",
              starts_at: "",
              ends_at: "",
              display_order: 0,
              priority: 0
            }}
            creative={null}
            categoryIds={[]}
            {...options}
          />
        </AdminCreatePanel>
        <section className="admin-list">
          {campaignsResult.data.map((campaign) => (
            <details className="panel" key={campaign.id}>
              <summary>
                <strong>
                  {
                    businessesResult.data.find((business) => business.id === campaign.business_id)
                      ?.name
                  }
                </strong>
                <AdminStatusIcon status={campaign.status} />
              </summary>
              <CampaignForm
                campaign={campaign}
                creative={
                  creativesResult.data.find((creative) => creative.campaign_id === campaign.id) ??
                  null
                }
                categoryIds={campaignCategoriesResult.data
                  .filter((relation) => relation.campaign_id === campaign.id)
                  .map((relation) => relation.category_id)}
                {...options}
              />
              <form action={deleteCampaign} className="danger-zone">
                <input type="hidden" name="id" value={campaign.id} />
                <ConfirmSubmitButton message="Excluir esta campanha e suas imagens?">
                  Excluir campanha
                </ConfirmSubmitButton>
              </form>
            </details>
          ))}
        </section>
      </main>
    </>
  );
}

type Campaign = {
  id: string;
  business_id?: string;
  placement_id?: string;
  status: string;
  starts_at: string;
  ends_at: string;
  display_order: number;
  priority: number;
  internal_path?: string;
  audience?: "HOME" | "SITE" | "CATEGORIES";
};

type Creative = {
  desktop_image_path: string;
  mobile_image_path: string | null;
  image_alt: string;
  title: string | null;
  description: string | null;
};

function CampaignForm({
  campaign,
  creative,
  businesses,
  placements,
  categories,
  categoryIds
}: {
  campaign: Campaign;
  creative: Creative | null;
  businesses: { id: string; name: string; slug: string }[];
  placements: { id: string; name: string; code: string }[];
  categories: { id: string; name: string }[];
  categoryIds: string[];
}) {
  const heroPlacement = placements.find((placement) => placement.code === "HOME_HERO") ?? placements[0];

  return (
    <form action={saveCampaign} className="admin-form">
      <input type="hidden" name="id" value={campaign.id} />
      <input
        type="hidden"
        name="placement_id"
        value={campaign.placement_id ?? heroPlacement?.id ?? ""}
      />
      <CampaignAudienceFields
        audience={campaign.audience ?? "HOME"}
        businesses={businesses}
        businessId={campaign.business_id ?? ""}
        categories={categories}
        categoryIds={categoryIds}
        status={campaign.status}
      />
      <div className="admin-form-row">
        <label>
          Início
          <input
            name="starts_at"
            type="datetime-local"
            required
            defaultValue={campaign.starts_at.slice(0, 16)}
          />
        </label>
        <label>
          Fim
          <input
            name="ends_at"
            type="datetime-local"
            required
            defaultValue={campaign.ends_at.slice(0, 16)}
          />
        </label>
        <label>
          Ordem
          <input name="display_order" type="number" min="0" defaultValue={campaign.display_order} />
        </label>
      </div>
      <div className="admin-form-row">
        <label>
          Prioridade
          <input name="priority" type="number" defaultValue={campaign.priority} />
        </label>
        <label>
          Caminho interno
          <input
            name="internal_path"
            required
            pattern="/empresas/[a-z0-9-]+"
            defaultValue={campaign.internal_path ?? ""}
            placeholder="/empresas/nome"
          />
        </label>
      </div>
      <div className="admin-form-row">
        <ImageUpload
          bucket="ad-creatives"
          entityId={campaign.id}
          name="desktop_image_path"
          label="Imagem desktop"
          currentPath={creative?.desktop_image_path}
        />
        <ImageUpload
          bucket="ad-creatives"
          entityId={campaign.id}
          name="mobile_image_path"
          label="Imagem mobile"
          currentPath={creative?.mobile_image_path}
        />
      </div>
      <label>
        Texto alternativo
        <input name="image_alt" required defaultValue={creative?.image_alt ?? ""} />
      </label>
      <label>
        Título
        <input name="title" defaultValue={creative?.title ?? ""} />
      </label>
      <label>
        Descrição
        <textarea name="description" rows={3} defaultValue={creative?.description ?? ""} />
      </label>
      <button className="button" type="submit">
        Salvar campanha
      </button>
    </form>
  );
}
