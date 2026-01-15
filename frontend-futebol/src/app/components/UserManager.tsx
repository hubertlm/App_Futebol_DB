import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { UserPlus, ShieldAlert } from 'lucide-react';

export const UserManager = () => {
  const [formData, setFormData] = useState({ username: '', password: '', role: 'analista' });
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: 'loading', msg: 'Criando usuário no PostgreSQL...' });

    try {
      const res = await fetch('http://localhost:8000/api/admin/create_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Erro desconhecido");

      if (data.erro) throw new Error(data.erro);

      setStatus({ type: 'success', msg: `✅ ${data.msg}` });
      setFormData({ username: '', password: '', role: 'analista' });
    } catch (err: any) {
      setStatus({ type: 'error', msg: `⛔ Erro: ${err.message}` });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Gestão de Acessos</h1>
        <p className="text-zinc-400">Adicione novos usuários ao banco de dados (CREATE USER).</p>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50 max-w-2xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <UserPlus className="text-emerald-500" /> Novo Usuário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateUser} className="space-y-4">
            {status.msg && (
              <div className={`p-3 rounded border text-sm ${status.type === 'error' ? 'bg-red-950/50 border-red-800 text-red-400' : 'bg-emerald-950/50 border-emerald-800 text-emerald-400'}`}>
                {status.msg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome de Usuário</Label>
                <Input 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="bg-zinc-950 border-zinc-800 text-white" 
                  placeholder="ex: NovoFuncionario" 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Senha</Label>
                <Input 
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="bg-zinc-950 border-zinc-800 text-white" 
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Papel (Role)</Label>
              <Select 
                value={formData.role} 
                onValueChange={(v: string) => setFormData({...formData, role: v})}
              >
                <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                  <SelectItem value="analista">Analista (Apenas Leitura)</SelectItem>
                  <SelectItem value="admin">Administrador (Total)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-zinc-500">
                * Analistas só podem ver relatórios. Admins podem cadastrar jogos.
              </p>
            </div>

            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full">
              Criar Usuário
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="p-4 bg-yellow-950/20 border border-yellow-900/50 rounded text-yellow-500 text-sm flex gap-2">
        <ShieldAlert className="shrink-0" />
        <div>
          <p className="font-bold">Nota de Segurança:</p>
          <p>Esta operação executa um comando SQL real. O usuário logado atualmente precisa ter permissão CREATEROLE no Postgres (ex: postgres ou Amorim).</p>
        </div>
      </div>
    </div>
  );
};