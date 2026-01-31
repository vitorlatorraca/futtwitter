import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock, Mail, User } from 'lucide-react';

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Preencha todos os campos',
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'As senhas não coincidem',
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'A senha deve ter pelo menos 6 caracteres',
      });
      return;
    }

    // Store signup data in sessionStorage and redirect to team selection
    sessionStorage.setItem('signupData', JSON.stringify({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    }));

    setLocation('/selecionar-time');
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
                  Crie sua conta.
                </div>
                <div className="text-foreground-secondary leading-relaxed">
                  Escolha seu time do coração e personalize o feed. Sem enrolação.
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="chip">Setup em 1 minuto</span>
                <span className="chip">Escolha do time</span>
                <span className="chip">A11y</span>
              </div>
            </div>
            <div className="text-xs text-foreground-muted">
              Dica: use um email que você acessa com frequência.
            </div>
          </div>

          {/* Form */}
          <div className="flex items-center justify-center">
            <Card className="glass-card w-full max-w-md">
              <CardHeader className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚽</span>
                  <CardTitle className="text-2xl font-display">Criar conta</CardTitle>
                </div>
                <CardDescription>Depois você escolhe seu time.</CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Seu nome"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={isLoading}
                        data-testid="input-name"
                        className="pl-9"
                        autoComplete="name"
                      />
                    </div>
                  </div>
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
                        placeholder="Mínimo 6 caracteres"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        disabled={isLoading}
                        data-testid="input-password"
                        className="pl-9"
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar senha</Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Digite a senha novamente"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        disabled={isLoading}
                        data-testid="input-confirm-password"
                        className="pl-9"
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    className="w-full font-semibold"
                    disabled={isLoading}
                    data-testid="button-signup"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Continuando...
                      </>
                    ) : (
                      'Continuar'
                    )}
                  </Button>
                  <p className="text-center text-sm text-foreground-secondary">
                    Já tem uma conta?{' '}
                    <Link href="/login" data-testid="link-login">
                      <span className="text-primary font-semibold hover:underline cursor-pointer">
                        Fazer login
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
