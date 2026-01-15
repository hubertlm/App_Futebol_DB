import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Flag, AlertTriangle, AlertCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const RefereeAnalytics = () => {
  const [referees, setReferees] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/arbitros')
      .then(res => res.json())
      .then(setReferees)
      .catch(err => console.error(err));
  }, []);

  const totalCards = referees.reduce((acc, r) => acc + r.total_cartoes, 0);
  const mostStrict = [...referees].sort((a, b) => b.total_cartoes - a.total_cartoes)[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Análise da Arbitragem</h1>
        <p className="text-zinc-400">Classificação de rigor baseada em estatísticas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-zinc-400 text-sm">Total de Cartões</CardTitle>
            <AlertTriangle className="h-4 w-4 text-emerald-500"/>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-white">{totalCards}</div></CardContent>
        </Card>
        
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-zinc-400 text-sm">Árbitro + Rigoroso</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500"/>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-white truncate">{mostStrict?.nome || '-'}</div>
            <p className="text-xs text-zinc-500">{mostStrict?.total_cartoes} cartões</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-zinc-400 text-sm">Qtd. Árbitros</CardTitle>
            <Flag className="h-4 w-4 text-emerald-500"/>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-white">{referees.length}</div></CardContent>
        </Card>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50 h-80">
        <CardHeader><CardTitle className="text-white">Comparativo de Rigor</CardTitle></CardHeader>
        <CardContent className="h-full pb-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={referees}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="nome" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', color: '#fff' }}
                cursor={{ fill: '#27272a' }}
              />
              <Legend />
              <Bar name="Cartões Totais" dataKey="total_cartoes" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Lista de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {referees.map((arb, i) => (
          <div key={i} className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex justify-between items-start">
             <div>
               <div className="font-bold text-white">{arb.nome}</div>
               <div className="text-sm text-zinc-500">{arb.nacionalidade}</div>
               <div className="text-xs text-zinc-600 mt-2">{arb.jogos} Partidas Apitadas</div>
             </div>
             <Badge variant={arb.total_cartoes > 15 ? 'destructive' : 'secondary'}>
               {arb.total_cartoes} Cartões
             </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};