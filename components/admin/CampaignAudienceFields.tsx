"use client";

import { useState } from "react";

type CampaignAudience = "HOME" | "SITE" | "CATEGORIES";

export function CampaignAudienceFields({
  audience,
  businesses,
  businessId,
  categories,
  categoryIds,
  status
}: {
  audience: CampaignAudience;
  businesses: { id: string; name: string }[];
  businessId: string;
  categories: { id: string; name: string }[];
  categoryIds: string[];
  status: string;
}) {
  const [selectedAudience, setSelectedAudience] = useState<CampaignAudience>(audience);

  return (
    <>
      <div className="admin-form-row">
        <label>
          Exibição do Hero
          <select
            name="audience"
            required
            value={selectedAudience}
            onChange={(event) => setSelectedAudience(event.target.value as CampaignAudience)}
          >
            <option value="HOME">Somente na Home</option>
            <option value="SITE">Em todo o site</option>
            <option value="CATEGORIES">Categorias específicas</option>
          </select>
        </label>
        <label>
          Empresa
          <select name="business_id" required defaultValue={businessId}>
            <option value="">Selecione</option>
            {businesses.map((business) => (
              <option key={business.id} value={business.id}>
                {business.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select name="status" defaultValue={status}>
            <option value="draft">Rascunho</option>
            <option value="active">Ativa</option>
            <option value="paused">Pausada</option>
            <option value="archived">Arquivada</option>
          </select>
        </label>
      </div>
      <fieldset className="checkbox-grid" hidden={selectedAudience !== "CATEGORIES"}>
        <legend>Categorias específicas</legend>
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
    </>
  );
}
