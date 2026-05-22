import { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, Search, Trash2, Pencil, Plus } from "lucide-react";
import PageWrapper from "../components/PageWrapper";

const categoriasPorTipo = {
  receita: ["Salário", "Renda Extra", "Investimentos", "Freelance", "Presente", "Outros"],
  despesa: ["Alimentação", "Moradia", "Transporte", "Saúde", "Educação", "Contas", "Lazer", "Roupas", "Meta", "Outros"],
};

export default function Transactions() {
  const { transacoes, removerTransacao, editarTransacao, formatarMoeda } = useFinance();
  const navigate = useNavigate();

  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [busca, setBusca] = useState("");
  const [ordenar, setOrdenar] = useState("data");
  const [editando, setEditando] = useState(null);
  const [formEdit, setFormEdit] = useState({});

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

  const abrirEdicao = (t) => {
    setEditando(t.id);
    setFormEdit({ ...t });
  };

  const salvarEdicao = () => {
    editarTransacao(editando, formEdit);
    setEditando(null);
  };

  return (
    <PageWrapper>
      {/* Modal de edição */}
      {editando && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)",
          animation: "fadeIn 0.3s ease",
        }}>
          <div className="card" style={{
            width: "100%", maxWidth: 440,
            animation: "slideUp 0.35s ease",
            border: "1.5px solid var(--card-border)",
          }}>
            <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
              <Pencil size={18} strokeWidth={1.8} color="#10b981" />
              Editar transação
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="flex gap-8">
                {["despesa", "receita"].map((tipo) => (
                  <button
                    key={tipo}
                    onClick={() => setFormEdit((p) => ({ ...p, tipo, categoria: categoriasPorTipo[tipo][0] }))}
                    style={{
                      flex: 1, padding: 12, borderRadius: 10, fontSize: 14,
                      fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      border: formEdit.tipo === tipo
                        ? `2px solid ${tipo === "receita" ? "#10b981" : "#ef4444"}`
                        : "2px solid var(--card-border)",
                      background: formEdit.tipo === tipo
                        ? tipo === "receita" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.12)"
                        : "var(--input-bg)",
                      color: formEdit.tipo === tipo
                        ? tipo === "receita" ? "#10b981" : "#ef4444"
                        : "var(--text-secondary)",
                    }}
                  >
                    {tipo === "receita"
                      ? <TrendingUp size={15} strokeWidth={1.8} />
                      : <TrendingDown size={15} strokeWidth={1.8} />
                    }
                    {tipo === "receita" ? "Receita" : "Despesa"}
                  </button>
                ))}
              </div>

              <div className="form-group">
                <label className="form-label">Descrição</label>
                <input className="form-input" value={formEdit.descricao}
                  onChange={(e) => setFormEdit((p) => ({ ...p, descricao: e.target.value }))} />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Valor (R$)</label>
                  <input className="form-input" type="number" value={formEdit.valor}
                    onChange={(e) => setFormEdit((p) => ({ ...p, valor: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Data</label>
                  <input className="form-input" type="date" value={formEdit.data}
                    onChange={(e) => setFormEdit((p) => ({ ...p, data: e.target.value }))} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Categoria</label>
                <select className="form-select" value={formEdit.categoria}
                  onChange={(e) => setFormEdit((p) => ({ ...p, categoria: e.target.value }))}>
                  {categoriasPorTipo[formEdit.tipo]?.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-12" style={{ marginTop: 4 }}>
                <button className="btn btn-secondary w-full" onClick={() => setEditando(null)}>
                  Cancelar
                </button>
                <button className="btn btn-primary w-full" onClick={salvarEdicao}>
                  Salvar alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Transações</h1>
          <p className="page-subtitle">{filtradas.length} registros encontrados</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/new")}
          style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={16} strokeWidth={1.8} /> Nova Transação
        </button>
      </div>

      <div className="card" style={{ padding: "16px 20px", marginBottom: 16 }}>
        <div className="flex items-center gap-12" style={{ flexWrap: "wrap" }}>
          <div style={{ flex: 1, position: "relative", minWidth: 200 }}>
            <Search size={14} strokeWidth={1.8} color="var(--text-secondary)"
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              className="form-input"
              placeholder="Buscar por descrição ou categoria..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>

          <div className="flex gap-8"
            style={{ background: "rgba(255,255,255,0.05)", padding: 4, borderRadius: 10 }}>
            {["todos", "receita", "despesa"].map((tipo) => (
              <button key={tipo} onClick={() => setFiltroTipo(tipo)}
                style={{
                  padding: "6px 14px", border: "none", borderRadius: 8,
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  background: filtroTipo === tipo ? "#10b981" : "transparent",
                  color: filtroTipo === tipo ? "#fff" : "var(--text-secondary)",
                  transition: "all 0.15s",
                }}>
                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </button>
            ))}
          </div>

          <select className="form-select" value={ordenar}
            onChange={(e) => setOrdenar(e.target.value)} style={{ width: 160 }}>
            <option value="data">Ordenar por data</option>
            <option value="valor">Ordenar por valor</option>
            <option value="descricao">Ordenar por nome</option>
          </select>
        </div>
      </div>

      <div className="card">
        {filtradas.length === 0 ? (
          <div style={{ textAlign: "center", padding: 48, color: "var(--text-secondary)" }}>
            <Search size={40} strokeWidth={1.2} style={{ margin: "0 auto 12px" }} />
            <p>Nenhuma transação encontrada</p>
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
                <tr key={t.id}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  style={{ transition: "background 0.15s" }}>
                  <td style={{ padding: "12px", fontWeight: 600, fontSize: 14, borderBottom: "1px solid var(--card-border)" }}>
                    <div className="flex items-center gap-8">
                      <div style={{
                        width: 32, height: 32, borderRadius: 8, display: "flex",
                        alignItems: "center", justifyContent: "center", flexShrink: 0,
                        background: t.tipo === "receita" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                      }}>
                        {t.tipo === "receita"
                          ? <TrendingUp size={14} color="#10b981" strokeWidth={1.8} />
                          : <TrendingDown size={14} color="#ef4444" strokeWidth={1.8} />
                        }
                      </div>
                      {t.descricao}
                    </div>
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
                      display: "inline-flex", alignItems: "center", gap: 4,
                      background: t.tipo === "receita" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.12)",
                      color: t.tipo === "receita" ? "#10b981" : "#ef4444",
                      border: `1px solid ${t.tipo === "receita" ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.2)"}`,
                    }}>
                      {t.tipo === "receita"
                        ? <TrendingUp size={11} strokeWidth={1.8} />
                        : <TrendingDown size={11} strokeWidth={1.8} />
                      }
                      {t.tipo === "receita" ? "Receita" : "Despesa"}
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
                    <div className="flex gap-8">
                      <button onClick={() => abrirEdicao(t)}
                        style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.5, transition: "opacity 0.15s", display: "flex", alignItems: "center" }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = 0.5}
                        title="Editar">
                        <Pencil size={15} strokeWidth={1.8} color="var(--text-secondary)" />
                      </button>
                      <button
                        onClick={() => { if (window.confirm("Remover esta transação?")) removerTransacao(t.id); }}
                        style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.5, transition: "opacity 0.15s", display: "flex", alignItems: "center" }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = 0.5}
                        title="Remover">
                        <Trash2 size={15} strokeWidth={1.8} color="#ef4444" />
                      </button>
                    </div>
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