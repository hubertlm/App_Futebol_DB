from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
from psycopg2 import sql

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CORREÇÃO DA LÓGICA DE SESSÃO ---
# Separamos os dados de conexão (DB_PARAMS) dos dados de controle (CURRENT_USER_ROLE)

# 1. Parâmetros de Conexão (Só o que o psycopg2 aceita)
DB_PARAMS = {
    "dbname": "futebol_db",
    "user": "postgres",     # Usuário padrão inicial
    "password": "123",      # Senha padrão inicial
    "host": "localhost",
    "port": "5432"
}

# 2. Estado do Usuário Logado (Para controle da aplicação)
CURRENT_USER_ROLE = "admin" # 'admin' ou 'analista'

def get_db_connection():
    # Conecta usando apenas os parâmetros limpos
    return psycopg2.connect(**DB_PARAMS)

# --- MODELOS ---
class LoginRequest(BaseModel):
    user: str
    password: str

class NewUserRequest(BaseModel):
    username: str
    password: str
    role: str

class TecnicoUpdate(BaseModel):
    id_time: int
    novo_tecnico: str
    nacionalidade: str
    idade: int

class PartidaCreate(BaseModel):
    num_par: int
    data_par: str
    id_comp: int
    id_arb: int
    escanteios: int
    cartoes_vermelhos: int
    cartoes_amarelos: int
    impedimentos: int
    id_time_mandante: int
    gols_mandante: int
    id_time_visitante: int
    gols_visitante: int

# --- ROTA DE LOGIN CORRIGIDA ---

