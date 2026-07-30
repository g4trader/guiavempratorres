import { updatePassword } from "@/app/admin/content-actions";
import { Logo } from "@/components/layout/Logo";

export default function ResetPasswordPage() {
  return (
    <div className="container section">
      <div className="panel admin-login">
        <Logo className="admin-logo" priority />
        <h1>Definir nova senha</h1>
        <form action={updatePassword} className="admin-form">
          <label>
            Nova senha
            <input
              name="password"
              type="password"
              minLength={8}
              required
              autoComplete="new-password"
            />
          </label>
          <button className="button" type="submit">
            Alterar senha
          </button>
        </form>
      </div>
    </div>
  );
}
