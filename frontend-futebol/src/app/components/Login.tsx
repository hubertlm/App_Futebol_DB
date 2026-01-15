import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Lock, User } from 'lucide-react';

export const Login = ({ onLogin }: { onLogin: (user: string, role: string) => void }) => {
  const [formData, setFormData] = useState({ user: 'postgres', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Falha no login");

      onLogin(data.user, data.role);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-emerald-600 rounded-lg mx-auto flex items-center justify-center mb-4">
            <Lock className="text-white" />
          </div>
          <CardTitle className="text-2xl text-white">Acesso ao Sistema</CardTitle>
          <p className="text-zinc-400">Entre com seu usuário do Banco de Dados</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-950/50 border border-red-900 text-red-400 rounded text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Usuário (DB)</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <Input 
                  className="pl-9 bg-zinc-950 border-zinc-800 text-white" 
                  placeholder="ex: postgres, Amorim, Verdancio"
                  value={formData.user}
                  onChange={e => setFormData({...formData, user: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <Input 
                  type="password" 
                  className="pl-9 bg-zinc-950 border-zinc-800 text-white" 
                  placeholder="Senha do banco"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <Button disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              {loading ? 'Conectando...' : 'Entrar'}
            </Button>

            <div className="text-xs text-center text-zinc-500 mt-4">
              <p>Dicas de Acesso (Etapa 7):</p>
              <p>Admin: <strong>Amorim</strong> (Senha: 123)</p>
              <p>Analista: <strong>Verdancio</strong> (Senha: 321)</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};