"use client";

import { useState } from "react";
import type { BusinessLocation } from "@/lib/google-maps";

type InitialLocation = Partial<BusinessLocation>;

export function BusinessLocationFields({ initial }: { initial: InitialLocation }) {
  const [url, setUrl] = useState(initial.googleMapsUrl ?? "");
  const [location, setLocation] = useState<InitialLocation>(initial);
  const [verifiedUrl, setVerifiedUrl] = useState(initial.googleMapsUrl ?? "");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function importLocation() {
    setLoading(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/google-maps-location", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url })
      });
      const payload = (await response.json()) as {
        location?: BusinessLocation;
        error?: string;
      };
      if (!response.ok || !payload.location)
        throw new Error(payload.error || "Não foi possível importar a localização.");
      setLocation(payload.location);
      setUrl(payload.location.googleMapsUrl);
      setVerifiedUrl(payload.location.googleMapsUrl);
      setStatus("Localização importada com sucesso.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Não foi possível importar a localização."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <fieldset className="business-location-fields">
      <legend>Localização</legend>
      <div className="location-import-row">
        <label>
          Link do Google Maps
          <input
            name="google_maps_url"
            type="url"
            value={url}
            placeholder="https://maps.app.goo.gl/..."
            onChange={(event) => {
              setUrl(event.target.value);
              setStatus(
                event.target.value === verifiedUrl
                  ? ""
                  : "Clique em “Preencher localização” para validar o novo link."
              );
            }}
          />
        </label>
        <button
          className="button secondary"
          type="button"
          disabled={loading || !url.trim()}
          onClick={importLocation}
        >
          {loading ? "Importando…" : "Preencher localização"}
        </button>
      </div>
      <p className="field-help">
        No Google Maps, abra o local e use “Compartilhar” → “Copiar link”.
      </p>
      {status ? (
        <p className={location.googleMapsUrl === url ? "form-success" : "form-error"} role="status">
          {status}
        </p>
      ) : null}
      {location.latitude !== undefined && location.longitude !== undefined ? (
        <div className="location-summary">
          <strong>Localização preenchida</strong>
          <span>{location.addressLine || "Endereço não identificado"}</span>
          <span>
            {[location.neighborhood, location.city, location.state, location.postalCode]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </div>
      ) : null}
      <input type="hidden" name="address_line" value={location.addressLine ?? ""} />
      <input type="hidden" name="neighborhood" value={location.neighborhood ?? ""} />
      <input type="hidden" name="city" value={location.city ?? ""} />
      <input type="hidden" name="state" value={location.state ?? ""} />
      <input type="hidden" name="postal_code" value={location.postalCode ?? ""} />
      <input type="hidden" name="latitude" value={location.latitude ?? ""} />
      <input type="hidden" name="longitude" value={location.longitude ?? ""} />
      <input type="hidden" name="location_verified_url" value={verifiedUrl} />
    </fieldset>
  );
}
