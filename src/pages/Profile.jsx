import { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { User, Mail, Pencil, CheckCircle, TrendingUp, TrendingDown, Wallet, Target, BarChart2 } from "lucide-react";
import PageWrapper from "../components/PageWrapper";

export default function Profile() {
  const { perfil, setPerfil, transacoes, totalReceitas, totalDespesas, saldo, formatarMoeda, metas } = useFinance();

  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ ...perfil });
  const [salvo, setSalvo] = useState(false);

  const handleSalvar = () => {
    const iniciais = form.nome.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    setPerfil({ ...form, avatar: iniciais });
    setEditando(false);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);
  };

  const metasConcluidas = metas.filter((m) => m.valorAtual >= m.valorAlvo).length;

  const stats = [
    { label: "Transações", valor: transacoes.length, cor: "var(--text-primary)", icon: BarChart2 },
    { label: "Total recebido", valor: formatarMoeda(totalReceitas), cor: "#10b981", icon: TrendingUp },
    { label: "Total gasto", valor: formatarMoeda(totalDespesas), cor: "#ef4444", icon: TrendingDown },
    { label: "Saldo atual", valor: formatarMoeda(saldo), cor: saldo >= 0 ? "#10b981" : "#ef4444", icon: Wallet },
    { label: "Metas criadas", valor: metas.length, cor: "var(--text-primary)", icon: Target },
    { label: "Metas concluídas", valor: metasConcluidas, cor: "#10b981", icon: CheckCircle },
  ];

  return (
    <PageWrapper>
      <div className="page-header">
        <h1 className="page-title">Perfil</h1>
        <p className="page-subtitle">Gerencie suas informações</p>
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        {/* Card principal */}
        <div className="card">
          <div className="flex items-center gap-16" style={{ marginBottom: 24 }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "linear-gradient(135deg, #10b981, #3b82f6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 800, color: "#fff", flexShrink: 0,
              boxShadow: "0 0 20px rgba(16,185,129,0.3)"
            }}>
              {perfil.avatar}
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)" }}>
                {perfil.nome}
              </h2>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                <Mail size={12} strokeWidth={1.8} /> {perfil.email}
              </p>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                background: "rgba(16,185,129,0.12)", color: "#10b981",
                padding: "3px 10px", borderRadius: 20, fontSize: 12,
                fontWeight: 700, marginTop: 8, border: "1px solid rgba(16,185,129,0.25)"
              }}>
                <CheckCircle size={11} strokeWidth={1.8} /> Usuário Premium
              </span>
            </div>
          </div>

          {salvo && (
            <div style={{
              background: "rgba(16,185,129,0.12)", color: "#10b981",
              padding: "10px 16px", borderRadius: 10, fontSize: 13,
              fontWeight: 600, marginBottom: 16, border: "1px solid rgba(16,185,129,0.25)",
              display: "flex", alignItems: "center", gap: 8
            }}>
              <CheckCircle size={14} strokeWidth={1.8} />
              Perfil atualizado com sucesso!
            </div>
          )}

          {editando ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Nome completo</label>
                <div style={{ position: "relative" }}>
                  <User size={14} strokeWidth={1.8} color="var(--text-secondary)"
                    style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                  <input className="form-input" value={form.nome} style={{ paddingLeft: 36 }}
                    onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">E-mail</label>
                <div style={{ position: "relative" }}>
                  <Mail size={14} strokeWidth={1.8} color="var(--text-secondary)"
                    style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                  <input className="form-input" type="email" value={form.email} style={{ paddingLeft: 36 }}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-8">
                <button className="btn btn-secondary w-full" onClick={() => setEditando(false)}>
                  Cancelar
                </button>
                <button className="btn btn-primary w-full" onClick={handleSalvar}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <CheckCircle size={15} strokeWidth={1.8} /> Salvar
                </button>
              </div>
            </div>
          ) : (
            <div>
              {[
                { label: "Nome", valor: perfil.nome, icon: User },
                { label: "E-mail", valor: perfil.email, icon: Mail },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center justify-between"
                    style={{
                      padding: "10px 14px", background: "rgba(255,255,255,0.04)",
                      borderRadius: 10, marginBottom: 10, border: "1px solid var(--card-border)"
                    }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Icon size={13} strokeWidth={1.8} color="var(--text-secondary)" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>
                        {item.label}
                      </span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                      {item.valor}
                    </span>
                  </div>
                );
              })}
              <button className="btn btn-secondary" style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}
                onClick={() => { setForm({ ...perfil }); setEditando(true); }}>
                <Pencil size={14} strokeWidth={1.8} /> Editar perfil
              </button>
            </div>
          )}
        </div>

        {/* Estatísticas */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, color: "var(--text-primary)" }}>
              Suas estatísticas
            </h3>
            <div className="grid-2" style={{ gap: 12 }}>
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} style={{
                    padding: "14px 12px", background: "rgba(255,255,255,0.04)",
                    borderRadius: 12, border: "1px solid var(--card-border)"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <Icon size={13} strokeWidth={1.8} color={stat.cor} />
                      <p style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 600 }}>
                        {stat.label}
                      </p>
                    </div>
                    <p style={{ fontSize: 16, fontWeight: 800, color: stat.cor }}>
                      {stat.valor}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card" style={{
            background: "rgba(16,185,129,0.05)",
            border: "1.5px solid rgba(16,185,129,0.2)"
          }}>
            <h3 style={{ fontWeight: 700, marginBottom: 8, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
              💡 Dica do dia
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
              A regra 50/30/20 sugere usar 50% da renda para necessidades,
              30% para desejos e 20% para poupança. Experimente aplicar
              nas suas próximas transações!
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}