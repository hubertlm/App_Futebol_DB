import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Trophy, Target, Flag } from 'lucide-react';

export const DashboardOverview = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/estatisticas')
      .then(res => res.json())
      .then(apiData => {
        setData(apiData);
        setLoading(false);
      })
      .catch(err => console.error("Erro:", err));
  }, []);

  const totalPartidas = data.reduce((acc, curr) => acc + curr.total_partidas, 0);
  const mediaEscanteios = data.length > 0 ? (data.reduce((acc, curr) => acc + curr.media_escanteios, 0) / data.length).toFixed(2) : "0.00";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Painel Geral</h1>
        <p className="text-zinc-400">Dados consolidados via View SQL</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total de Partidas</CardTitle>
            <Trophy className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-white">{loading ? '...' : totalPartidas}</div></CardContent>
        </Card>
        
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Média Geral Escanteios</CardTitle>
            <Flag className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-white">{loading ? '...' : mediaEscanteios}</div></CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total de Competições</CardTitle>
            <Target className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-white">{loading ? '...' : data.length}</div></CardContent>
        </Card>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-white">Detalhes por Competição</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-zinc-900/50 border-zinc-800">
                <TableHead className="text-zinc-400">Competição</TableHead>
                <TableHead className="text-right text-zinc-400">Jogos</TableHead>
                <TableHead className="text-right text-zinc-400">Cartões (A / V)</TableHead>
                <TableHead className="text-right text-zinc-400">Méd. Escanteios</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i} className="hover:bg-zinc-800/50 border-zinc-800 text-zinc-300">
                  <TableCell className="font-medium text-white">{row.competicao}</TableCell>
                  <TableCell className="text-right">{row.total_partidas}</TableCell>
                  <TableCell className="text-right">
                    <span className="text-yellow-500">{row.total_amarelos}</span> / <span className="text-red-500">{row.total_vermelhos}</span>
                  </TableCell>
                  <TableCell className="text-right">{row.media_escanteios.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};