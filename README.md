# 🧩 T3 Tasks – Code Challenge

Aplicação **full stack** desenvolvida como parte de um **desafio técnico**, simulando um cenário real de um produto SaaS com autenticação, dashboard e gerenciamento de tarefas, utilizando o **T3 Stack** e boas práticas de arquitetura.

---

## 🎯 Objetivo do Projeto

Desenvolver uma aplicação moderna com **tipagem forte ponta a ponta**, validação centralizada de dados e separação clara de responsabilidades entre frontend e backend, seguindo fielmente os requisitos do desafio proposto.

O foco principal está em **qualidade de código**, **segurança**, **manutenibilidade** e **clareza arquitetural**, simulando decisões que seriam tomadas em um ambiente profissional.

---

## 🛠️ Stack Utilizada

### Obrigatória

* **Next.js (App Router)** – Framework React para aplicações full stack
* **TypeScript** – Tipagem estática e segura
* **tRPC** – Comunicação typesafe entre frontend e backend
* **Drizzle ORM** – Modelagem e acesso ao banco de dados
* **Better Auth** – Autenticação com credenciais (email e senha)
* **Zod** – Validação e tipagem de schemas (fonte única de verdade)
* **Tailwind CSS** – Estilização utilitária e responsiva
* **shadcn/ui** – Componentes reutilizáveis e acessíveis

### Complementares

* **TanStack Table** – Tabelas performáticas
* **Lucide Icons** – Ícones
* **Jest** – Testes automatizados unitários

---

## ✅ Funcionalidades Implementadas

### 🔐 Autenticação

* Cadastro de usuário (Sign Up)
* Login (Sign In)
* Proteção de rotas autenticadas
* Logout
* Validação de todos os inputs com **Zod**

---

### 📊 Dashboard

* Redirecionamento automático após login
* Layout com **sidebar fixa**
* Área principal de conteúdo
* Exibição das informações básicas do usuário autenticado
* Métricas relacionadas às tasks do usuário

---

### 📌 Sidebar

* Link para Dashboard
* Link para Usuários (listagem simples / placeholder)
* Link para Tasks
* Botão de Logout

---

### 📝 CRUD de Tasks

* Criar task
* Listar tasks (com paginação, filtros e ordenação)
* Editar task
* Excluir task (exclusão lógica)

#### Regras de Negócio

* Tasks associadas ao usuário autenticado
* Apenas o **dono da task** pode visualizar, editar ou excluir
* Validação completa de dados no frontend e backend

---

## 🧪 Testes Automatizados

O projeto conta com **testes automatizados unitários**, implementados com **Jest**, focados nas **regras de negócio** e na **validação de dados**, seguindo o princípio de testar aquilo que gera mais valor e estabilidade para a aplicação.

Os testes foram estruturados para serem **rápidos**, **determinísticos** e **independentes de infraestrutura externa**, evitando dependência de banco de dados real ou de camadas de UI.

---

### 🎯 O que é testado

#### ✅ Regras de Negócio (Services)

Testes unitários cobrindo os services responsáveis pelas regras centrais da aplicação, incluindo:

* Criação de tasks
* Atualização de tasks
* Exclusão lógica de tasks
* Regras automáticas de datas (`startedAt` e `resolvedAt`)
* Garantia de acesso apenas ao dono da task
* Tratamento correto de erros (ex: `NOT_FOUND`)

Esses testes utilizam **mocks do Drizzle ORM**, permitindo validar o comportamento das funções de forma isolada, sem dependência de banco de dados real.

---

#### ✅ Funções Utilitárias

Testes específicos para **funções puras**, garantindo previsibilidade e ausência de efeitos colaterais, como:

* Cálculo automático de datas conforme o status da task
* Comportamento esperado ao mudar o status (`PENDING`, `IN_PROGRESS`, `DONE`)
* Garantia de não sobrescrita de datas já existentes

