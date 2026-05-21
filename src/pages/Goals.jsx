import { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import PageWrapper from "../components/PageWrapper";

const icones = ["🎯", "✈️", "🏠", "🚗", "💻", "📱", "🎓", "💍", "🏖️", "🛡️"];

export default function Goals() {
  const { metas, adicionarMeta, adicionarTransacao, atualizarMeta, removerMeta, formatarMoeda } = useFinance();

  const [showForm, setShowForm] = useState(false);
  const [aportarId, setAportarId] = useState(null);
  const [valorAporte, setValorAporte] = useState("");
  const [erro, setErro] = useState("");
  const [form, setForm] = useState({ nome: "", valorAlvo: "", prazo: "", icone: "🎯" });

  const handleSalvar = () => {
    if (!form.nome.trim()) return setErro("Informe o nome da meta.");
    if (!form.valorAlvo || parseFloat(form.valorAlvo) <= 0) return setErro("Informe um valor válido.");
    if (!form.prazo) return setErro("Informe o prazo.");
    adicionarMeta({ nome: form.nome, valorAlvo: parseFloat(form.valorAlvo), prazo: form.prazo, icone: form.icone });
    setForm({ nome: "", valorAlvo: "", prazo: "", icone: "🎯" });
    setErro("");
    setShowForm(false);
  };

  const handleAportar = (id) => {
    const valor = parseFloat(valorAporte);
    if (!valor || valor <= 0) return;
    atualizarMeta(id, valor);
    const meta = metas.find((m) => m.id === id);
    adicionarTransacao({
      descricao: `Aporte: ${meta.nome}`,
      valor, tipo: "despesa", categoria: "Meta",
      data: new Date().toISOString().split("T")[0],
    });
    setAportarId(null);
    setValorAporte("");
  };

  const concluidas = metas.filter((m) => m.valorAtual >= m.valorAlvo).length;
  const emAndamento = metas.filter((m) => m.valorAtual < m.valorAlvo).length;

  return (
    <PageWrapper>
      <div className="page-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 className="page-title">Metas Financeiras</h1>
          <p className="page-subtitle">Acompanhe e realize seus objetivos</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "+ Nova Meta"}
        </button>
      </div>

      <div className="grid-3" style={{ marginBottom: 16 }}>
        {[
          { icon: "🎯", label: "Total de metas", valor: metas.length, cor: "var(--text-primary)" },
          { icon: "⏳", label: "Em andamento", valor: emAndamento, cor: "#f59e0b" },
          { icon: "✅", label: "Concluídas", valor: concluidas, cor: "#10b981" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ textAlign: "center" }}>
            <p style={{ fontSize: 32 }}>{s.icon}</p>
            <p style={{ fontSize: 28, fontWeight: 800, marginTop: 8, color: s.cor }}>{s.valor}</p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 16, border: "1.5px dashed var(--card-border)" }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Nova meta</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {icones.map((ic) => (
              <button key={ic} onClick={() => setForm((p) => ({ ...p, icone: ic }))}
                style={{
                  width: 40, height: 40, borderRadius: 10, fontSize: 18, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: form.icone === ic ? "2px solid #10b981" : "2px solid var(--card-border)",
                  background: form.icone === ic ? "rgba(16,185,129,0.15)" : "var(--input-bg)",
                }}>
                {ic}
              </button>
            ))}
          </div>
          <div className="grid-2" style={{ marginBottom: 16 }}>
            <div className="form-group">
              <label className="form-label">Nome da meta</label>
              <input className="form-input" placeholder="Ex: Viagem para Europa"
                value={form.nome} onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Valor alvo (R$)</label>
              <input className="form-input" type="number" placeholder="10000"
                value={form.valorAlvo} onChange={(e) => setForm((p) => ({ ...p, valorAlvo: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Prazo</label>
              <input className="form-input" type="date"
                value={form.prazo} onChange={(e) => setForm((p) => ({ ...p, prazo: e.target.value }))} />
            </div>
          </div>
          {erro && (
            <p style={{ fontSize: 13, color: "#ef4444", background: "rgba(239,68,68,0.1)", padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)", marginBottom: 12 }}>
              ⚠️ {erro}
            </p>
          )}
          <button className="btn btn-primary" onClick={handleSalvar}>Salvar meta</button>
        </div>
      )}

      <div className="grid-2">
        {metas.map((meta) => {
          const pct = Math.min(Math.round((meta.valorAtual / meta.valorAlvo) * 100), 100);
          const concluida = pct >= 100;
          return (
            <div key={meta.id} className="card" style={{
              border: concluida ? "1.5px solid rgba(16,185,129,0.4)" : "1px solid var(--card-border)",
              background: concluida ? "rgba(16,185,129,0.05)" : "var(--card)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 28, width: 48, height: 48, background: "rgba(255,255,255,0.05)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {meta.icone}
                  </span>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{meta.nome}</p>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>Prazo: {meta.prazo}</p>
                  </div>
                </div>
                {concluida && (
                  <span style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, border: "1px solid rgba(16,185,129,0.25)" }}>
                    ✅ Concluída
                  </span>
                )}
              </div>

              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                <div>
                  <p style={{ fontSize: 20, fontWeight: 800, color: "#10b981" }}>{formatarMoeda(meta.valorAtual)}</p>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>de {formatarMoeda(meta.valorAlvo)} · {pct}%</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {!concluida && (
                    <button className="btn btn-secondary"
                      onClick={() => setAportarId(aportarId === meta.id ? null : meta.id)}>
                      + Aportar
                    </button>
                  )}
                  <button className="btn btn-danger"
                    onClick={() => { if (window.confirm("Remover esta meta?")) removerMeta(meta.id); }}>
                    🗑️
                  </button>
                </div>
              </div>

              {aportarId === meta.id && (
                <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center" }}>
                  <input className="form-input" type="number" placeholder="Valor a aportar..."
                    value={valorAporte} onChange={(e) => setValorAporte(e.target.value)} style={{ flex: 1 }} />
                  <button className="btn btn-primary" onClick={() => handleAportar(meta.id)}>Confirmar</button>
                  <button className="btn btn-secondary" onClick={() => setAportarId(null)}>Cancelar</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {metas.length === 0 && !showForm && (
        <div className="card" style={{ textAlign: "center", padding: 48, color: "var(--text-secondary)" }}>
          <p style={{ fontSize: 40 }}>🎯</p>
          <p style={{ marginTop: 12 }}>Nenhuma meta cadastrada ainda.</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowForm(true)}>
            Criar primeira meta
          </button>
        </div>
      )}
    </PageWrapper>
  );
}