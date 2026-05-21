import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFinance } from "../context/FinanceContext";
import { WalletIcon } from "../components/Sidebar";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useFinance();
  const [form, setForm] = useState({ nome: "", email: "", senha: "", confirmar: "" });
  const [erro, setErro] = useState("");

  const handleSubmit = () => {
    if (!form.nome.trim()) return setErro("Informe o nome.");
    if (!form.email.trim()) return setErro("Informe o e-mail.");
    if (form.senha.length < 6) return setErro("A senha deve ter pelo menos 6 caracteres.");
    if (form.senha !== form.confirmar) return setErro("As senhas não coincidem.");
    const resultado = register(form.nome, form.email, form.senha);
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
            Crie sua conta gratuitamente
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Nome completo</label>
            <input
              className="form-input"
              placeholder="Seu nome"
              value={form.nome}
              onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              value={form.senha}
              onChange={(e) => setForm((p) => ({ ...p, senha: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar senha</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={form.confirmar}
              onChange={(e) => setForm((p) => ({ ...p, confirmar: e.target.value }))}
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
            Criar conta
          </button>

          <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-secondary)" }}>
            Já tem conta?{" "}
            <span onClick={() => navigate("/login")}
              style={{ color: "#10b981", fontWeight: 700, cursor: "pointer" }}>
              Entrar
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}