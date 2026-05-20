import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { FinanceProvider, useFinance } from "./context/FinanceContext";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import NewTransaction from "./pages/NewTransaction";
import Goals from "./pages/Goals";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

function RotasProtegidas() {
  const { usuarioLogado } = useFinance();

  if (!usuarioLogado) return <Navigate to="/login" />;

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/new" element={<NewTransaction />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <FinanceProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<RotasProtegidas />} />
        </Routes>
      </Router>
    </FinanceProvider>
  );
}

export default App;