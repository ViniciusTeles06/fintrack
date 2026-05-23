import { createContext, useContext, useState, useEffect } from "react";

const FinanceContext = createContext();

function carregarStorage(chave, valorPadrao) {
  try {
    const salvo = localStorage.getItem(chave);
    return salvo ? JSON.parse(salvo) : valorPadrao;
  } catch {
    return valorPadrao;
  }
}

export function FinanceProvider({ children }) {
  const [transacoes, setTransacoes] = useState(() =>
    carregarStorage("fintrack_transacoes", [])
  );

  const [metas, setMetas] = useState(() =>
    carregarStorage("fintrack_metas", [])
  );

  const [perfil, setPerfil] = useState(() =>
    carregarStorage("fintrack_perfil", {
      nome: "",
      email: "",
      avatar: "",
    })
  );

  const [darkMode, setDarkMode] = useState(() =>
    carregarStorage("fintrack_darkmode", true)
  );

  const [usuarioLogado, setUsuarioLogado] = useState(() =>
    carregarStorage("fintrack_logado", false)
  );

  const [usuarios, setUsuarios] = useState(() =>
    carregarStorage("fintrack_usuarios", [])
  );

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const login = (email, senha) => {
    const usuario = usuarios.find(
      (u) => u.email === email && u.senha === senha
    );
    if (!usuario) return { sucesso: false, erro: "E-mail ou senha incorretos." };
    setUsuarioLogado(true);
    setPerfil({
      nome: usuario.nome,
      email: usuario.email,
      avatar: usuario.nome.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
    });
    return { sucesso: true };
  };

  const register = (nome, email, senha) => {
    const existe = usuarios.find((u) => u.email === email);
    if (existe) return { sucesso: false, erro: "E-mail já cadastrado." };
    const novoUsuario = { nome, email, senha };
    setUsuarios((prev) => [...prev, novoUsuario]);
    setUsuarioLogado(true);

    // Limpa os dados ao cadastrar novo usuário
    setTransacoes([]);
    setMetas([]);

    setPerfil({
      nome,
      email,
      avatar: nome.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
    });
    return { sucesso: true };
  };

  const logout = () => {
    setUsuarioLogado(false);
    // Limpa os dados ao sair
    setTransacoes([]);
    setMetas([]);
  };

  useEffect(() => {
    localStorage.setItem("fintrack_transacoes", JSON.stringify(transacoes));
  }, [transacoes]);

  useEffect(() => {
    localStorage.setItem("fintrack_metas", JSON.stringify(metas));
  }, [metas]);

  useEffect(() => {
    localStorage.setItem("fintrack_perfil", JSON.stringify(perfil));
  }, [perfil]);

  useEffect(() => {
    localStorage.setItem("fintrack_darkmode", JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("fintrack_logado", JSON.stringify(usuarioLogado));
  }, [usuarioLogado]);

  useEffect(() => {
    localStorage.setItem("fintrack_usuarios", JSON.stringify(usuarios));
  }, [usuarios]);

  const adicionarTransacao = (transacao) => {
    setTransacoes((prev) => [{ ...transacao, id: Date.now() }, ...prev]);
  };

  const removerTransacao = (id) => {
    setTransacoes((prev) => prev.filter((t) => t.id !== id));
  };

  const editarTransacao = (id, dadosNovos) => {
    setTransacoes((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...dadosNovos, valor: parseFloat(dadosNovos.valor) } : t
      )
    );
  };

  const adicionarMeta = (meta) => {
    setMetas((prev) => [...prev, { ...meta, id: Date.now(), valorAtual: 0 }]);
  };

  const atualizarMeta = (id, valor) => {
    setMetas((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, valorAtual: Math.min(m.valorAtual + valor, m.valorAlvo) } : m
      )
    );
  };

  const removerMeta = (id) => {
    setMetas((prev) => prev.filter((m) => m.id !== id));
  };

  const totalReceitas = transacoes
    .filter((t) => t.tipo === "receita")
    .reduce((acc, t) => acc + t.valor, 0);

  const totalDespesas = transacoes
    .filter((t) => t.tipo === "despesa")
    .reduce((acc, t) => acc + t.valor, 0);

  const saldo = totalReceitas - totalDespesas;

  const formatarMoeda = (valor) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

  return (
    <FinanceContext.Provider value={{
      transacoes, metas, perfil, setPerfil,
      adicionarTransacao, removerTransacao, editarTransacao,
      adicionarMeta, atualizarMeta, removerMeta,
      totalReceitas, totalDespesas, saldo, formatarMoeda,
      darkMode, toggleDarkMode,
      usuarioLogado, login, register, logout,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}