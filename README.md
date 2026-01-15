# ⚽ Sistema de Gerenciamento de Futebol (BD)

Sistema desenvolvido como projeto da disciplina de Banco de Dados da Universidade Federal do Ceará (UFC). A aplicação gerencia partidas, times, técnicos e árbitros, integrando uma interface React moderna com um banco de dados PostgreSQL, utilizando Views, Stored Procedures, Triggers e Consultas Avançadas.

**Autores:**
* Hubert Luz de Miranda
* Gabriel Amorim Beviláqua Melo
* Mateus Ribeiro Gomes
* Antônio Pedro de Moura Laureno

---

## 🚀 Tecnologias Utilizadas

* **Frontend:** React, TypeScript, Vite, Tailwind CSS, Shadcn UI, Recharts.
* **Backend:** Python (FastAPI), Uvicorn, Psycopg2.
* **Banco de Dados:** PostgreSQL.

---

## 📋 Pré-requisitos

Certifique-se de ter instalado:
* [PostgreSQL](https://www.postgresql.org/) (Porta padrão 5432)
* [Python 3.8+](https://www.python.org/)
* [Node.js](https://nodejs.org/) (v16 ou superior)

---

## ⚙️ Configuração e Instalação

### Passo 1: Banco de Dados

1.  Crie um banco de dados no PostgreSQL chamado `futebol_db`.
2.  Execute os scripts SQL na seguinte ordem (usando PGAdmin ou `psql`):
    * `Scripts_postgreSQL-2.pdf` (Criação de Tabelas e Inserção de Dados).
    * `Consultas_visoes.pdf` (Criação da View).
    * `Etapa_7_BD.pdf` (Stored Procedures, Triggers e Usuários).
