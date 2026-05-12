import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock, Mail, Eye, EyeOff, Rss, Users, Shield, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.email || !formData.password) {
        setErrorMsg('Preencha todos os campos');
        return;
      }

      setIsLoading(true);
      setErrorMsg(null);

      try {
        await login(formData.email, formData.password);
        toast({ title: 'Login realizado!', description: 'Bem-vindo de volta' });
        navigate('/', { replace: true });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Verifique suas credenciais e tente novamente';
        setErrorMsg(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [formData.email, formData.password, login, navigate, toast]
  );

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Brand panel — desktop only. Forest-green wash like a vintage program cover. */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 xl:p-16 paper-texture relative bg-primary text-primary-foreground">
        <div className="space-y-12">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary-foreground/15 flex items-center justify-center border border-primary-foreground/30">
              <span className="text-2xl">⚽</span>
            </div>
            <div>
              <h1
                className="font-display text-[28px] text-primary-foreground"
                style={{ fontWeight: 700, letterSpacing: '-0.025em' }}
              >
                tribuna
              </h1>
              <p
                className="font-mono text-[10px] text-primary-foreground/60 mt-1"
                style={{ fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase' }}
              >
                O jornal que conversa
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full p-1.5 bg-primary-foreground/15">
                  <Rss className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-primary-foreground/90 text-[15px]">Feed editorial em tempo real</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full p-1.5 bg-primary-foreground/15">
                  <Users className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-primary-foreground/90 text-[15px]">Torcida conectada</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full p-1.5 bg-primary-foreground/15">
                  <Shield className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-primary-foreground/90 text-[15px]">Seu time, seu espaço</span>
              </li>
            </ul>
          </div>
        </div>

        <footer
          className="text-[10px] text-primary-foreground/55 font-mono"
          style={{ letterSpacing: '0.14em', textTransform: 'uppercase' }}
        >
          © 2026 Tribuna · Todos os direitos reservados
        </footer>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-[400px]"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <span className="text-2xl">⚽</span>
            <span
              className="font-display text-[22px] text-foreground"
              style={{ fontWeight: 700, letterSpacing: '-0.025em' }}
            >
              tribuna
            </span>
          </div>

          <h2 className="t-h2 text-foreground mb-1">Bem-vindo de volta</h2>
          <p className="t-body-lg text-foreground-secondary mb-8">Entre na sua conta</p>

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
                  onChange={(e) => { setFormData((p) => ({ ...p, email: e.target.value })); setErrorMsg(null); }}
                  disabled={isLoading}
                  data-testid="input-email"
                  className="pl-9 border-border focus-visible:ring-primary focus-visible:border-primary"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground-secondary">
                  Senha
                </Label>
                <Link
                  to="/esqueci-senha"
                  className="text-xs text-floodlight hover:text-floodlight-d hover:underline font-medium"
                  tabIndex={-1}
                >
                  Esqueci minha senha
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => { setFormData((p) => ({ ...p, password: e.target.value })); setErrorMsg(null); }}
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

            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-400"
                  role="alert"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

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

          <p className="mt-6 text-center text-[13px] text-foreground-secondary">
            Não tem conta?{' '}
            <Link to="/cadastro" className="text-floodlight hover:text-floodlight-d font-semibold hover:underline" data-testid="link-signup">
              Criar conta
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
