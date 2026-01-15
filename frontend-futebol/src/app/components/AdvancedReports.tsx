import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { FileText, Users, AlertOctagon, UserMinus, ShieldCheck } from 'lucide-react';

export const AdvancedReports = () => {
  const [activeTab, setActiveTab] = useState('torcedores');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Mapeamento das consultas
  const reports = [
    { id: 'torcedores', label: '1.2 Torcedores', url: '/api/relatorios/torcedores', icon: Users },
    { id: 'violencia', label: '1.3 Jogos Violentos', url: '/api/relatorios/violencia', icon: AlertOctagon },
    { id: 'indecisos', label: '1.4 Usuários Indecisos', url: '/api/relatorios/indecisos', icon: UserMinus },
    { id: 'pacificos', label: '1.6 Árbitros Pacíficos', url: '/api/relatorios/pacificos', icon: ShieldCheck },
  ];

  useEffect(() => {
    setLoading(true);
    const report = reports.find(r => r.id === activeTab);
    if (report) {
      fetch(`http://localhost:8000${report.url}`)
        .then(res => res.json())
        .then(setData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Relatórios Avançados</h1>
        
      </div>

      {/* Menu de Abas */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-zinc-800">
        {reports.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeTab === tab.id 
                ? 'bg-emerald-600 text-white font-medium' 
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabela de Resultados */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            Resultado da Consulta
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-zinc-500">Carregando...</p>
          ) : data.length === 0 ? (
            <p className="text-zinc-500">Nenhum registro encontrado para esta consulta.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800">
                    {Object.keys(data[0]).map((key) => (
                      <TableHead key={key} className="text-zinc-400 capitalize">{key.replace('_', ' ')}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, i) => (
                    <TableRow key={i} className="border-zinc-800 text-zinc-300 hover:bg-zinc-800/50">
                      {Object.values(row).map((val: any, idx) => (
                        <TableCell key={idx}>{val}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};