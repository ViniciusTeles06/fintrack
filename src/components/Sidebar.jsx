import { NavLink } from "react-router-dom";
import { useFinance } from "../context/FinanceContext";
import "./Sidebar.css";

const links = [
  { to: "/",            label: "Home",           icon: "🏠" },
  { to: "/dashboard",   label: "Dashboard",      icon: "📊" },
  { to: "/transactions",label: "Transações",     icon: "📋" },
  { to: "/new",         label: "Nova Transação", icon: "➕" },
  { to: "/profile",     label: "Perfil",         icon: "👤" },
];

export default function Sidebar() {
  const { saldo, formatarMoeda, perfil } = useFinance();

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

      <div className="sidebar-avatar">
        <div className="avatar-circle">{perfil.avatar}</div>
        <span>{perfil.nome.split(" ")[0]}</span>
      </div>
    </nav>
  );
}