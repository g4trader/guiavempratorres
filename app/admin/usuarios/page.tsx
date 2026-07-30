import { redirect } from "next/navigation";
import { updateAdminRole } from "@/app/admin/content-actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminCreatePanel } from "@/components/admin/AdminCreatePanel";
import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { canManageAdminRoles } from "@/lib/auth/authorization";
import { requireAdmin } from "@/lib/supabase/auth-server";

type PageProps = { searchParams: Promise<{ erro?: string; mensagem?: string }> };

export default async function UsersAdminPage({ searchParams }: PageProps) {
  const { client, role } = await requireAdmin();
  const { erro, mensagem } = await searchParams;
  if (!canManageAdminRoles(role)) redirect("/admin?erro=permissao");
  const { data, error } = await client
    .from("profiles")
    .select("id,display_name,admin_roles(role)")
    .order("display_name");
  if (error) throw new Error("Não foi possível carregar os usuários.");
  return (
    <>
      <AdminNav />
      <main className="container admin-page">
        <div className="admin-title">
          <div>
            <span className="eyebrow">Acesso</span>
            <h1>Usuários</h1>
          </div>
          <span>{data.length} usuários</span>
        </div>
        <AdminFeedback error={erro} message={mensagem} />
        <AdminCreatePanel title="Adicionar usuário">
          <p>
            Novos usuários devem concluir o cadastro no Supabase Auth. Depois disso, eles aparecem
            nesta lista para definição do papel administrativo.
          </p>
        </AdminCreatePanel>
        <div className="admin-list">
          {data.map((profile) => {
            const membership = Array.isArray(profile.admin_roles)
              ? profile.admin_roles[0]
              : profile.admin_roles;
            return (
              <details className="panel" key={profile.id}>
                <summary>
                  <strong>{profile.display_name || "Usuário sem nome"}</strong>
                  <span>{membership?.role ?? "editor"}</span>
                </summary>
                <form action={updateAdminRole} className="admin-form-row">
                  <input type="hidden" name="user_id" value={profile.id} />
                  <small>{profile.id}</small>
                  <label>
                    Papel
                    <select name="role" defaultValue={membership?.role ?? "editor"}>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super admin</option>
                    </select>
                  </label>
                  <button className="button" type="submit">
                    Salvar papel
                  </button>
                </form>
              </details>
            );
          })}
          {!data.length ? (
            <div className="empty">Nenhum usuário cadastrado no Supabase Auth.</div>
          ) : null}
        </div>
      </main>
    </>
  );
}
