import { useFinance } from "../context/FinanceContext";
import { useNavigate } from "react-router-dom";
import { WalletIcon } from "../components/Sidebar";

export default function Home() {
  const { totalReceitas, totalDespesas, saldo, formatarMoeda, transacoes } = useFinance();
  const navigate = useNavigate();

  return (
    <div>
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
          <p style={{ fontSize: 32 }}>📈</p>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 8 }}>Receitas</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: "#10b981" }}>
            {formatarMoeda(totalReceitas)}
          </p>
        </div>

        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ fontSize: 32 }}>📉</p>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 8 }}>Despesas</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: "#ef4444" }}>
            {formatarMoeda(totalDespesas)}
          </p>
        </div>

        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ fontSize: 32 }}>💰</p>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 8 }}>Saldo</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: saldo >= 0 ? "#10b981" : "#ef4444" }}>
            {formatarMoeda(saldo)}
          </p>
        </div>
      </div>

      <div className="card mt-24">
        <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
          <h2 style={{ fontWeight: 700, fontSize: 16 }}>Últimas transações</h2>
          <button className="btn btn-secondary" onClick={() => navigate("/transactions")}>
            Ver todas
          </button>
        </div>

        {transacoes.slice(0, 4).map((t) => (
          <div key={t.id} className="flex items-center justify-between"
            style={{ padding: "10px 0", borderBottom: "1px solid var(--card-border)" }}>
            <div className="flex items-center gap-12">
              <span style={{ fontSize: 20 }}>{t.tipo === "receita" ? "💚" : "🔴"}</span>
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
        <button className="btn btn-primary" onClick={() => navigate("/new")}>
          + Nova Transação
        </button>
        <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
          Ver Dashboard
        </button>
      </div>
    </div>
  );
}