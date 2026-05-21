import { useFinance } from "../context/FinanceContext";
import { useNavigate } from "react-router-dom";

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function BarChart({ dados, formatarMoeda }) {
  const maxVal = Math.max(...dados.map((d) => Math.max(d.receitas, d.despesas)), 1);
  const chartH = 100;
  const barW = 16;
  const gap = 52;
  const startX = 38;

  return (
    <div style={{ overflowX: "auto" }}>
      <svg
        width="100%"
        viewBox={`0 0 ${startX + dados.length * gap + 20} ${chartH + 60}`}
        style={{ overflow: "visible", minWidth: 300 }}
      >
        {/* Linhas de grade */}
        {[0.25, 0.5, 0.75, 1].map((frac) => (
          <g key={frac}>
            <line
              x1={startX - 8}
              y1={chartH - frac * chartH}
              x2={startX + dados.length * gap}
              y2={chartH - frac * chartH}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
            <text
              x={startX - 10}
              y={chartH - frac * chartH + 4}
              textAnchor="end"
              fontSize="9"
              fill="var(--text-secondary)"
            >
              {(maxVal * frac / 1000).toFixed(0)}k
            </text>
          </g>
        ))}

        {/* Linha base */}
        <line
          x1={startX - 8}
          y1={chartH}
          x2={startX + dados.length * gap}
          y2={chartH}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />

        {dados.map((d, i) => {
          const x = startX + i * gap;
          const hR = (d.receitas / maxVal) * chartH;
          const hD = (d.despesas / maxVal) * chartH;
          const isAtual = d.isAtual;

          return (
            <g key={d.mes}>
              {/* Barra receita */}
              <rect
                x={x}
                y={chartH - hR}
                width={barW}
                height={hR || 2}
                rx="5"
                fill={isAtual ? "#10b981" : "rgba(16,185,129,0.4)"}
              />

              {/* Barra despesa */}
              <rect
                x={x + barW + 5}
                y={chartH - hD}
                width={barW}
                height={hD || 2}
                rx="5"
                fill={isAtual ? "#ef4444" : "rgba(239,68,68,0.4)"}
              />

              {/* Label mês */}
              <text
                x={x + barW + 2}
                y={chartH + 18}
                textAnchor="middle"
                fontSize="11"
                fontWeight={isAtual ? "700" : "500"}
                fill={isAtual ? "var(--text-primary)" : "var(--text-secondary)"}
              >
                {d.mes}
              </text>

              {/* Badge "atual" */}
              {isAtual && (
                <text
                  x={x + barW + 2}
                  y={chartH + 32}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#10b981"
                  fontWeight="700"
                >
                  atual
                </text>
              )}
            </g>
          );
        })}

        {/* Legenda */}
        <rect x={startX} y={chartH + 44} width={10} height={10} rx="2" fill="#10b981" />
        <text x={startX + 14} y={chartH + 53} fontSize="10" fill="var(--text-secondary)">
          Receitas
        </text>
        <rect x={startX + 70} y={chartH + 44} width={10} height={10} rx="2" fill="#ef4444" />
        <text x={startX + 84} y={chartH + 53} fontSize="10" fill="var(--text-secondary)">
          Despesas
        </text>
      </svg>
    </div>
  );
}

