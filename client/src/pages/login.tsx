import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock, Mail, Eye, EyeOff, Rss, Users, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.email || !formData.password) {
        const msg = 'Preencha todos os campos';
        toast({ variant: 'destructive', title: 'Erro', description: msg });
        return;
      }

      setIsLoading(true);

      try {
        await login(formData.email, formData.password);
        toast({ title: 'Login realizado!', description: 'Bem-vindo de volta' });
        navigate('/', { replace: true });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Verifique suas credenciais e tente novamente';
        toast({ variant: 'destructive', title: 'Erro ao fazer login', description: msg });
      } finally {
        setIsLoading(false);
      }
    },
    [formData.email, formData.password, login, navigate, toast]
  );

  return (
    <div className="min-h-screen bg-black flex flex-col lg:flex-row">
      {/* Brand panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 xl:p-16 bg-gradient-to-br from-[#0a1628] via-[#0d1b2a] to-black">
        <div className="space-y-12">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="text-2xl">⚽</span>
            </div>
            <div>
              <h1 className="font-extrabold text-2xl tracking-tight text-foreground">FUTTWITTER</h1>
              <p className="text-sm text-foreground-muted">Futebol com inteligência.</p>
            </div>
          </div>

          <div className="space-y-6">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full p-1.5 bg-primary/20">
                  <Rss className="h-4 w-4 text-primary" />
                </div>
                <span className="text-foreground-secondary">Feed editorial em tempo real</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full p-1.5 bg-primary/20">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <span className="text-foreground-secondary">Torcida conectada</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full p-1.5 bg-primary/20">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <span className="text-foreground-secondary">Seu time, seu espaço</span>
              </li>
            </ul>
          </div>
        </div>

        <footer className="text-xs text-foreground-muted">
          © 2025 FUTTWITTER · Todos os direitos reservados
        </footer>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-[400px]"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <span className="text-2xl">⚽</span>
            <span className="font-extrabold text-xl tracking-tight text-foreground">FUTTWITTER</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
            Bem-vindo de volta
          </h2>
          <p className="text-foreground-secondary mb-8">Entre na sua conta</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground-secondary">
                Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  disabled={isLoading}
                  data-testid="input-email"
                  className="pl-9 border-border focus-visible:ring-primary focus-visible:border-primary"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground-secondary">
                Senha
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                  disabled={isLoading}
                  data-testid="input-password"
                  className="pl-9 pr-10 border-border focus-visible:ring-primary focus-visible:border-primary"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors p-1 rounded"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-full font-semibold brand-gradient hover:opacity-90 transition-opacity"
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
          </form>

          <p className="mt-6 text-center text-sm text-foreground-secondary">
            Não tem conta?{' '}
            <Link to="/cadastro" className="text-primary font-semibold hover:underline" data-testid="link-signup">
              Criar conta
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
