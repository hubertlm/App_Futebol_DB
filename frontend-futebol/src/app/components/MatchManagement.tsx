import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Save, AlertCircle, CheckCircle, Calendar, RefreshCcw, Lock } from 'lucide-react';

// Aceita a prop 'userRole' vinda do App.tsx
export const MatchManagement = ({ userRole }: { userRole: string }) => {
  const [matches, setMatches] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]); 
  const [formData, setFormData] = useState({
    matchId: '', date: '', competition: '', referee: '',
    corners: '', redCards: '', yellowCards: '', offsides: '',
    homeTeam: '', homeGoals: '', awayTeam: '', awayGoals: ''
  });
  const [status, setStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    fetchMatches();
    fetch('http://localhost:8000/api/times')
      .then(r => r.json())
      .then(data => { if(Array.isArray(data)) setTeams(data); })
      .catch(console.error);
  }, []);

  const fetchMatches = () => {
    fetch('http://localhost:8000/api/partidas')
      .then(r => r.json())
      .then(data => { if(Array.isArray(data)) setMatches(data); })
      .catch(console.error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', msg: 'Salvando...' });

    if (!formData.homeTeam || !formData.awayTeam) {
        setStatus({ type: 'error', msg: 'Selecione os dois times!' });
        return;
    }

    const dataParts = formData.date.split('-');
    const dataFormatada = `${dataParts[2]}/${dataParts[1]}/${dataParts[0]}`;

    const payload = {
      num_par: parseInt(formData.matchId),
      data_par: dataFormatada,
      id_comp: parseInt(formData.competition),
      id_arb: parseInt(formData.referee),
      escanteios: parseInt(formData.corners),
      cartoes_vermelhos: parseInt(formData.redCards),
      cartoes_amarelos: parseInt(formData.yellowCards),
      impedimentos: parseInt(formData.offsides),
      id_time_mandante: parseInt(formData.homeTeam),
      gols_mandante: parseInt(formData.homeGoals),
      id_time_visitante: parseInt(formData.awayTeam),
      gols_visitante: parseInt(formData.awayGoals)
    };

    try {
      const response = await fetch('http://localhost:8000/api/partidas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.detail || "Erro no servidor");

      setStatus({ type: 'success', msg: '✅ Jogo salvo com sucesso!' });
      fetchMatches(); 
    } catch (error: any) {
      setStatus({ type: 'error', msg: `⛔ Erro: ${error.message}` });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const getTeamName = (id: string) => teams.find(t => String(t.id) === String(id))?.name;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Partidas</h1>
        <p className="text-zinc-400">
          {userRole === 'admin' 
            ? "Cadastre novas partidas ou consulte o histórico." 
            : "Consulte o histórico de partidas registradas."}
        </p>
      </div>

      {/* BLOCO DE CADASTRO: SÓ APARECE SE FOR ADMIN */}
      {userRole === 'admin' ? (
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="text-white flex gap-2">
              <Save className="text-emerald-500"/> Criar Partida & Placar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {status.msg && (
                <div className={`p-3 rounded text-sm border ${status.type === 'error' ? 'bg-red-950/50 border-red-800 text-red-400' : 'bg-emerald-950/50 border-emerald-800 text-emerald-400'}`}>
                  {status.msg}
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-zinc-800">
                <div><Label>ID Jogo</Label><Input id="matchId" type="number" onChange={handleChange} required className="bg-zinc-950 border-zinc-800 text-white"/></div>
                <div><Label>Data</Label><Input id="date" type="date" onChange={handleChange} required className="bg-zinc-950 border-zinc-800 text-white w-full"/></div>
                <div><Label>ID Competição</Label><Input id="competition" type="number" onChange={handleChange} required className="bg-zinc-950 border-zinc-800 text-white"/></div>
                <div><Label>ID Árbitro</Label><Input id="referee" type="number" onChange={handleChange} required className="bg-zinc-950 border-zinc-800 text-white"/></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center">
                  <div className="space-y-2 p-4 bg-zinc-950/50 rounded border border-zinc-800">
                      <Label className="text-emerald-500 font-bold">Mandante (Casa)</Label>
                      <Select value={formData.homeTeam} onValueChange={(v: string) => setFormData({...formData, homeTeam: v})}>
                          <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white"><SelectValue placeholder={getTeamName(formData.homeTeam) || "Selecione..."} /></SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-800 text-white h-48">{teams.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)}</SelectContent>
                      </Select>
                      <Label>Gols</Label>
                      <Input id="homeGoals" type="number" onChange={handleChange} required className="bg-zinc-900 border-zinc-800 text-white"/>
                  </div>
                  <div className="space-y-2 p-4 bg-zinc-950/50 rounded border border-zinc-800">
                      <Label className="text-red-500 font-bold">Visitante (Fora)</Label>
                      <Select value={formData.awayTeam} onValueChange={(v: string) => setFormData({...formData, awayTeam: v})}>
                          <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white"><SelectValue placeholder={getTeamName(formData.awayTeam) || "Selecione..."} /></SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-800 text-white h-48">{teams.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)}</SelectContent>
                      </Select>
                      <Label>Gols</Label>
                      <Input id="awayGoals" type="number" onChange={handleChange} required className="bg-zinc-900 border-zinc-800 text-white"/>
                  </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                 {['corners', 'redCards', 'yellowCards', 'offsides'].map(f => (
                   <div key={f}><Label className="text-xs uppercase text-zinc-500">{f}</Label><Input id={f} type="number" onChange={handleChange} required className="bg-zinc-950 border-zinc-800 text-white"/></div>
                 ))}
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12">Salvar Jogo Completo</Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        // MENSAGEM PARA ANALISTA
        <div className="p-4 bg-blue-950/30 border border-blue-900 rounded-lg flex items-center gap-3 text-blue-400">
           <Lock size={20} />
           <span>Modo de Leitura: A criação de partidas está restrita a Administradores.</span>
        </div>
      )}

      {/* HISTÓRICO (VISÍVEL PARA TODOS) */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex gap-2"><Calendar className="text-emerald-500"/> Jogos Recentes</CardTitle>
          <Button variant="ghost" size="icon" onClick={fetchMatches} className="text-zinc-400 hover:text-white"><RefreshCcw size={16}/></Button>
        </CardHeader>
        <CardContent>
           <div className="max-h-[300px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-400">Data</TableHead>
                  <TableHead className="text-zinc-400">Torneio</TableHead>
                  <TableHead className="text-zinc-400">Juiz</TableHead>
                  <TableHead className="text-right text-zinc-400">Estatísticas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-4 text-zinc-500">Nenhuma partida encontrada.</TableCell></TableRow>
                ) : (
                  matches.map((m, i) => (
                    <TableRow key={i} className="border-zinc-800 text-zinc-300 hover:bg-zinc-800/50">
                      <TableCell>{m.data}</TableCell>
                      <TableCell className="text-white font-medium">{m.competicao}</TableCell>
                      <TableCell>{m.arbitro}</TableCell>
                      <TableCell className="text-right text-xs">
                        Esc: {m.escanteios} | <span className="text-yellow-500">CA: {m.amarelos}</span> | <span className="text-red-500">CV: {m.vermelhos}</span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
           </div>
        </CardContent>
      </Card>
    </div>
  );
};