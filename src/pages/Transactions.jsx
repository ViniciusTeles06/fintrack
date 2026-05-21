import { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

export default function Transactions() {
  const { transacoes, removerTransacao, formatarMoeda } = useFinance();
  const navigate = useNavigate();

  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [busca, setBusca] = useState("");
  const [ordenar, setOrdenar] = useState("data");

  const filtradas = transacoes
    .filter((t) => {
      const passaTipo = filtroTipo === "todos" || t.tipo === filtroTipo;
      const passaBusca =
        t.descricao.toLowerCase().includes(busca.toLowerCase()) ||
        t.categoria.toLowerCase().includes(busca.toLowerCase());
      return passaTipo && passaBusca;
    })
    .sort((a, b) => {
      if (ordenar === "data") return new Date(b.data) - new Date(a.data);
      if (ordenar === "valor") return b.valor - a.valor;
      return a.descricao.localeCompare(b.descricao);
    });

  return (
    <PageWrapper>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Transações</h1>
          <p className="page-subtitle">{filtradas.length} registros encontrados</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/new")}>
          + Nova Transação
        </button>
      </div>

      <div className="card" style={{ padding: "16px 20px", marginBottom: 16 }}>
        <div className="flex items-center gap-12" style={{ flexWrap: "wrap" }}>
          <input
            className="form-input"
            placeholder="🔍 Buscar por descrição ou categoria..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ flex: 1 }}
          />

          <div className="flex gap-8"
            style={{ background: "rgba(255,255,255,0.05)", padding: 4, borderRadius: 10 }}>
            {["todos", "receita", "despesa"].map((tipo) => (
              <button
                key={tipo}
                onClick={() => setFiltroTipo(tipo)}
                style={{
                  padding: "6px 14px", border: "none", borderRadius: 8,
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  background: filtroTipo === tipo ? "#10b981" : "transparent",
                  color: filtroTipo === tipo ? "#fff" : "var(--text-secondary)",
                  transition: "all 0.15s",
                }}
              >
                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </button>
            ))}
          </div>

          <select
            className="form-select"
            value={ordenar}
            onChange={(e) => setOrdenar(e.target.value)}
            style={{ width: 160 }}
          >
            <option value="data">Ordenar por data</option>
            <option value="valor">Ordenar por valor</option>
            <option value="descricao">Ordenar por nome</option>
          </select>
        </div>
      </div>

      <div className="card">
        {filtradas.length === 0 ? (
          <div style={{ textAlign: "center", padding: 48, color: "var(--text-secondary)" }}>
            <p style={{ fontSize: 40 }}>🔍</p>
            <p style={{ marginTop: 12 }}>Nenhuma transação encontrada</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }}
              onClick={() => navigate("/new")}>
              Adicionar transação
            </button>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Descrição", "Categoria", "Data", "Tipo", "Valor", ""].map((h) => (
                  <th key={h} style={{
                    textAlign: "left", padding: "10px 12px",
                    fontSize: 12, fontWeight: 700, textTransform: "uppercase",
                    letterSpacing: "0.4px", color: "var(--text-secondary)",
                    borderBottom: "1px solid var(--card-border)"
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map((t) => (
                <tr key={t.id} style={{ transition: "background 0.15s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px", fontWeight: 600, fontSize: 14, borderBottom: "1px solid var(--card-border)" }}>
                    {t.descricao}
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid var(--card-border)" }}>
                    <span style={{
                      background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)",
                      padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600
                    }}>
                      {t.categoria}
                    </span>
                  </td>
                  <td style={{ padding: "12px", fontSize: 13, color: "var(--text-secondary)", borderBottom: "1px solid var(--card-border)" }}>
                    {t.data}
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid var(--card-border)" }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: t.tipo === "receita" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.12)",
                      color: t.tipo === "receita" ? "#10b981" : "#ef4444",
                      border: `1px solid ${t.tipo === "receita" ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.2)"}`,
                    }}>
                      {t.tipo === "receita" ? "📈 Receita" : "📉 Despesa"}
                    </span>
                  </td>
                  <td style={{
                    padding: "12px", fontWeight: 700, fontSize: 14,
                    color: t.tipo === "receita" ? "#10b981" : "#ef4444",
                    borderBottom: "1px solid var(--card-border)"
                  }}>
                    {t.tipo === "receita" ? "+" : "-"}{formatarMoeda(t.valor)}
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid var(--card-border)" }}>
                    <button
                      onClick={() => { if (window.confirm("Remover esta transação?")) removerTransacao(t.id); }}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, opacity: 0.5, transition: "opacity 0.15s" }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = 0.5}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PageWrapper>
  );
}