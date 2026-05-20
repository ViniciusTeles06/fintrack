import { NavLink, useNavigate } from "react-router-dom";
import { useFinance } from "../context/FinanceContext";
import "./Sidebar.css";

const links = [
  { to: "/",             label: "Home",           icon: "🏠" },
  { to: "/dashboard",    label: "Dashboard",      icon: "📊" },
  { to: "/transactions", label: "Transações",     icon: "📋" },
  { to: "/new",          label: "Nova Transação", icon: "➕" },
  { to: "/goals",        label: "Metas",          icon: "🎯" },
  { to: "/profile",      label: "Perfil",         icon: "👤" },
];

export default function Sidebar() {
  const { saldo, formatarMoeda, perfil, darkMode, toggleDarkMode, logout } = useFinance();
  const navigate = useNavigate();

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <span>💎</span>
        <span>FinTrack</span>
      </div>

      <div className="sidebar-saldo">
        <span className="saldo-label">Saldo atual</span>
        <span className={`saldo-valor ${saldo >= 0 ? "positivo" : "negativo"}`}>
          {formatarMoeda(saldo)}
        </span>
      </div>

      <ul className="sidebar-links">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) => isActive ? "nav-link ativo" : "nav-link"}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <button
        onClick={toggleDarkMode}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 12px", borderRadius: 10, border: "none",
          background: "transparent", cursor: "pointer",
          color: "rgba(255,255,255,0.55)", fontSize: 14,
          fontWeight: 500, width: "100%", transition: "all 0.15s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      >
        <span>{darkMode ? "☀️" : "🌙"}</span>
        <span>{darkMode ? "Modo Claro" : "Modo Escuro"}</span>
      </button>

      <div className="sidebar-avatar">
        <div className="avatar-circle">{perfil.avatar}</div>
        <span>{perfil.nome.split(" ")[0]}</span>
        <button
          onClick={() => { logout(); navigate("/login"); }}
          style={{
            marginLeft: "auto", background: "none", border: "none",
            cursor: "pointer", fontSize: 16, opacity: 0.5,
            transition: "opacity 0.15s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
          onMouseLeave={(e) => e.currentTarget.style.opacity = 0.5}
          title="Sair"
        >
          🚪
        </button>
      </div>
    </nav>
  );
}