import { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

export default function GoalCompleteModal({ meta, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(6px)",
      animation: "fadeIn 0.3s ease",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #064e3b, #065f46)",
        border: "1.5px solid rgba(16,185,129,0.4)",
        borderRadius: 24,
        padding: "40px 48px",
        textAlign: "center",
        maxWidth: 380,
        width: "90%",
        boxShadow: "0 0 60px rgba(16,185,129,0.3)",
        animation: "slideUp 0.4s ease",
        position: "relative",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16,
          background: "rgba(255,255,255,0.1)", border: "none",
          borderRadius: 8, width: 32, height: 32,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "rgba(255,255,255,0.6)"
        }}>
          <X size={16} strokeWidth={1.8} />
        </button>

        <div style={{ fontSize: 56, marginBottom: 8 }}>{meta.icone}</div>

        <CheckCircle size={40} color="#10b981" strokeWidth={1.5}
          style={{ margin: "0 auto 16px" }} />

        <h2 style={{
          fontSize: 22, fontWeight: 800, color: "#fff",
          marginBottom: 8, lineHeight: 1.3
        }}>
          Meta concluída!
        </h2>

        <p style={{ fontSize: 15, color: "#6ee7b7", marginBottom: 6 }}>
          {meta.nome}
        </p>

        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 24 }}>
          Parabéns! Você atingiu seu objetivo 🚀
        </p>

        <div style={{
          background: "rgba(16,185,129,0.15)",
          border: "1px solid rgba(16,185,129,0.3)",
          borderRadius: 12, padding: "10px 20px",
          fontSize: 16, fontWeight: 800, color: "#10b981",
          marginBottom: 20,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8
        }}>
          <CheckCircle size={18} strokeWidth={1.8} />
          100% atingido
        </div>

        <button onClick={onClose} className="btn btn-primary"
          style={{ width: "100%", justifyContent: "center", padding: 12 }}>
          Continuar
        </button>
      </div>
    </div>
  );
}