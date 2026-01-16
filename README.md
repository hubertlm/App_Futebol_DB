# ⚽ Sistema de Gerenciamento de Futebol (BD)

Sistema desenvolvido como projeto da disciplina de Banco de Dados da Universidade Federal do Ceará (UFC). A aplicação gerencia partidas, times, técnicos e árbitros, integrando uma interface React moderna com um banco de dados PostgreSQL.

O diferencial deste projeto é o uso intensivo de recursos nativos do SGBD, como **Roles (Papéis), Views, Stored Procedures e Triggers**.

**Autores:**
* Hubert Luz de Miranda
* Gabriel Amorim Beviláqua Melo
* Mateus Ribeiro Gomes
* Antônio Pedro de Moura Laureno

---

## 🏛️ Arquitetura e Integração com o Banco de Dados

A aplicação segue uma arquitetura de três camadas, onde a segurança e a lógica de negócios são fortemente delegadas ao Banco de Dados.

### Fluxo de Conexão e Segurança (RBAC Nativo)
Diferente de sistemas tradicionais que usam um único "superusuário" para conectar ao banco, este sistema realiza **autenticação dinâmica**:

1.  **Frontend (React):** O usuário insere suas credenciais (ex: `Amorim` ou `Verdancio`).
2.  **Backend (FastAPI):** O Python recebe os dados e tenta abrir uma conexão com o PostgreSQL usando **exatamente** aquele usuário e senha.
3.  **PostgreSQL:** O banco verifica se o usuário existe e quais são suas permissões (`GRANT`/`REVOKE`).
    * Se for `Amorim` (Role: **admin**): O banco permite `INSERT`, `UPDATE`, `DELETE`.
    * Se for `Verdancio` (Role: **analista**): O banco rejeita qualquer tentativa de escrita, permitindo apenas `SELECT`.

### Componentes do Banco Utilizados
* **Triggers:** Validação de dados na inserção de partidas (impede cartões/escanteios negativos) – *Lógica no Banco, não no Backend.*
* **Stored Procedures:** A atualização de técnicos é feita via chamada `CALL atualizar_tecnico(...)`.
* **Views:** O Painel Geral consome dados da view `visao_estatisticas_competicao`.

---

## 🚀 Guia de Execução Passo a Passo

Siga esta ordem estrita para garantir que o banco de dados e as permissões de usuário funcionem corretamente.

### 1. Preparação do Banco de Dados (PostgreSQL)

1.  Crie um banco de dados vazio chamado `futebol_db`.
2.  Execute os scripts SQL originais do trabalho (via PGAdmin ou psql) nesta ordem:
    * `Scripts_postgreSQL-2.pdf` (Criação de Tabelas).
    * `Consultas_visoes.pdf` (Views).
    * `Etapa_7_BD.pdf` (Procedures e Triggers).
