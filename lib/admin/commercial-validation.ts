export function validateCommercialHighlight({
  enabled,
  order,
  startsAt,
  endsAt
}: {
  enabled: boolean;
  order: string;
  startsAt: string;
  endsAt: string;
}) {
  const orderError =
    enabled && !order.trim()
      ? "Informe a ordem de exibição do destaque."
      : enabled && (!Number.isInteger(Number(order)) || Number(order) < 0)
        ? "A ordem deve ser um número inteiro igual ou maior que zero."
        : "";
  const periodError =
    enabled && startsAt && endsAt && new Date(endsAt).getTime() <= new Date(startsAt).getTime()
      ? "A data final deve ser posterior à data inicial."
      : "";

  return { orderError, periodError };
}
