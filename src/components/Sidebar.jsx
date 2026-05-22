import { NavLink, useNavigate } from "react-router-dom";
import { useFinance } from "../context/FinanceContext";
import {
  Home, LayoutDashboard, ArrowLeftRight, PlusCircle,
  Target, PieChart, UserCircle, Moon, Sun, LogOut, Wallet
} from "lucide-react";
import "./Sidebar.css";

const links = [
  { to: "/",             label: "Home",       icon: Home },
  { to: "/dashboard",    label: "Dashboard",  icon: LayoutDashboard },
  { to: "/transactions", label: "Transações", icon: ArrowLeftRight },
  { to: "/new",          label: "Nova",       icon: PlusCircle },
  { to: "/goals",        label: "Metas",      icon: Target },
  { to: "/categories",   label: "Categorias", icon: PieChart },
  { to: "/profile",      label: "Perfil",     icon: UserCircle },
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
      <Wallet size={size * 0.55} color="white" strokeWidth={1.8} />
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
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) => isActive ? "nav-link ativo" : "nav-link"}
                >
                  <Icon size={16} strokeWidth={1.8} />
                  <span>{link.label}</span>
                </NavLink>
              </li>
            );
          })}
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
          {darkMode ? <Sun size={16} strokeWidth={1.8} /> : <Moon size={16} strokeWidth={1.8} />}
          <span>{darkMode ? "Modo Claro" : "Modo Escuro"}</span>
        </button>

        <div className="sidebar-avatar">
          <div className="avatar-circle">{perfil.avatar}</div>
          <span>{perfil.nome.split(" ")[0]}</span>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            style={{
              marginLeft: "auto", background: "none", border: "none",
              cursor: "pointer", opacity: 0.5, transition: "opacity 0.15s",
              display: "flex", alignItems: "center", color: "rgba(255,255,255,0.55)"
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
            onMouseLeave={(e) => e.currentTarget.style.opacity = 0.5}
            title="Sair"
          >
            <LogOut size={16} strokeWidth={1.8} />
          </button>
        </div>
      </nav>

      {/* ===== MENU MOBILE ===== */}
      <nav className="mobile-nav">
        <div className="mobile-nav-header">
          <div className="flex items-center gap-8">
            <WalletIcon size={28} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>FinTrack</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: saldo >= 0 ? "#10b981" : "#ef4444" }}>
                {formatarMoeda(saldo)}
              </p>
            </div>
          </div>

          <div className="flex gap-8">
            <button onClick={toggleDarkMode} className="mobile-action-btn">
              {darkMode
                ? <Sun size={16} strokeWidth={1.8} color="rgba(255,255,255,0.7)" />
                : <Moon size={16} strokeWidth={1.8} color="rgba(255,255,255,0.7)" />
              }
            </button>
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="mobile-action-btn"
            >
              <LogOut size={16} strokeWidth={1.8} color="rgba(255,255,255,0.7)" />
            </button>
          </div>
        </div>

        <div className="mobile-nav-links">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) => isActive ? "mobile-nav-item ativo" : "mobile-nav-item"}
              >
                <Icon size={20} strokeWidth={1.8} />
                <span className="mobile-nav-label">{link.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
}