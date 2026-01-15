import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { UserCog, Database, CheckCircle2, AlertCircle } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  coach: string;
  coachNationality: string;
  coachAge: number;
}

export const TechnicalStaffManager = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [formData, setFormData] = useState({
    teamId: '', coachName: '', nationality: '', age: '',
  });
  const [status, setStatus] = useState({ type: '', msg: '' });

  // Carregar times ao iniciar
  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/times');
      const data = await res.json();
      setTeams(data);
    } catch (err) {
      console.error("Erro ao carregar times", err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', msg: 'Processando...' });

    try {
      const response = await fetch('http://localhost:8000/api/tecnicos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_time: parseInt(formData.teamId),
          novo_tecnico: formData.coachName,
          nacionalidade: formData.nationality,
          idade: parseInt(formData.age)
        }),
      });

      if (!response.ok) throw new Error('Erro na atualização');

      setStatus({ type: 'success', msg: 'Técnico atualizado com sucesso!' });
      setFormData({ teamId: '', coachName: '', nationality: '', age: '' });
      fetchTeams(); // Recarrega a lista para mostrar o novo técnico
    } catch (error) {
      setStatus({ type: 'error', msg: 'Falha ao atualizar técnico.' });
    }
  };

  // Lógica para mostrar o nome do time selecionado no botão
  const selectedTeamName = teams.find(t => t.id === formData.teamId)?.name;
  const currentCoachInfo = teams.find(t => t.id === formData.teamId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Equipe Técnica</h1>
        <p className="text-zinc-400">Atualização via Stored Procedure</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Database className="h-5 w-5 text-emerald-500" />
                Atualizar Técnico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-6">
                {status.msg && (
                  <div className={`p-4 rounded border flex items-center gap-2 ${status.type === 'success' ? 'bg-emerald-950/30 border-emerald-800 text-emerald-400' : 'bg-red-950/30 border-red-800 text-red-400'}`}>
                    {status.type === 'success' ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}
                    {status.msg}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Selecione o Time</Label>
                  <Select value={formData.teamId} onValueChange={(val: string) => setFormData({...formData, teamId: val})}>
                    <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white">
                      <SelectValue placeholder={selectedTeamName || "Selecione..."} />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-zinc-800 text-white max-h-[200px] overflow-auto">
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {currentCoachInfo && (
                  <div className="p-3 bg-zinc-800/50 rounded border border-zinc-700 text-sm">
                    <span className="text-zinc-400">Técnico Atual: </span>
                    <span className="text-white font-bold">{currentCoachInfo.coach}</span>
                  </div>
                )}

                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <Label className="text-emerald-400 font-bold">Dados do Novo Técnico</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <Label>Nome Completo</Label>
                        <Input value={formData.coachName} onChange={e => setFormData({...formData, coachName: e.target.value})} className="bg-zinc-950 border-zinc-800 text-white" required />
                    </div>
                    <div>
                        <Label>Nacionalidade</Label>
                        <Input value={formData.nationality} onChange={e => setFormData({...formData, nationality: e.target.value})} className="bg-zinc-950 border-zinc-800 text-white" required />
                    </div>
                    <div>
                        <Label>Idade</Label>
                        <Input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="bg-zinc-950 border-zinc-800 text-white" required />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full md:w-auto">Salvar Alterações</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-zinc-800 bg-zinc-900/50 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><UserCog className="h-5 w-5"/> Lista Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[500px] overflow-auto pr-2">
                {teams.map((team) => (
                  <div key={team.id} className="p-3 bg-zinc-950 border border-zinc-800 rounded hover:border-emerald-900 transition-colors">
                    <div className="font-bold text-emerald-500">{team.name}</div>
                    <div className="text-sm text-zinc-400">{team.coach}</div>
                    <div className="text-xs text-zinc-600 mt-1">{team.coachNationality} • {team.coachAge} anos</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};