# 💎 FinTrack – Gestão Financeira Pessoal

Aplicação web de controle financeiro pessoal desenvolvida com **React JS**, como projeto final da disciplina de Desenvolvimento Web – UNINASSAU.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-latest-FF0055)
![Lucide](https://img.shields.io/badge/Lucide_React-latest-F56565)

---

## 🚀 Deploy

Acesse a aplicação em produção:  
👉 **[fintrack-viniciusteles06.vercel.app](https://fintrack-viniciusteles06.vercel.app)**

---

## 📋 Funcionalidades

- 🔐 **Autenticação** — Login e cadastro de usuários com rotas protegidas
- 🏠 **Home** — Resumo financeiro e últimas transações
- 📊 **Dashboard** — Gráfico de barras com receitas vs despesas dos últimos 4 meses
- 📋 **Transações** — Listagem com filtros, busca, edição e exclusão
- ➕ **Nova Transação** — Formulário com prévia em tempo real
- 🎯 **Metas** — Criação e acompanhamento de metas com sistema de aporte
- 🥧 **Categorias** — Gráfico de pizza com distribuição por categoria
- 👤 **Perfil** — Edição de dados e estatísticas do usuário
- 🌙 **Dark/Light Mode** — Alternância de tema salva no localStorage
- 📱 **Responsivo** — Menu inferior para mobile

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| React 18 | Biblioteca principal |
| React Router DOM v6 | Navegação entre as 9 páginas |
| Framer Motion | Animações de transição entre páginas |
| Lucide React | Ícones vetoriais profissionais |
| Vite 5 | Bundler e servidor de desenvolvimento |
| localStorage | Persistência de dados no navegador |
| CSS puro | Estilização com variáveis e dark mode |

---

## ⚛️ Conceitos do React aplicados

- ✅ **useState** — formulários, filtros, modais, dark mode
- ✅ **useContext** — estado global de transações, metas e perfil
- ✅ **useEffect** — sincronização com localStorage e tema
- ✅ **props** — passagem de dados entre componentes
- ✅ **React Router v6** — 9 páginas com NavLink ativo e rotas protegidas
- ✅ **Componentes reutilizáveis** — Sidebar, PageWrapper, GoalCompleteModal

---

## 🗂️ Estrutura do projeto

fintrack/
├── index.html
├── package.json
├── vite.config.js
└── src/
├── main.jsx
├── App.jsx
├── App.css
├── context/
│   └── FinanceContext.jsx
├── components/
│   ├── Sidebar.jsx
│   ├── Sidebar.css
│   ├── PageWrapper.jsx
│   └── GoalCompleteModal.jsx
└── pages/
├── Home.jsx
├── Dashboard.jsx
├── Transactions.jsx
├── NewTransaction.jsx
├── Goals.jsx
├── Categories.jsx
├── Profile.jsx
├── Login.jsx
└── Register.jsx

---

## ⚙️ Como instalar e executar

### Pré-requisitos
- Node.js 18 ou superior
- npm

### Passos

```bash
# Clone o repositório
git clone https://github.com/ViniciusTeles06/fintrack.git

# Entre na pasta
cd fintrack

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em `http://localhost:5173`

---

## 📅 Informações acadêmicas

- **Instituição:** UNINASSAU
- **Disciplina:** Desenvolvimento Web com React JS
- **Professor:** Victor Brunno
- **Prazo de entrega:** 08 de junho de 2026
