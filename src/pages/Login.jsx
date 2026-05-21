import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFinance } from "../context/FinanceContext";
import { WalletIcon } from "../components/Sidebar";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useFinance();
  const [form, setForm] = useState({ email: "", senha: "" });
  const [erro, setErro] = useState("");

  const handleSubmit = () => {
    if (!form.email.trim()) return setErro("Informe o e-mail.");
    if (!form.senha.trim()) return setErro("Informe a senha.");
    const resultado = login(form.email, form.senha);
    if (!resultado.sucesso) return setErro(resultado.erro);
    navigate("/");
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
    }}>
      <div className="card" style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <WalletIcon size={56} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 8 }}>FinTrack</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>
            Entre na sua conta
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              className="form-input"
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={form.senha}
              onChange={(e) => setForm((p) => ({ ...p, senha: e.target.value }))}
            />
          </div>

          {erro && (
            <p style={{
              fontSize: 13, color: "#ef4444",
              background: "rgba(239,68,68,0.1)",
              padding: "10px 14px", borderRadius: 8,
              border: "1px solid rgba(239,68,68,0.2)"
            }}>
              ⚠️ {erro}
            </p>
          )}

          <button className="btn btn-primary w-full" onClick={handleSubmit}
            style={{ justifyContent: "center", padding: 14 }}>
            Entrar
          </button>

          <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-secondary)" }}>
            Não tem conta?{" "}
            <span onClick={() => navigate("/register")}
              style={{ color: "#10b981", fontWeight: 700, cursor: "pointer" }}>
              Cadastre-se
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}