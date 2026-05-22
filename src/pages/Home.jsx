import { useFinance } from "../context/FinanceContext";
import { useNavigate } from "react-router-dom";
import { WalletIcon } from "../components/Sidebar";
import { TrendingUp, TrendingDown, Wallet, ArrowRight, Plus } from "lucide-react";
import PageWrapper from "../components/PageWrapper";

export default function Home() {
  const { totalReceitas, totalDespesas, saldo, formatarMoeda, transacoes } = useFinance();
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className="page-header">
        <div className="flex items-center gap-12">
          <WalletIcon size={40} />
          <div>
            <h1 className="page-title">Bem-vindo ao FinTrack</h1>
            <p className="page-subtitle">Seu controle financeiro pessoal</p>
          </div>
        </div>
      </div>

      <div className="grid-3">
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <div style={{ background: "rgba(16,185,129,0.12)", padding: 12, borderRadius: 12, border: "1px solid rgba(16,185,129,0.2)" }}>
              <TrendingUp size={24} color="#10b981" strokeWidth={1.8} />
            </div>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 8 }}>Receitas</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: "#10b981" }}>
            {formatarMoeda(totalReceitas)}
          </p>
        </div>

        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <div style={{ background: "rgba(239,68,68,0.12)", padding: 12, borderRadius: 12, border: "1px solid rgba(239,68,68,0.2)" }}>
              <TrendingDown size={24} color="#ef4444" strokeWidth={1.8} />
            </div>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 8 }}>Despesas</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: "#ef4444" }}>
            {formatarMoeda(totalDespesas)}
          </p>
        </div>

        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <div style={{ background: "rgba(59,130,246,0.12)", padding: 12, borderRadius: 12, border: "1px solid rgba(59,130,246,0.2)" }}>
              <Wallet size={24} color="#3b82f6" strokeWidth={1.8} />
            </div>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 8 }}>Saldo</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: saldo >= 0 ? "#10b981" : "#ef4444" }}>
            {formatarMoeda(saldo)}
          </p>
        </div>
      </div>

      <div className="card mt-24">
        <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
          <h2 style={{ fontWeight: 700, fontSize: 16 }}>Últimas transações</h2>
          <button className="btn btn-secondary" onClick={() => navigate("/transactions")}
            style={{ display: "flex", alignItems: "center", gap: 6 }}>
            Ver todas <ArrowRight size={14} strokeWidth={1.8} />
          </button>
        </div>

        {transacoes.slice(0, 4).map((t) => (
          <div key={t.id} className="flex items-center justify-between"
            style={{ padding: "10px 0", borderBottom: "1px solid var(--card-border)" }}>
            <div className="flex items-center gap-12">
              <div style={{
                width: 36, height: 36, borderRadius: 10, display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
                background: t.tipo === "receita" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                border: `1px solid ${t.tipo === "receita" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
              }}>
                {t.tipo === "receita"
                  ? <TrendingUp size={16} color="#10b981" strokeWidth={1.8} />
                  : <TrendingDown size={16} color="#ef4444" strokeWidth={1.8} />
                }
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{t.descricao}</p>
                <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  {t.categoria} · {t.data}
                </p>
              </div>
            </div>
            <span style={{
              fontWeight: 700, fontSize: 14,
              color: t.tipo === "receita" ? "#10b981" : "#ef4444"
            }}>
              {t.tipo === "receita" ? "+" : "-"}{formatarMoeda(t.valor)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-12 mt-16">
        <button className="btn btn-primary" onClick={() => navigate("/new")}
          style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={16} strokeWidth={1.8} /> Nova Transação
        </button>
        <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}
          style={{ display: "flex", alignItems: "center", gap: 6 }}>
          Ver Dashboard <ArrowRight size={14} strokeWidth={1.8} />
        </button>
      </div>
    </PageWrapper>
  );
}