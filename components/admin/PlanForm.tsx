type PlanValues = {
  id?: string;
  name?: string;
  slug?: string;
  max_images?: number;
  max_items?: number;
  priority?: number;
  featured_home?: boolean;
  featured_category?: boolean;
  hero_allowed?: boolean;
  whatsapp_enabled?: boolean;
  website_enabled?: boolean;
  instagram_enabled?: boolean;
  gallery_enabled?: boolean;
  video_enabled?: boolean;
  premium_badge?: boolean;
};

const flags = [
  ["featured_home", "Destaque na home"],
  ["featured_category", "Destaque na categoria"],
  ["hero_allowed", "Pode usar Hero"],
  ["whatsapp_enabled", "WhatsApp"],
  ["website_enabled", "Site"],
  ["instagram_enabled", "Instagram"],
  ["gallery_enabled", "Galeria"],
  ["video_enabled", "Vídeo"],
  ["premium_badge", "Selo premium"]
] as const;

export function PlanForm({
  action,
  values = {},
  submitLabel
}: {
  action: (formData: FormData) => void | Promise<void>;
  values?: PlanValues;
  submitLabel: string;
}) {
  return (
    <form action={action} className="admin-form">
      {values.id ? <input type="hidden" name="id" value={values.id} /> : null}
      <p className="field-hint">
        <strong className="required-mark">*</strong> Campos obrigatórios
      </p>
      <label>
        <span>
          Nome <strong className="required-mark">*</strong>
        </span>
        <input name="name" required minLength={2} maxLength={100} defaultValue={values.name} />
      </label>
      <label>
        Slug
        <input name="slug" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" defaultValue={values.slug} />
      </label>
      <div className="admin-form-row">
        <label>
          <span>
            Máximo de imagens <strong className="required-mark">*</strong>
          </span>
          <input
            name="max_images"
            type="number"
            min="0"
            required
            defaultValue={values.max_images ?? 1}
          />
        </label>
        <label>
          <span>
            Máximo de itens <strong className="required-mark">*</strong>
          </span>
          <input
            name="max_items"
            type="number"
            min="0"
            required
            defaultValue={values.max_items ?? 0}
          />
        </label>
        <label>
          <span>
            Prioridade <strong className="required-mark">*</strong>
          </span>
          <input name="priority" type="number" required defaultValue={values.priority ?? 0} />
        </label>
      </div>
      <fieldset className="checkbox-grid">
        <legend>Recursos do plano</legend>
        {flags.map(([name, label]) => (
          <label key={name}>
            <input name={name} type="checkbox" defaultChecked={Boolean(values[name])} />
            {label}
          </label>
        ))}
      </fieldset>
      <button className="button" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