export default function Dashboard() {
  const { transacoes, totalReceitas, totalDespesas, saldo, formatarMoeda, metas } = useFinance();
  const navigate = useNavigate();

  // Gera os últimos 4 meses a partir do mês atual
  const hoje = new Date();
  const dadosMeses = Array.from({ length: 4 }, (_, i) => {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - (3 - i), 1);
    const mes = data.getMonth();
    const ano = data.getFullYear();
    const isAtual = i === 3;

    const receitas = transacoes
      .filter((t) => {
        const d = new Date(t.data);
        return t.tipo === "receita" && d.getMonth() === mes && d.getFullYear() === ano;
      })
      .reduce((acc, t) => acc + t.valor, 0);

    const despesas = transacoes
      .filter((t) => {
        const d = new Date(t.data);
        return t.tipo === "despesa" && d.getMonth() === mes && d.getFullYear() === ano;
      })
      .reduce((acc, t) => acc + t.valor, 0);

    return { mes: MESES[mes], ano, receitas, despesas, isAtual };
  });

  const gastosPorCategoria = transacoes
    .filter((t) => t.tipo === "despesa")
    .reduce((acc, t) => {
      acc[t.categoria] = (acc[t.categoria] || 0) + t.valor;
      return acc;
    }, {});

  const categorias = Object.entries(gastosPorCategoria).sort((a, b) => b[1] - a[1]);

  const taxaPoupanca = totalReceitas > 0
    ? Math.round(((totalReceitas - totalDespesas) / totalReceitas) * 100)
    : 0;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Visão geral das suas finanças</p>
      </div>

      {/* Cards resumo */}
      <div className="grid-3">
        <div className="card" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 28 }}>📈</span>
          <div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Receitas</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: "#10b981" }}>
              {formatarMoeda(totalReceitas)}
            </p>
          </div>
        </div>

        <div className="card" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 28 }}>📉</span>
          <div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Despesas</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: "#ef4444" }}>
              {formatarMoeda(totalDespesas)}
            </p>
          </div>
        </div>

        <div className="card" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 28 }}>💰</span>
          <div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Saldo</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: saldo >= 0 ? "#10b981" : "#ef4444" }}>
              {formatarMoeda(saldo)}
            </p>
          </div>
        </div>
      </div>

      {/* Gráfico de barras */}
      <div className="card mt-16" style={{ maxwidth: 500}}>
        <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
          <h2 style={{ fontWeight: 700, fontSize: 16 }}>Receitas vs Despesas</h2>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "4px 10px",
            borderRadius: 20, background: "rgba(16,185,129,0.12)",
            color: "#10b981", border: "1px solid rgba(16,185,129,0.25)"
          }}>
            Últimos 4 meses
          </span>
        </div>
        <BarChart dados={dadosMeses} formatarMoeda={formatarMoeda} />
      </div>

      <div className="grid-2 mt-16">
        {/* Gastos por categoria */}
        <div className="card">
          <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>
            Gastos por categoria
          </h2>
          {categorias.length === 0 ? (
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>
              Nenhuma despesa registrada.
            </p>
          ) : (
            categorias.map(([cat, valor]) => {
              const pct = Math.round((valor / totalDespesas) * 100);
              return (
                <div key={cat} style={{ marginBottom: 14 }}>
                  <div className="flex items-center justify-between text-sm" style={{ marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{cat}</span>
                    <span style={{ color: "var(--text-secondary)" }}>
                      {pct}% · {formatarMoeda(valor)}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Taxa de poupança + metas */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>
              Taxa de poupança
            </p>
            <p style={{
              fontSize: 40, fontWeight: 800,
              color: taxaPoupanca >= 0 ? "#10b981" : "#ef4444"
            }}>
              {taxaPoupanca}%
            </p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
              {taxaPoupanca >= 20 ? "🟢 Excelente!" : taxaPoupanca >= 10 ? "🟡 Razoável" : "🔴 Atenção"}
            </p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
              <h2 style={{ fontWeight: 700, fontSize: 16 }}>Metas</h2>
              <button
                className="btn btn-secondary"
                style={{ fontSize: 12, padding: "6px 12px" }}
                onClick={() => navigate("/goals")}
              >
                Ver todas
              </button>
            </div>
            {metas.slice(0, 2).map((meta) => {
              const pct = Math.round((meta.valorAtual / meta.valorAlvo) * 100);
              return (
                <div key={meta.id} style={{ marginBottom: 12 }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                      {meta.icone} {meta.nome}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}