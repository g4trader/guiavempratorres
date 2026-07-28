import { redirect } from "next/navigation";
import { updateAdminRole } from "@/app/admin/content-actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { canManageAdminRoles } from "@/lib/auth/authorization";
import { requireAdmin } from "@/lib/supabase/auth-server";

export default async function UsersAdminPage() {
  const { client, role } = await requireAdmin();
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
        <div className="admin-list">
          {data.map((profile) => {
            const membership = Array.isArray(profile.admin_roles)
              ? profile.admin_roles[0]
              : profile.admin_roles;
            return (
              <form action={updateAdminRole} className="panel admin-form-row" key={profile.id}>
                <input type="hidden" name="user_id" value={profile.id} />
                <div>
                  <strong>{profile.display_name || "Usuário sem nome"}</strong>
                  <br />
                  <small>{profile.id}</small>
                </div>
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
