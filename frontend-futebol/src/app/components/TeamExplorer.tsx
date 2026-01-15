import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { Search, Trophy, Frown, Minus, User, AlertTriangle } from 'lucide-react';

export const TeamExplorer = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string>('');

  // Carregar lista de times
  useEffect(() => {
    fetch('http://localhost:8000/api/times')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTeams(data);
        } else {
          console.error("Erro ao carregar times:", data);
        }
      })
      .catch(error => setError("Erro de conexão ao buscar times."));
  }, []);

  // Carregar detalhes do time selecionado
  useEffect(() => {
    if (!selectedId) return;
    
    setDetails(null);
    setError('');

    fetch(`http://localhost:8000/api/times/${selectedId}/detalhes`)
      .then(res => res.json())
      .then(data => {
        if (data.erro) {
          setError(data.erro); // Exibe o erro do Backend na tela
        } else {
          setDetails(data);
        }
      })
      .catch(err => setError("Falha ao carregar detalhes do time. Verifique o Backend."));
  }, [selectedId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Explorador de Clubes</h1>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Search className="text-zinc-500" />
            <Select onValueChange={setSelectedId}>
              <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 text-white">
                <SelectValue placeholder="Selecione um clube para investigar..." />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-zinc-800 text-white h-60">
                {teams.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Exibição de Erro na Tela */}
      {error && (
        <div className="p-4 bg-red-950/30 border border-red-800 rounded-lg flex items-center gap-3 text-red-400 animate-in fade-in">
          <AlertTriangle />
          <span>{error}</span>
        </div>
      )}

      {/* Exibição dos Detalhes */}
      {details && details.info && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-300">
          
          {/* Cartão de Perfil */}
          <Card className="md:col-span-1 border-zinc-800 bg-zinc-900/50 h-fit">
            <CardHeader className="text-center pb-2">
              <div className="w-20 h-20 bg-zinc-800 rounded-full mx-auto flex items-center justify-center text-4xl mb-2">🛡️</div>
              <CardTitle className="text-2xl text-white">{details.info.nome}</CardTitle>
              <Badge variant="outline" className="w-fit mx-auto border-emerald-600 text-emerald-400">
                {details.info.sigla} • {details.info.pais}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
               <div className="p-3 bg-zinc-950 rounded border border-zinc-800 flex gap-3 items-center">
                 <User className="text-zinc-500"/>
                 <div><p className="text-xs text-zinc-500">Técnico</p><p className="font-bold text-white">{details.info.tecnico}</p></div>
               </div>
               <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-emerald-950/30 border border-emerald-900 rounded"><span className="block font-bold text-white text-lg">{details.info.vitorias}</span><span className="text-[10px] text-zinc-400">Vitórias</span></div>
                  <div className="p-2 bg-zinc-950 border border-zinc-800 rounded"><span className="block font-bold text-white text-lg">{details.info.empates}</span><span className="text-[10px] text-zinc-400">Empates</span></div>
                  <div className="p-2 bg-red-950/30 border border-red-900 rounded"><span className="block font-bold text-white text-lg">{details.info.derrotas}</span><span className="text-[10px] text-zinc-400">Derrotas</span></div>
               </div>
            </CardContent>
          </Card>

          {/* Cartão de Histórico */}
          <Card className="md:col-span-2 border-zinc-800 bg-zinc-900/50">
            <CardHeader><CardTitle className="text-white">Histórico de Jogos</CardTitle></CardHeader>
            <CardContent>
              {(!details.historico || details.historico.length === 0) ? (
                <div className="text-center py-10 text-zinc-500">
                  <p className="mb-2">Nenhum registro encontrado na tabela 'joga'.</p>
                  <p className="text-xs">Se você cadastrou partidas novas, verifique se o banco permitiu salvar os dois times.</p>
                </div>
              ) : (
                <div className="max-h-[400px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-zinc-800 hover:bg-transparent">
                        <TableHead className="text-zinc-400">Data</TableHead>
                        <TableHead className="text-zinc-400">Competição</TableHead>
                        <TableHead className="text-right text-zinc-400">Gols</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {details.historico.map((h: any, i: number) => (
                        <TableRow key={i} className="border-zinc-800 text-zinc-300 hover:bg-zinc-800/50">
                          <TableCell>{h.data}</TableCell>
                          <TableCell className="text-white">{h.competicao}</TableCell>
                          <TableCell className="text-right"><Badge variant="secondary">{h.gols_marcados}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};