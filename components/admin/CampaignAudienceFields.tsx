"use client";

import { useState } from "react";

type CampaignLocation = "HOME" | "SITE" | "CATEGORIES" | "TOURIST_ATTRACTIONS";

export function CampaignAudienceFields({
  displayLocations,
  businesses,
  businessId,
  destinationType,
  destinationUrl,
  categories,
  categoryIds,
  status
}: {
  displayLocations: CampaignLocation[];
  businesses: { id: string; name: string; slug: string }[];
  businessId: string;
  destinationType: "INTERNAL" | "EXTERNAL";
  destinationUrl: string;
  categories: { id: string; name: string }[];
  categoryIds: string[];
  status: string;
}) {
  const [selectedLocations, setSelectedLocations] = useState<CampaignLocation[]>(displayLocations);
  const [selectedDestinationType, setSelectedDestinationType] = useState(destinationType);
  const [selectedBusinessId, setSelectedBusinessId] = useState(businessId);
  const [externalDestinationUrl, setExternalDestinationUrl] = useState(destinationUrl);
  const selectedBusiness = businesses.find((business) => business.id === selectedBusinessId);
  const internalDestinationUrl = selectedBusiness ? `/empresas/${selectedBusiness.slug}` : "";

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
          Destino do banner
          <select
            name="destination_type"
            value={selectedDestinationType}
            onChange={(event) =>
              setSelectedDestinationType(event.target.value as "INTERNAL" | "EXTERNAL")
            }
          >
            <option value="INTERNAL">Empresa cadastrada</option>
            <option value="EXTERNAL">Link externo</option>
          </select>
        </label>
        <label>
          {selectedDestinationType === "INTERNAL" ? "Empresa de destino" : "Empresa anunciante"}
          <select
            name="business_id"
            required
            value={selectedBusinessId}
            onChange={(event) => setSelectedBusinessId(event.target.value)}
          >
            <option value="">Selecione</option>
            {businesses.map((business) => (
              <option key={business.id} value={business.id}>
                {business.name}
              </option>
            ))}
          </select>
        </label>
        {selectedDestinationType === "EXTERNAL" ? (
          <label>
            <span>
              Link de destino <strong className="required-mark">*</strong>
            </span>
            <input
              name="destination_url"
              type="url"
              required
              value={externalDestinationUrl}
              onChange={(event) => setExternalDestinationUrl(event.target.value)}
              placeholder="https://exemplo.com.br"
            />
            {/^https?:\/\//i.test(externalDestinationUrl) ? (
              <a
                className="field-hint destination-preview-link"
                href={externalDestinationUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir destino em nova aba
              </a>
            ) : null}
          </label>
        ) : (
          <label>
            Link de destino
            <input
              value={internalDestinationUrl}
              readOnly
              aria-describedby={`destination-help-${businessId || "new"}`}
              placeholder="Selecione uma empresa"
            />
            <span className="field-hint" id={`destination-help-${businessId || "new"}`}>
              Gerado automaticamente. Para mudar o link, selecione outra empresa.
            </span>
            {internalDestinationUrl ? (
              <a
                className="field-hint destination-preview-link"
                href={internalDestinationUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir destino em nova aba
              </a>
            ) : null}
          </label>
        )}
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
