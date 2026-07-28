import { createPlan, deletePlan, updatePlan } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminCreatePanel } from "@/components/admin/AdminCreatePanel";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { PlanForm } from "@/components/admin/PlanForm";
import { requireAdmin } from "@/lib/supabase/auth-server";

type Props = { searchParams: Promise<{ erro?: string }> };

export default async function PlansPage({ searchParams }: Props) {
  const { client } = await requireAdmin();
  const { data: plans, error } = await client.from("plans").select("*").order("priority", {
    ascending: false
  });
  if (error) throw new Error("Não foi possível carregar os planos.");
  const { erro } = await searchParams;

  return (
    <>
      <AdminNav />
      <main className="container admin-page">
        <div className="admin-title">
          <div>
            <span className="eyebrow">Comercial</span>
            <h1>Planos</h1>
          </div>
          <span>{plans.length} cadastrados</span>
        </div>
        {erro ? (
          <p className="form-message error" role="alert">
            {erro}
          </p>
        ) : null}
        <AdminCreatePanel title="Novo plano">
          <PlanForm action={createPlan} submitLabel="Criar plano" />
        </AdminCreatePanel>
        <section className="admin-list" aria-label="Planos cadastrados">
          {plans.map((plan) => (
            <details className="panel" key={plan.id}>
              <summary>
                <strong>{plan.name}</strong>
                <span>
                  {plan.max_items} itens · {plan.max_images} imagens
                </span>
              </summary>
              <PlanForm action={updatePlan} values={plan} submitLabel="Salvar alterações" />
              <form action={deletePlan} className="danger-zone">
                <input type="hidden" name="id" value={plan.id} />
                <ConfirmSubmitButton message={`Excluir o plano “${plan.name}”?`}>
                  Excluir plano
                </ConfirmSubmitButton>
              </form>
            </details>
          ))}
        </section>
      </main>
    </>
  );
}
