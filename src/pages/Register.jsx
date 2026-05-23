import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFinance } from "../context/FinanceContext";
import { WalletIcon } from "../components/Sidebar";
import { Mail, Lock, User, UserPlus, CheckCircle } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useFinance();
  const [form, setForm] = useState({ nome: "", email: "", senha: "", confirmar: "" });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = () => {
    if (!form.nome.trim()) return setErro("Informe o nome.");
    if (!form.email.trim()) return setErro("Informe o e-mail.");
    if (form.senha.length < 6) return setErro("A senha deve ter pelo menos 6 caracteres.");
    if (form.senha !== form.confirmar) return setErro("As senhas não coincidem.");
    const resultado = register(form.nome, form.email, form.senha);
    if (!resultado.sucesso) return setErro(resultado.erro);
    setSucesso(true);
    setTimeout(() => navigate("/"), 1500);
  };

  if (sucesso) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <CheckCircle size={64} color="#10b981" strokeWidth={1.5} style={{ margin: "0 auto 16px" }} />
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)" }}>
            Cadastro realizado!
          </h2>
          <p style={{ color: "var(--text-secondary)", marginTop: 8 }}>Redirecionando...</p>
        </div>
      </div>
    );
  }

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
          <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: "var(--text-primary)" }}>
            FinTrack
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>
            Crie sua conta gratuitamente
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Nome completo</label>
            <div style={{ position: "relative" }}>
              <User size={14} strokeWidth={1.8} color="var(--text-secondary)"
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input className="form-input" placeholder="Seu nome"
                value={form.nome} style={{ paddingLeft: 36 }}
                onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">E-mail</label>
            <div style={{ position: "relative" }}>
              <Mail size={14} strokeWidth={1.8} color="var(--text-secondary)"
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input className="form-input" type="email" placeholder="seu@email.com"
                value={form.email} style={{ paddingLeft: 36 }}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <div style={{ position: "relative" }}>
              <Lock size={14} strokeWidth={1.8} color="var(--text-secondary)"
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input className="form-input" type="password" placeholder="Mínimo 6 caracteres"
                value={form.senha} style={{ paddingLeft: 36 }}
                onChange={(e) => setForm((p) => ({ ...p, senha: e.target.value }))} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar senha</label>
            <div style={{ position: "relative" }}>
              <Lock size={14} strokeWidth={1.8} color="var(--text-secondary)"
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input className="form-input" type="password" placeholder="••••••••"
                value={form.confirmar} style={{ paddingLeft: 36 }}
                onChange={(e) => setForm((p) => ({ ...p, confirmar: e.target.value }))} />
            </div>
          </div>

          {erro && (
            <p style={{
              fontSize: 13, color: "#ef4444",
              background: "rgba(239,68,68,0.1)",
              padding: "10px 14px", borderRadius: 8,
              border: "1px solid rgba(239,68,68,0.2)",
            }}>
              ⚠️ {erro}
            </p>
          )}

          <button className="btn btn-primary w-full" onClick={handleSubmit}
            style={{ justifyContent: "center", padding: 14, gap: 8 }}>
            <UserPlus size={16} strokeWidth={1.8} />
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