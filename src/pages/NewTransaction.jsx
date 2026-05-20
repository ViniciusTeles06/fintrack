import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFinance } from "../context/FinanceContext";

const categoriasPorTipo = {
  receita: ["Salário", "Renda Extra", "Investimentos", "Freelance", "Presente", "Outros"],
  despesa: ["Alimentação", "Moradia", "Transporte", "Saúde", "Educação", "Contas", "Lazer", "Roupas", "Outros"],
};

export default function NewTransaction() {
  const { adicionarTransacao, formatarMoeda } = useFinance();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    descricao: "",
    valor: "",
    tipo: "despesa",
    categoria: "Alimentação",
    data: new Date().toISOString().split("T")[0],
  });

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const novo = { ...prev, [name]: value };
      if (name === "tipo") novo.categoria = categoriasPorTipo[value][0];
      return novo;
    });
  };

  const handleSubmit = () => {
    if (!form.descricao.trim()) return setErro("Informe uma descrição.");
    if (!form.valor || parseFloat(form.valor) <= 0) return setErro("Informe um valor válido.");
    if (!form.data) return setErro("Informe a data.");

    setErro("");
    adicionarTransacao({ ...form, valor: parseFloat(form.valor) });
    setSucesso(true);
    setTimeout(() => navigate("/transactions"), 1500);
  };

  if (sucesso) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 56 }}>✅</p>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 12 }}>Transação adicionada!</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: 8 }}>Redirecionando...</p>
          <p style={{ fontWeight: 700, color: "#10b981", marginTop: 8 }}>
            {form.tipo === "receita" ? "+" : "-"}{formatarMoeda(parseFloat(form.valor))}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Nova Transação</h1>
        <p className="page-subtitle">Registre uma receita ou despesa</p>
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        <div className="card">
          {/* Tipo */}
          <div className="flex gap-8" style={{ marginBottom: 24 }}>
            {["despesa", "receita"].map((tipo) => (
              <button
                key={tipo}
                onClick={() => handleChange({ target: { name: "tipo", value: tipo } })}
                style={{
                  flex: 1, padding: 14, borderRadius: 12, fontSize: 15,
                  fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                  border: form.tipo === tipo
                    ? `2px solid ${tipo === "receita" ? "#10b981" : "#ef4444"}`
                    : "2px solid var(--card-border)",
                  background: form.tipo === tipo
                    ? tipo === "receita"
                      ? "rgba(16,185,129,0.15)"
                      : "rgba(239,68,68,0.12)"
                    : "var(--input-bg)",
                  color: form.tipo === tipo
                    ? tipo === "receita" ? "#10b981" : "#ef4444"
                    : "var(--text-secondary)",
                }}
              >
                {tipo === "receita" ? "📈 Receita" : "📉 Despesa"}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Descrição *</label>
              <input
                className="form-input"
                name="descricao"
                placeholder="Ex: Conta de energia, Salário..."
                value={form.descricao}
                onChange={handleChange}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Valor (R$) *</label>
                <input
                  className="form-input"
                  name="valor"
                  type="number"
                  placeholder="0,00"
                  min="0"
                  step="0.01"
                  value={form.valor}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Data *</label>
                <input
                  className="form-input"
                  name="data"
                  type="date"
                  value={form.data}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Categoria</label>
              <select
                className="form-select"
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
              >
                {categoriasPorTipo[form.tipo].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
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

            <div className="flex gap-12">
              <button className="btn btn-secondary w-full" onClick={() => navigate(-1)}>
                Cancelar
              </button>
              <button className="btn btn-primary w-full" onClick={handleSubmit}>
                Salvar transação
              </button>
            </div>
          </div>
        </div>

        {/* Prévia */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 16, color: "var(--text-primary)" }}>
            Prévia
          </h3>
          <div style={{
            borderRadius: 12,
            padding: 20,
            background: form.tipo === "receita"
              ? "rgba(16,185,129,0.12)"
              : "rgba(239,68,68,0.1)",
            border: `1.5px solid ${form.tipo === "receita"
              ? "rgba(16,185,129,0.35)"
              : "rgba(239,68,68,0.3)"}`,
          }}>
            <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: form.tipo === "receita" ? "#10b981" : "#ef4444" }}>
              {form.tipo === "receita" ? "📈 Receita" : "📉 Despesa"}
            </p>

            <p style={{
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 8,
              color: form.descricao ? "var(--text-primary)" : "var(--text-secondary)",
            }}>
              {form.descricao || "Descrição..."}
            </p>

            <p style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: -1,
              marginBottom: 12,
              color: form.tipo === "receita" ? "#10b981" : "#ef4444",
            }}>
              {form.tipo === "receita" ? "+" : "-"}
              {form.valor ? formatarMoeda(parseFloat(form.valor)) : "R$ 0,00"}
            </p>

            <div className="flex gap-12" style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              <brazil>📁 {form.categoria}</brazil>
              <brazil>📅 {form.data}</brazil>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}