Para testes envolvendo datas, é utilizado o controle de tempo do Jest (`fake timers`), garantindo consistência e resultados determinísticos.

---

#### ✅ Schemas de Validação (Zod)

Testes garantindo que os schemas compartilhem corretamente as regras de validação entre frontend e backend, reforçando o conceito de **schema único como fonte de verdade**.

Schemas testados incluem:

* `taskFormSchema`
* `updateTaskSchema`
* `listTaskSchema`
* `registerSchema`
* `loginSchema`

São validados cenários como:

* Inputs válidos
* Inputs inválidos
* Regras de negócio embutidas nos schemas (ex: confirmação de senha)

---

## 🧠 Decisões Técnicas e Arquiteturais

* **tRPC + Zod** como fonte única de verdade para validação e tipagem
* **Tipagem end-to-end**, evitando duplicação de interfaces
* **Separação clara** entre camadas de UI, domínio e infraestrutura
* Regras de negócio isoladas em **services testáveis**
* Uso consciente de mocks para facilitar testes unitários
* **Componentes reutilizáveis** com shadcn/ui
* Controle de acesso baseado no usuário autenticado

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

* Node.js >= 18
* Gerenciador de pacotes (**pnpm** recomendado)
* Docker instalado e em execução
* WSL configurado (necessário para Windows)

### Passos

1. Clone o repositório

```bash
git clone <url-do-repositorio>
```

2. Instale as dependências

```bash
pnpm install
```

3. Configure as variáveis de ambiente

Crie um arquivo `.env` baseado no `.env.example`

4. Inicie o banco de dados (Docker)

O banco de dados é executado via **Docker**. Certifique-se de que o Docker esteja ativo.

No **Windows**, o script deve ser executado via **WSL**:

```bash
./start-database.sh
```

5. Sincronize o schema com o banco

```bash
pnpm db:push
```

6. Inicie o projeto

```bash
pnpm dev
```

A aplicação estará disponível em:

```
http://localhost:3000
```

---

## 📂 Estrutura de Pastas (visão geral)

A estrutura do projeto foi pensada para garantir **separação clara de responsabilidades**, facilitando manutenção, testes e escalabilidade, seguindo boas práticas adotadas em projetos profissionais.

```txt
src/
├── app/                    # Rotas e páginas (Next.js App Router)
│   ├── (protected)/        # Rotas protegidas por autenticação
│   │   ├── tasks/          # Listagem e ações de tasks
│   │   └── users/          # Placeholder de usuários
│   ├── auth/               # Login e cadastro
│   └── _components/        # Componentes específicos de páginas
│
├── components/
│   └── ui/                 # Componentes reutilizáveis (shadcn/ui)
│
├── schemas/                # Schemas Zod compartilhados
│   └── __tests__/          # Testes de validação
│
├── server/
│   ├── api/                # Backend tRPC
│   │   ├── routers/        # Definição das rotas
│   │   └── services/       # Regras de negócio (testáveis)
│   │       └── __tests__/
│   ├── better-auth/        # Configuração de autenticação
│   └── db/                 # Configuração do banco (Drizzle ORM)
│
├── constants/              # Constantes e enums
├── lib/                    # Funções utilitárias
├── styles/                 # Estilos globais
└── trpc/                   # Cliente tRPC
```

**Principais pontos da organização:**

* Regras de negócio isoladas em `services`, facilitando testes unitários
* Schemas Zod compartilhados entre frontend e backend
* Testes próximos ao código testado (`__tests__`)
* Separação clara entre UI, domínio e infraestrutura

---

## 📄 Considerações Finais

Este projeto foi desenvolvido seguindo **rigorosamente** as exigências do desafio técnico, priorizando:

* Qualidade de código
* Boas práticas internacionais
* Testabilidade
* Segurança
* Escalabilidade

Fique à vontade para explorar o código, executar os testes e sugerir melhorias 🚀
