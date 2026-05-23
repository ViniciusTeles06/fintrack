import { useFinance } from "../context/FinanceContext";
import { TrendingUp, TrendingDown } from "lucide-react";
import PageWrapper from "../components/PageWrapper";

const CORES = [
  "#10b981", "#3b82f6", "#f59e0b", "#ef4444",
  "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16",
  "#f97316", "#6366f1",
];

function PieChart({ dados, total }) {
  const cx = 100;
  const cy = 100;
  const r = 80;
  let anguloAtual = -90;

  const fatias = dados.map((d, i) => {
    const pct = d.valor / total;
    const angulo = pct * 360;
    const inicio = anguloAtual;
    anguloAtual += angulo;

    const rad = (deg) => (deg * Math.PI) / 180;
    const x1 = cx + r * Math.cos(rad(inicio));
    const y1 = cy + r * Math.sin(rad(inicio));
    const x2 = cx + r * Math.cos(rad(inicio + angulo));
    const y2 = cy + r * Math.sin(rad(inicio + angulo));
    const largeArc = angulo > 180 ? 1 : 0;
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return { ...d, path, cor: CORES[i % CORES.length] };
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
      <svg width="200" height="200" viewBox="0 0 200 200" style={{ flexShrink: 0 }}>
        {fatias.map((f, i) => (
          <path key={i} d={f.path} fill={f.cor} stroke="var(--background)" strokeWidth="2">
            <title>{f.nome}: {f.pct}%</title>
          </path>
        ))}
        <circle cx={cx} cy={cy} r={40} fill="var(--background)" />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fill="var(--text-secondary)">
          {dados.length}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--text-primary)">
          categorias
        </text>
      </svg>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {fatias.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: f.cor, flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{f.nome}</span>
            </div>
            <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600 }}>
              {f.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Categories() {
  const { transacoes, formatarMoeda } = useFinance();

  const totalDespesas = transacoes
    .filter((t) => t.tipo === "despesa")
    .reduce((acc, t) => acc + t.valor, 0);

  const totalReceitas = transacoes
    .filter((t) => t.tipo === "receita")
    .reduce((acc, t) => acc + t.valor, 0);

  const gastosPorCategoria = transacoes
    .filter((t) => t.tipo === "despesa")
    .reduce((acc, t) => {
      acc[t.categoria] = (acc[t.categoria] || 0) + t.valor;
      return acc;
    }, {});

  const receitasPorCategoria = transacoes
    .filter((t) => t.tipo === "receita")
    .reduce((acc, t) => {
      acc[t.categoria] = (acc[t.categoria] || 0) + t.valor;
      return acc;
    }, {});

  const dadosDespesas = Object.entries(gastosPorCategoria)
    .sort((a, b) => b[1] - a[1])
    .map(([nome, valor]) => ({
      nome, valor,
      pct: Math.round((valor / totalDespesas) * 100),
    }));

  const dadosReceitas = Object.entries(receitasPorCategoria)
    .sort((a, b) => b[1] - a[1])
    .map(([nome, valor]) => ({
      nome, valor,
      pct: Math.round((valor / totalReceitas) * 100),
    }));

  return (
    <PageWrapper>
      <div className="page-header">
        <h1 className="page-title">Categorias</h1>
        <p className="page-subtitle">Distribuição das suas finanças por categoria</p>
      </div>

      <div className="grid-2">
        {/* Despesas */}
        <div className="card">
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ background: "rgba(239,68,68,0.12)", padding: 8, borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)" }}>
                <TrendingDown size={16} color="#ef4444" strokeWidth={1.8} />
              </div>
              <h2 style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>
                Despesas por categoria
              </h2>
            </div>
            <p style={{ fontSize: 13, color: "#ef4444", fontWeight: 700, marginLeft: 40 }}>
              Total: {formatarMoeda(totalDespesas)}
            </p>
          </div>

          {dadosDespesas.length === 0 ? (
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>Nenhuma despesa registrada.</p>
          ) : (
            <>
              <PieChart dados={dadosDespesas} total={totalDespesas} />
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                {dadosDespesas.map((d, i) => (
                  <div key={d.nome}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                        {d.nome}
                      </span>
                      <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                        {formatarMoeda(d.valor)}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div style={{
                        height: "100%", borderRadius: 99,
                        background: CORES[i % CORES.length],
                        width: `${d.pct}%`,
                        transition: "width 0.4s ease",
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Receitas */}
        <div className="card">
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ background: "rgba(16,185,129,0.12)", padding: 8, borderRadius: 8, border: "1px solid rgba(16,185,129,0.2)" }}>
                <TrendingUp size={16} color="#10b981" strokeWidth={1.8} />
              </div>
              <h2 style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>
                Receitas por categoria
              </h2>
            </div>
            <p style={{ fontSize: 13, color: "#10b981", fontWeight: 700, marginLeft: 40 }}>
              Total: {formatarMoeda(totalReceitas)}
            </p>
          </div>

          {dadosReceitas.length === 0 ? (
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>Nenhuma receita registrada.</p>
          ) : (
            <>
              <PieChart dados={dadosReceitas} total={totalReceitas} />
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                {dadosReceitas.map((d, i) => (
                  <div key={d.nome}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                        {d.nome}
                      </span>
                      <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                        {formatarMoeda(d.valor)}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div style={{
                        height: "100%", borderRadius: 99,
                        background: CORES[i % CORES.length],
                        width: `${d.pct}%`,
                        transition: "width 0.4s ease",
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}