@app.post("/api/login")
def login(dados: LoginRequest):
    global DB_PARAMS, CURRENT_USER_ROLE
    try:
        # 1. Testa a conexão com os dados fornecidos
        # Criamos um dicionário temporário SÓ com dados de conexão
        test_params = DB_PARAMS.copy()
        test_params["user"] = dados.user
        test_params["password"] = dados.password
        
        # Tenta conectar. Se a senha estiver errada, o psycopg2 lança erro aqui.
        conn = psycopg2.connect(**test_params)
        conn.close()
        
        # 2. Se não deu erro, atualizamos a sessão global
        DB_PARAMS["user"] = dados.user
        DB_PARAMS["password"] = dados.password
        
        # 3. Define o papel (Role) baseado no nome
        # Postgres e Amorim são Admins. Verdancio é Analista.
        if dados.user.lower() in ['postgres', 'amorim']:
            CURRENT_USER_ROLE = 'admin'
        else:
            CURRENT_USER_ROLE = 'analista'
            
        print(f"✅ Login SUCESSO: {dados.user} como {CURRENT_USER_ROLE}")
        return {"msg": "Login ok", "role": CURRENT_USER_ROLE, "user": dados.user}
        
    except psycopg2.Error as e:
        print(f"❌ Login FALHOU para {dados.user}: {e}")
        # Retorna 401 para o frontend saber que a senha está errada
        raise HTTPException(status_code=401, detail="Usuário ou senha incorretos.")
    except Exception as e:
        print(f"❌ Erro Genérico: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- ROTA DE CRIAÇÃO DE USUÁRIOS (ADMIN) ---

@app.post("/api/admin/create_user")
def create_user(dados: NewUserRequest):
    # Verifica permissão na aplicação
    if CURRENT_USER_ROLE != 'admin':
        raise HTTPException(status_code=403, detail="Apenas Administradores podem criar usuários.")

    conn = get_db_connection()
    conn.autocommit = True
    cursor = conn.cursor()
    try:
        # Cria o usuário no PostgreSQL
        cursor.execute(sql.SQL("CREATE USER {} WITH PASSWORD {} IN ROLE {};").format(
            sql.Identifier(dados.username),
            sql.Literal(dados.password),
            sql.Identifier(dados.role)
        ))
        
        # Garante permissão de conexão
        cursor.execute(sql.SQL("GRANT CONNECT ON DATABASE futebol_db TO {};").format(
            sql.Identifier(dados.username)
        ))

        return {"msg": f"Usuário {dados.username} criado com sucesso!"}
    except Exception as e:
        # Se der erro (ex: usuário já existe, ou falta de permissão do banco)
        return {"erro": str(e)}
    finally:
        conn.close()

# --- DEMAIS ROTAS ---

@app.get("/api/partidas")
def listar_partidas():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT p.num_par, p.data_par, c.nome_comp, a.nome_arb, 
                   p.escanteios, p.cartoes_amarelos, p.cartoes_vermelhos
            FROM partida p
            JOIN competicao c ON p.id_comp = c.id_comp
            JOIN arbitro a ON p.id_arb = a.id_arb
            ORDER BY p.num_par DESC
        """)
        rows = cursor.fetchall()
        colunas = ['id', 'data', 'competicao', 'arbitro', 'escanteios', 'amarelos', 'vermelhos']
        conn.close()
        return [dict(zip(colunas, row)) for row in rows]
    except Exception as e:
        print(f"Erro Partidas: {e}")
        return []

@app.get("/api/times")
def listar_times():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id_time, nome_time, nome_tecnico, nacionalidade_tecnico, idade_tecnico FROM time ORDER BY nome_time")
        times = cursor.fetchall()
        conn.close()
        return [{"id": str(t[0]), "name": t[1], "coach": t[2], "coachNationality": t[3], "coachAge": t[4]} for t in times]
    except Exception: return []

@app.get("/api/times/{id_time}/detalhes")
def detalhes_time(id_time: int):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT nome_time, pais_time, sigla, nome_tecnico, vitorias, derrotas, empates FROM time WHERE id_time = %s", (id_time,))
        time_data = cursor.fetchone()
        
        if not time_data: 
            conn.close()
            return {"erro": "Time não encontrado"}
            
        time_info = dict(zip(['nome', 'pais', 'sigla', 'tecnico', 'vitorias', 'derrotas', 'empates'], time_data))

        cursor.execute("""
            SELECT p.data_par, c.nome_comp, j.gols, p.num_par 
            FROM joga j
            JOIN partida p ON j.num_par = p.num_par AND j.data_par = p.data_par AND j.id_comp = p.id_comp
            JOIN competicao c ON p.id_comp = c.id_comp
            WHERE j.id_time = %s
            ORDER BY p.num_par DESC
        """, (id_time,))
        
        historico = []
        for row in cursor.fetchall():
            historico.append({'data': row[0], 'competicao': row[1], 'gols_marcados': row[2], 'id_jogo': row[3]})
        
        conn.close()
        return {"info": time_info, "historico": historico}
    except Exception as e:
        return {"erro": str(e)}

# --- RELATÓRIOS ---
@app.get("/api/relatorios/torcedores")
def relatorio_torcedores(): return executar_consulta("SELECT u.nome_usu, u.pais_usu, e.end_email, t.nome_time FROM usuario u JOIN email e ON u.id_usu = e.id_usu LEFT JOIN favorita_time ft ON u.id_usu = ft.id_usu LEFT JOIN time t ON ft.id_time = t.id_time ORDER BY u.nome_usu ASC", ['Nome', 'Pais', 'Email', 'Time'])
@app.get("/api/relatorios/violencia")
def relatorio_violencia(): return executar_consulta("SELECT c.nome_comp, p.data_par, p.cartoes_vermelhos, a.nome_arb FROM partida p JOIN competicao c ON p.id_comp = c.id_comp JOIN arbitro a ON p.id_arb = a.id_arb WHERE p.cartoes_vermelhos > ALL (SELECT p2.cartoes_vermelhos FROM partida p2 JOIN arbitro a2 ON p2.id_arb = a2.id_arb WHERE a2.pais_arb = 'Alemanha')", ['Competicao', 'Data', 'Vermelhos', 'Arbitro'])
@app.get("/api/relatorios/indecisos")
def relatorio_indecisos(): return executar_consulta("SELECT u.nome_usu, u.pais_usu FROM usuario u WHERE EXISTS (SELECT 1 FROM favorita_time ft WHERE ft.id_usu = u.id_usu) AND NOT EXISTS (SELECT 1 FROM favorita_competicao fc WHERE fc.id_usu = u.id_usu)", ['Nome', 'Pais'])
@app.get("/api/relatorios/pacificos")
def relatorio_pacificos(): return executar_consulta("SELECT a.nome_arb, a.pais_arb FROM arbitro a WHERE EXISTS (SELECT 1 FROM partida p WHERE p.id_arb = a.id_arb) AND NOT EXISTS (SELECT 1 FROM partida p WHERE p.id_arb = a.id_arb AND p.cartoes_vermelhos > 0)", ['Nome', 'Pais'])
@app.get("/api/arbitros")
def get_arbitros(): return executar_consulta("SELECT a.nome_arb, a.pais_arb, COUNT(p.num_par), SUM(p.cartoes_amarelos + p.cartoes_vermelhos) FROM arbitro a LEFT JOIN partida p ON a.id_arb = p.id_arb GROUP BY a.id_arb, a.nome_arb, a.pais_arb", ['nome', 'nacionalidade', 'jogos', 'total_cartoes'])

@app.get("/api/estatisticas")
def get_estatisticas():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM visao_estatisticas_competicao")
        res = [{"competicao": r[0], "total_partidas": r[1], "total_amarelos": r[2], "total_vermelhos": r[3], "media_escanteios": float(r[4])} for r in cursor.fetchall()]
        conn.close()
        return res
    except Exception: return []

# --- INSERTS / UPDATES ---
@app.put("/api/tecnicos")
def atualizar_tecnico(dados: TecnicoUpdate):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("CALL atualizar_tecnico(%s, %s, %s, %s, %s)", (dados.id_time, str(dados.id_time)+'T', dados.novo_tecnico, dados.idade, dados.nacionalidade))
        conn.commit()
        conn.close()
        return {"msg": "Sucesso"}
    except Exception as e:
        raise HTTPException(status_code=403, detail=f"Erro de Permissão: {str(e)}")

@app.post("/api/partidas")
def criar_partida(dados: PartidaCreate):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO partida (num_par, data_par, id_comp, id_arb, escanteios, cartoes_vermelhos, cartoes_amarelos, impedimentos) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", (dados.num_par, dados.data_par, dados.id_comp, dados.id_arb, dados.escanteios, dados.cartoes_vermelhos, dados.cartoes_amarelos, dados.impedimentos))
        cursor.execute("INSERT INTO joga (num_par, data_par, id_comp, id_time, gols) VALUES (%s, %s, %s, %s, %s)", (dados.num_par, dados.data_par, dados.id_comp, dados.id_time_mandante, dados.gols_mandante))
        cursor.execute("INSERT INTO joga (num_par, data_par, id_comp, id_time, gols) VALUES (%s, %s, %s, %s, %s)", (dados.num_par, dados.data_par, dados.id_comp, dados.id_time_visitante, dados.gols_visitante))
        conn.commit()
        conn.close()
        return {"msg": "Partida criada"}
    except Exception as e:
        raise HTTPException(status_code=403, detail=f"Erro de Permissão: {str(e)}")

def executar_consulta(sql, colunas):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(sql)
        res = [dict(zip(colunas, row)) for row in cursor.fetchall()]
        conn.close()
        return res
    except Exception as e: return [{"erro": str(e)}]