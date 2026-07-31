"use client";

import { useState } from "react";

type CampaignLocation = "HOME" | "SITE" | "CATEGORIES" | "TOURIST_ATTRACTIONS";

export function CampaignAudienceFields({
  displayLocations,
  businesses,
  businessId,
  categories,
  categoryIds,
  status
}: {
  displayLocations: CampaignLocation[];
  businesses: { id: string; name: string }[];
  businessId: string;
  categories: { id: string; name: string }[];
  categoryIds: string[];
  status: string;
}) {
  const [selectedLocations, setSelectedLocations] = useState<CampaignLocation[]>(displayLocations);

  function toggleLocation(location: CampaignLocation, checked: boolean) {
    if (location === "SITE") {
      setSelectedLocations(checked ? ["SITE"] : []);
      return;
    }
    setSelectedLocations((current) => {
      const withoutSite = current.filter((item) => item !== "SITE");
      return checked
        ? [...withoutSite.filter((item) => item !== location), location]
        : withoutSite.filter((item) => item !== location);
    });
  }

  return (
    <>
      <fieldset className="checkbox-grid campaign-location-grid">
        <legend>Exibição do Hero</legend>
        {(
          [
            ["SITE", "Em todo o site"],
            ["HOME", "Home"],
            ["TOURIST_ATTRACTIONS", "Pontos turísticos"],
            ["CATEGORIES", "Categorias específicas"]
          ] as const
        ).map(([value, label]) => (
          <label key={value}>
            <input
              type="checkbox"
              name="display_locations"
              value={value}
              checked={selectedLocations.includes(value)}
              onChange={(event) => toggleLocation(value, event.target.checked)}
            />
            {label}
          </label>
        ))}
        <p className="field-hint campaign-location-hint">
          “Em todo o site” substitui as demais opções. Para exibições específicas, marque uma ou
          mais seções.
        </p>
      </fieldset>
      <div className="admin-form-row">
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
      <fieldset
        className="checkbox-grid"
        hidden={!selectedLocations.includes("CATEGORIES") || selectedLocations.includes("SITE")}
      >
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
