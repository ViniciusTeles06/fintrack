import { useEffect } from "react";

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
      }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>
          {meta.icone}
        </div>

        <div style={{ fontSize: 32, marginBottom: 12 }}>🎉</div>

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
          fontSize: 20, fontWeight: 800, color: "#10b981",
          marginBottom: 20,
        }}>
          ✅ 100% atingido
        </div>

        <button
          onClick={onClose}
          className="btn btn-primary"
          style={{ width: "100%", justifyContent: "center", padding: 12 }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}