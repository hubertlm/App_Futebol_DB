from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
from typing import Optional, List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_CONFIG = {
    "dbname": "futebol_db",
    "user": "postgres",
    "password": "teste123",
    "host": "localhost",
    "port": "5432"
}

def get_db_connection():
    return psycopg2.connect(**DB_CONFIG)

# --- MODELOS ---
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

# --- CONSULTAS ---

@app.get("/api/partidas")
def listar_partidas():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # CORREÇÃO: Ordenar por ID (num_par) evita erros de formato de data
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
        return [dict(zip(colunas, row)) for row in rows]
    except Exception as e:
        print(f"Erro ao listar partidas: {e}") # Log no terminal
        return []
    finally:
        conn.close()

@app.get("/api/times/{id_time}/detalhes")
def detalhes_time(id_time: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT nome_time, pais_time, sigla, nome_tecnico, vitorias, derrotas, empates FROM time WHERE id_time = %s", (id_time,))
        time_data = cursor.fetchone()
        
        if not time_data:
            return {"erro": "Time não encontrado"}
            
        time_info = dict(zip(['nome', 'pais', 'sigla', 'tecnico', 'vitorias', 'derrotas', 'empates'], time_data))

        # CORREÇÃO: Ordenar por ID do jogo também aqui
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
            historico.append({
                'data': row[0], 
                'competicao': row[1], 
                'gols_marcados': row[2],
                'id_jogo': row[3]
            })

        return {"info": time_info, "historico": historico}
    except Exception as e:
        print(f"Erro ao buscar detalhes do time {id_time}: {e}")
        return {"erro": str(e)}
    finally:
        conn.close()

@app.get("/api/times")
def listar_times():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id_time, nome_time, nome_tecnico, nacionalidade_tecnico, idade_tecnico FROM time ORDER BY nome_time")
        times = cursor.fetchall()
        return [{"id": str(t[0]), "name": t[1], "coach": t[2], "coachNationality": t[3], "coachAge": t[4]} for t in times]
    except Exception: return []
    finally: conn.close()

# --- RELATÓRIOS ---
@app.get("/api/estatisticas")
def get_estatisticas():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM visao_estatisticas_competicao")
        rows = cursor.fetchall()
        res = []
        for row in rows:
            res.append({"competicao": row[0], "total_partidas": row[1], "total_amarelos": row[2], "total_vermelhos": row[3], "media_escanteios": float(row[4]) if row[4] else 0})
        return res
    except Exception: return []
    finally: conn.close()

@app.get("/api/arbitros")
def get_arbitros():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT a.nome_arb, a.pais_arb, COUNT(p.num_par), SUM(p.cartoes_amarelos + p.cartoes_vermelhos) FROM arbitro a LEFT JOIN partida p ON a.id_arb = p.id_arb GROUP BY a.id_arb, a.nome_arb, a.pais_arb")
        rows = cursor.fetchall()
        return [{"nome": r[0], "nacionalidade": r[1], "jogos": r[2], "total_cartoes": r[3] if r[3] else 0} for r in rows]
    except Exception: return []
    finally: conn.close()

@app.get("/api/relatorios/torcedores")
def relatorio_torcedores():
    return executar_consulta("SELECT u.nome_usu, u.pais_usu, e.end_email, t.nome_time FROM usuario u JOIN email e ON u.id_usu = e.id_usu LEFT JOIN favorita_time ft ON u.id_usu = ft.id_usu LEFT JOIN time t ON ft.id_time = t.id_time ORDER BY u.nome_usu ASC", ['Nome', 'Pais', 'Email', 'Time'])

@app.get("/api/relatorios/violencia")
def relatorio_violencia():
    return executar_consulta("SELECT c.nome_comp, p.data_par, p.cartoes_vermelhos, a.nome_arb FROM partida p JOIN competicao c ON p.id_comp = c.id_comp JOIN arbitro a ON p.id_arb = a.id_arb WHERE p.cartoes_vermelhos > ALL (SELECT p2.cartoes_vermelhos FROM partida p2 JOIN arbitro a2 ON p2.id_arb = a2.id_arb WHERE a2.pais_arb = 'Alemanha')", ['Competicao', 'Data', 'Vermelhos', 'Arbitro'])

@app.get("/api/relatorios/indecisos")
def relatorio_indecisos():
    return executar_consulta("SELECT u.nome_usu, u.pais_usu FROM usuario u WHERE EXISTS (SELECT 1 FROM favorita_time ft WHERE ft.id_usu = u.id_usu) AND NOT EXISTS (SELECT 1 FROM favorita_competicao fc WHERE fc.id_usu = u.id_usu)", ['Nome', 'Pais'])

@app.get("/api/relatorios/pacificos")
def relatorio_pacificos():
    return executar_consulta("SELECT a.nome_arb, a.pais_arb FROM arbitro a WHERE EXISTS (SELECT 1 FROM partida p WHERE p.id_arb = a.id_arb) AND NOT EXISTS (SELECT 1 FROM partida p WHERE p.id_arb = a.id_arb AND p.cartoes_vermelhos > 0)", ['Nome', 'Pais'])

# --- ACTIONS ---
@app.put("/api/tecnicos")
def atualizar_tecnico(dados: TecnicoUpdate):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("CALL atualizar_tecnico(%s, %s, %s, %s, %s)", (dados.id_time, str(dados.id_time)+'T', dados.novo_tecnico, dados.idade, dados.nacionalidade))
        conn.commit()
        return {"msg": "Sucesso"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally: conn.close()

@app.post("/api/partidas")
def criar_partida(dados: PartidaCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO partida (num_par, data_par, id_comp, id_arb, escanteios, cartoes_vermelhos, cartoes_amarelos, impedimentos) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", (dados.num_par, dados.data_par, dados.id_comp, dados.id_arb, dados.escanteios, dados.cartoes_vermelhos, dados.cartoes_amarelos, dados.impedimentos))
        cursor.execute("INSERT INTO joga (num_par, data_par, id_comp, id_time, joga) VALUES (%s, %s, %s, %s, %s)", (dados.num_par, dados.data_par, dados.id_comp, dados.id_time_mandante, dados.gols_mandante))
        cursor.execute("INSERT INTO joga (num_par, data_par, id_comp, id_time, joga) VALUES (%s, %s, %s, %s, %s)", (dados.num_par, dados.data_par, dados.id_comp, dados.id_time_visitante, dados.gols_visitante))
        conn.commit()
        return {"msg": "Partida criada"}
    except Exception as e:
        conn.rollback()
        print(f"Erro Insert: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    finally: conn.close()

def executar_consulta(sql, colunas):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(sql)
        return [dict(zip(colunas, row)) for row in cursor.fetchall()]
    except Exception as e: return [{"erro": str(e)}]
    finally: conn.close()