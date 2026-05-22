import { NavLink, useNavigate } from "react-router-dom";
import { useFinance } from "../context/FinanceContext";
import "./Sidebar.css";

const links = [
  { to: "/",             label: "Home",       icon: "🏠" },
  { to: "/dashboard",    label: "Dashboard",  icon: "📊" },
  { to: "/transactions", label: "Transações", icon: "📋" },
  { to: "/new",          label: "Nova",       icon: "➕" },
  { to: "/goals",        label: "Metas",      icon: "🎯" },
  { to: "/categories",   label: "Categorias", icon: "🥧" },
  { to: "/profile",      label: "Perfil",     icon: "👤" },
];

export function WalletIcon({ size = 36 }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: size * 0.28,
      background: "linear-gradient(135deg, #10b981, #059669)",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 0 16px rgba(16, 185, 129, 0.45)",
      flexShrink: 0,
    }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="7" width="20" height="13" rx="2.5"
          fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.8"/>
        <path d="M2 11h20" stroke="white" strokeWidth="1.8"/>
        <circle cx="17" cy="15.5" r="1.5" fill="white"/>
        <path d="M7 7V6a4 4 0 018 0v1"
          stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

export default function Sidebar() {
  const { saldo, formatarMoeda, perfil, darkMode, toggleDarkMode, logout } = useFinance();
  const navigate = useNavigate();

  return (
    <>
      {/* ===== SIDEBAR DESKTOP ===== */}
      <nav className="sidebar">
        <div className="sidebar-brand">
          <WalletIcon size={36} />
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
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(16,185,129,0.1)"}
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

      {/* ===== MENU MOBILE ===== */}
      <nav className="mobile-nav">
        {/* Header mobile com saldo e ações */}
        <div className="mobile-nav-header">
          <div className="flex items-center gap-8">
            <WalletIcon size={28} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>FinTrack</p>
              <p style={{
                fontSize: 12, fontWeight: 700,
                color: saldo >= 0 ? "#10b981" : "#ef4444"
              }}>
                {formatarMoeda(saldo)}
              </p>
            </div>
          </div>

          <div className="flex gap-8">
            <button
              onClick={toggleDarkMode}
              className="mobile-action-btn"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="mobile-action-btn"
            >
              🚪
            </button>
          </div>
        </div>

        {/* Links com scroll horizontal */}
        <div className="mobile-nav-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) => isActive ? "mobile-nav-item ativo" : "mobile-nav-item"}
            >
              <span className="mobile-nav-icon">{link.icon}</span>
              <span className="mobile-nav-label">{link.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}