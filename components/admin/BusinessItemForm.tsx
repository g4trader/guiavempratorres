import type { BusinessItemType } from "@/lib/domain";

type ItemValues = {
  id?: string;
  business_id?: string;
  type?: BusinessItemType;
  title?: string;
  description?: string | null;
  image?: string | null;
  price?: number | null;
  cta_label?: string | null;
  cta_url?: string | null;
  display_order?: number;
  active?: boolean;
};

const itemTypes: { value: BusinessItemType; label: string }[] = [
  { value: "PRODUCT", label: "Produto" },
  { value: "SERVICE", label: "Serviço" },
  { value: "PROMOTION", label: "Promoção" },
  { value: "MENU", label: "Menu" },
  { value: "CATALOG", label: "Catálogo" }
];

export function BusinessItemForm({
  action,
  businesses,
  values = {},
  submitLabel
}: {
  action: (formData: FormData) => void | Promise<void>;
  businesses: { id: string; name: string }[];
  values?: ItemValues;
  submitLabel: string;
}) {
  return (
    <form action={action} className="admin-form">
      {values.id ? <input type="hidden" name="id" value={values.id} /> : null}
      <div className="admin-form-row">
        <label>
          Empresa
          <select name="business_id" required defaultValue={values.business_id ?? ""}>
            <option value="" disabled>
              Selecione
            </option>
            {businesses.map((business) => (
              <option key={business.id} value={business.id}>
                {business.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tipo
          <select name="type" required defaultValue={values.type ?? "PRODUCT"}>
            {itemTypes.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Título
        <input name="title" required minLength={2} maxLength={140} defaultValue={values.title} />
      </label>
      <label>
        Descrição
        <textarea name="description" rows={3} defaultValue={values.description ?? ""} />
      </label>
      <div className="admin-form-row">
        <label>
          Imagem (caminho ou URL)
          <input name="image" defaultValue={values.image ?? ""} />
        </label>
        <label>
          Preço
          <input name="price" type="number" min="0" step="0.01" defaultValue={values.price ?? ""} />
        </label>
        <label>
          Ordem
          <input
            name="display_order"
            type="number"
            min="0"
            required
            defaultValue={values.display_order ?? 0}
          />
        </label>
      </div>
      <div className="admin-form-row">
        <label>
          Texto do botão
          <input name="cta_label" defaultValue={values.cta_label ?? ""} />
        </label>
        <label>
          URL do botão
          <input name="cta_url" type="url" defaultValue={values.cta_url ?? ""} />
        </label>
      </div>
      <label className="checkbox-line">
        <input name="active" type="checkbox" defaultChecked={values.active ?? true} />
        Item ativo
      </label>
      <button className="button" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
