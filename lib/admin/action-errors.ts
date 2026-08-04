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
  if (technical.includes("display_locations"))
    return "Selecione onde o banner deve ser exibido. “Em todo o site” não pode ser combinado com outras opções.";
  if (technical.includes("destination_type"))
    return "Selecione se o destino do banner é uma empresa cadastrada ou um link externo.";
  if (technical.includes("destination_url"))
    return "O link de destino do banner não corresponde ao tipo selecionado.";
  if (technical.includes("internal_path"))
    return "A empresa vinculada ao banner possui um slug inválido para o link interno.";
  if (technical.includes("ad_campaigns") && technical.includes("display_order"))
    return "A ordem do banner deve ser um número inteiro igual ou maior que zero.";
  if (technical.includes("ad_campaigns") && technical.includes("check"))
    return "A data final do banner deve ser posterior à data inicial.";
  if (technical.includes("ad_creatives") && technical.includes("image_alt"))
    return "Informe o texto alternativo da imagem do banner.";
  if (technical.includes("business_items") && technical.includes("price"))
    return "O preço do item deve ser igual ou maior que zero.";
  if (technical.includes("business_items") && technical.includes("display_order"))
    return "A ordem do item deve ser um número inteiro igual ou maior que zero.";
  if (technical.includes("cta_label") || technical.includes("cta_url"))
    return "O texto e o link do CTA devem ser informados juntos.";
  if (technical.includes("tourist_attractions") && technical.includes("card_image"))
    return "A imagem do card e seu texto alternativo devem ser informados juntos.";
  if (technical.includes("tourist_attractions") && technical.includes("google_maps"))
    return "O link do Google Maps do ponto turístico não está em um formato aceito.";
  if (technical.includes("hero_image"))
    return "Informe o texto alternativo da imagem do Hero.";
  if (technical.includes("categories") && technical.includes("image"))
    return "Ao enviar uma imagem de categoria, informe também seu texto alternativo.";
  if (technical.includes("business_media") && technical.includes("display_order"))
    return "A ordem da imagem da galeria deve ser um número inteiro igual ou maior que zero.";
  if (technical.includes("business_media") && technical.includes("image_alt"))
    return "Informe o texto alternativo da imagem da galeria.";
  if (technical.includes("plans") && technical.includes("max_images"))
    return "O máximo de imagens do plano deve ser igual ou maior que zero.";
  if (technical.includes("plans") && technical.includes("max_items"))
    return "O máximo de itens do plano deve ser igual ou maior que zero.";
  if (technical.includes("latitude") || technical.includes("longitude"))
    return "Latitude e longitude devem ser informadas juntas e dentro dos limites válidos.";
  if (error.code === "23514") {
    const constraint = technical.match(/constraint ["']?([a-z0-9_]+)/)?.[1];
    return constraint
      ? `O banco recusou uma regra específica do cadastro (${constraint}). Revise esse campo ou informe este código ao suporte.`
      : "O banco recusou um dos formatos informados. Revise números, datas, links e campos de imagem.";
  }

  return fallback;
}
