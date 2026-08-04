type DatabaseError = {
  code?: string;
  message?: string;
  details?: string;
};

export function explainDatabaseError(
  error: DatabaseError,
  fallback: string
): string {
  const technical = `${error.message ?? ""} ${error.details ?? ""}`.toLowerCase();

  if (error.code === "23505") {
    if (technical.includes("slug")) return "Já existe um cadastro usando este slug.";
    return "Já existe outro cadastro com uma informação que precisa ser única.";
  }
  if (error.code === "23503")
    return "O cadastro referencia um plano, categoria ou empresa que não existe mais.";
  if (error.code === "42501")
    return "Seu usuário não possui permissão para realizar esta alteração.";
  if (technical.includes("featured_home_period"))
    return "No destaque da Home, a data final deve ser posterior à data inicial.";
  if (technical.includes("google_maps_url"))
    return "O link do Google Maps não está em um formato aceito. Importe novamente a localização usando “Compartilhar” → “Copiar link”.";
  if (technical.includes("businesses_slug_check"))
    return "O slug deve conter apenas letras minúsculas, números e hífens.";
  if (technical.includes("businesses_name_check"))
    return "O nome da empresa deve ter entre 2 e 140 caracteres.";
  if (technical.includes("businesses_state_check"))
    return "A UF deve conter exatamente duas letras maiúsculas, como RS.";
  if (technical.includes("published_at"))
    return "Empresas publicadas precisam ter uma data de publicação válida.";
  if (technical.includes("hero_image"))
    return "Informe o texto alternativo da imagem do Hero.";
  if (technical.includes("latitude") || technical.includes("longitude"))
    return "Latitude e longitude devem ser informadas juntas e dentro dos limites válidos.";
  if (error.code === "23514")
    return "Uma regra do cadastro não foi atendida. Revise os campos destacados e seus formatos.";

  return fallback;
}
