import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Preencha todos os campos',
      });
      return;
    }

    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      toast({
        title: 'Login realizado!',
        description: 'Bem-vindo de volta',
      });
      setLocation('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao fazer login',
        description: error.message || 'Verifique suas credenciais e tente novamente',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container py-10 sm:py-14">
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          {/* Brand panel */}
          <div className="hidden lg:flex glass-card p-10 flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-surface-elevated border border-card-border flex items-center justify-center">
                  <span className="text-xl">⚽</span>
                </div>
                <div>
                  <div className="font-display font-extrabold tracking-tight text-xl">FUTTWITTER</div>
                  <div className="text-sm text-foreground-secondary">Premium Sports Editorial</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-display font-bold text-3xl text-foreground">
                  Futebol com cara de produto real.
                </div>
                <div className="text-foreground-secondary leading-relaxed">
                  Feed editorial, estatísticas, elenco e comunidade — tudo com densidade premium e foco em acessibilidade.
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="chip">Feed</span>
                <span className="chip">Meu time</span>
                <span className="chip">Stats</span>
                <span className="chip">RBAC</span>
              </div>
            </div>
            <div className="text-xs text-foreground-muted">
              Ao entrar, você concorda com os termos e política de privacidade.
            </div>
          </div>

          {/* Form */}
          <div className="flex items-center justify-center">
            <Card className="glass-card w-full max-w-md">
              <CardHeader className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚽</span>
                  <CardTitle className="text-2xl font-display">Entrar</CardTitle>
                </div>
                <CardDescription>Continue de onde parou.</CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={isLoading}
                        data-testid="input-email"
                        className="pl-9"
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        disabled={isLoading}
                        data-testid="input-password"
                        className="pl-9"
                        autoComplete="current-password"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    className="w-full font-semibold"
                    disabled={isLoading}
                    data-testid="button-login"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                  <p className="text-center text-sm text-foreground-secondary">
                    Não tem uma conta?{' '}
                    <Link href="/cadastro" data-testid="link-signup">
                      <span className="text-primary font-semibold hover:underline cursor-pointer">
                        Criar conta grátis
                      </span>
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
