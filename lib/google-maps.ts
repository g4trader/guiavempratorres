const ALLOWED_HOSTS = new Set([
  "google.com",
  "www.google.com",
  "maps.google.com",
  "maps.app.goo.gl",
  "goo.gl"
]);

export type BusinessLocation = {
  googleMapsUrl: string;
  addressLine: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
};

export function isAllowedGoogleMapsUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && ALLOWED_HOSTS.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function isPersistableGoogleMapsUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    const host = url.hostname.toLowerCase();
    return (
      ((host === "google.com" || host === "www.google.com") &&
        url.pathname.startsWith("/maps")) ||
      host === "maps.google.com" ||
      host === "maps.app.goo.gl" ||
      (host === "goo.gl" && url.pathname.startsWith("/maps"))
    );
  } catch {
    return false;
  }
}

export function coordinatesFromGoogleMapsUrl(value: string) {
  const decoded = decodeURIComponent(value);
  const patterns = [
    /@(-?\d{1,2}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)/,
    /!3d(-?\d{1,2}(?:\.\d+)?).*?!4d(-?\d{1,3}(?:\.\d+)?)/,
    /[?&](?:q|query|ll)=(-?\d{1,2}(?:\.\d+)?),\s*(-?\d{1,3}(?:\.\d+)?)/
  ];
  for (const pattern of patterns) {
    const match = decoded.match(pattern);
    if (!match) continue;
    const latitude = Number(match[1]);
    const longitude = Number(match[2]);
    if (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    )
      return { latitude, longitude };
  }
  return null;
}

async function expandGoogleMapsUrl(value: string) {
  let current = value;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await fetch(current, {
      method: "HEAD",
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(6_000)
    });
    const location = response.headers.get("location");
    if (!location) return current;
    const next = new URL(location, current).toString();
    if (!isAllowedGoogleMapsUrl(next))
      throw new Error("O link redirecionou para um endereço que não pertence ao Google Maps.");
    current = next;
  }
  return current;
}

type GeocodeComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

function component(components: GeocodeComponent[], types: string[], short = false) {
  const found = components.find((item) => types.some((type) => item.types.includes(type)));
  return found ? (short ? found.short_name : found.long_name) : "";
}

export async function resolveGoogleMapsLocation(value: string): Promise<BusinessLocation> {
  if (!isAllowedGoogleMapsUrl(value))
    throw new Error("Informe um link HTTPS válido do Google Maps.");

  const expandedUrl = await expandGoogleMapsUrl(value);
  if (!isPersistableGoogleMapsUrl(expandedUrl))
    throw new Error(
      "O Google Maps retornou um link em formato incompatível. Gere um novo link em Compartilhar → Copiar link."
    );
  const coordinates = coordinatesFromGoogleMapsUrl(expandedUrl);
  if (!coordinates)
    throw new Error(
      "Não foi possível identificar as coordenadas nesse link. No Google Maps, use Compartilhar → Copiar link."
    );

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey)
    throw new Error(
      "A integração do Google Maps ainda não está configurada. Solicite ao administrador a chave da Geocoding API."
    );

  const endpoint = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  endpoint.searchParams.set("latlng", `${coordinates.latitude},${coordinates.longitude}`);
  endpoint.searchParams.set("language", "pt-BR");
  endpoint.searchParams.set("region", "br");
  endpoint.searchParams.set("key", apiKey);

  const response = await fetch(endpoint, { cache: "no-store", signal: AbortSignal.timeout(8_000) });
  if (!response.ok) throw new Error("O Google Maps não respondeu. Tente novamente em instantes.");
  const payload = (await response.json()) as {
    status: string;
    error_message?: string;
    results?: { formatted_address: string; address_components: GeocodeComponent[] }[];
  };
  if (payload.status !== "OK" || !payload.results?.length) {
    if (payload.status === "REQUEST_DENIED")
      throw new Error("A chave do Google Maps não está autorizada para consultar endereços.");
    throw new Error("O Google Maps não encontrou um endereço para esse local.");
  }

  const result = payload.results[0];
  const components = result.address_components;
  const route = component(components, ["route"]);
  const number = component(components, ["street_number"]);
  const addressLine = [route, number].filter(Boolean).join(", ") || result.formatted_address;

  return {
    googleMapsUrl: expandedUrl,
    addressLine,
    neighborhood: component(components, ["sublocality_level_1", "sublocality", "neighborhood"]),
    city: component(components, ["administrative_area_level_2", "locality", "postal_town"]),
    state: component(components, ["administrative_area_level_1"], true),
    postalCode: component(components, ["postal_code"]),
    latitude: coordinates.latitude,
    longitude: coordinates.longitude
  };
}
