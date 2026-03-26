import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignupStore } from '../store/useSignupStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock, Mail, User, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';
import { getApiUrl } from '@/lib/queryClient';

// Normaliza o nome para sugerir um handle
function nameToHandle(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 30);
}

function getPasswordStrength(password: string): 0 | 1 | 2 | 3 | 4 {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  return Math.min(4, score) as 0 | 1 | 2 | 3 | 4;
}

type HandleStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

export default function SignupPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setSignupData = useSignupStore((s) => s.setSignupData);

  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    handle: '',
    password: '',
  });

  const [handleStatus, setHandleStatus] = useState<HandleStatus>('idle');
  const [handleTouched, setHandleTouched] = useState(false);

  const passwordStrength = getPasswordStrength(formData.password);

  // Quando o nome muda e o handle ainda não foi tocado → sugere automaticamente
  useEffect(() => {
    if (!handleTouched && formData.name) {
      setFormData((prev) => ({ ...prev, handle: nameToHandle(formData.name) }));
    }
  }, [formData.name, handleTouched]);

  // Verifica disponibilidade do handle com debounce
  useEffect(() => {
    const handle = formData.handle.trim();

    if (!handle) {
      setHandleStatus('idle');
      return;
    }

    if (!/^[a-z0-9_]{3,30}$/.test(handle)) {
      setHandleStatus('invalid');
      return;
    }

    setHandleStatus('checking');

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(getApiUrl(`/api/auth/check-handle?handle=${encodeURIComponent(handle)}`));
        const data = await res.json();
        setHandleStatus(data.available ? 'available' : 'taken');
      } catch {
        setHandleStatus('idle');
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [formData.handle]);

  const handleHandleChange = useCallback((value: string) => {
    const clean = value.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 30);
    setHandleTouched(true);
    setFormData((prev) => ({ ...prev, handle: clean }));
  }, []);

  const handleStep1Continue = useCallback(() => {
    if (!formData.name.trim()) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Preencha o nome' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Email inválido' });
      return;
    }
    if (passwordStrength < 3) {
      toast({ variant: 'destructive', title: 'Senha fraca', description: 'Use pelo menos 8 caracteres, uma maiúscula, um número e um caractere especial.' });
      return;
    }
    setStep(2);
  }, [formData.name, formData.email, formData.password, toast]);

  const handleCreateAccount = useCallback(() => {
    if (handleStatus !== 'available') {
      toast({ variant: 'destructive', title: 'Erro', description: '@' + formData.handle + ' não está disponível' });
      return;
    }

    setSignupData({
      name: formData.name,
      email: formData.email,
      handle: formData.handle,
      password: formData.password,
    });

    navigate('/selecionar-time', { replace: true });
  }, [formData, handleStatus, setSignupData, navigate, toast]);

  const handleFeedback = () => {
    switch (handleStatus) {
      case 'checking':
        return <Loader2 className="h-4 w-4 animate-spin text-foreground-muted" />;
      case 'available':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'taken':
      case 'invalid':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[480px] mx-auto">
        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-8">
          <span className={`text-sm font-semibold ${step === 1 ? 'text-primary' : 'text-foreground-muted'}`}>
            1
          </span>
          <div className="flex-1 h-0.5 bg-border rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${step === 2 ? 'w-full bg-primary' : 'w-0 bg-foreground-muted'}`}
            />
          </div>
          <span className={`text-sm font-semibold ${step === 2 ? 'text-primary' : 'text-foreground-muted'}`}>
            2
          </span>
        </div>

        <div className="border border-border rounded-xl bg-surface-elevated/50 p-6 sm:p-8 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Criar conta</h1>
                  <p className="text-sm text-foreground-secondary mt-1">Dados pessoais</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      data-testid="input-name"
                      className="pl-9 focus-visible:ring-primary"
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
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      data-testid="input-email"
                      className="pl-9 focus-visible:ring-primary"
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
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 8 caracteres"
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                      data-testid="input-password"
                      className="pl-9 pr-9 focus-visible:ring-primary"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {/* Password strength bar */}
                  <div className="flex gap-1 mt-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          passwordStrength > i
                            ? passwordStrength <= 1
                              ? 'bg-red-500'
                              : passwordStrength === 2
                                ? 'bg-yellow-500'
                                : passwordStrength === 3
                                  ? 'bg-green-500'
                                  : 'bg-green-400'
                            : 'bg-border'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleStep1Continue}
                  className="w-full font-semibold rounded-full brand-gradient hover:opacity-90 transition-opacity"
                  data-testid="button-continue"
                >
                  Continuar
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Escolha seu @</h1>
                  <p className="text-sm text-foreground-secondary mt-1">
                    Identificador único — escolha com cuidado
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="handle">Seu @</Label>
                  <div className="flex items-center rounded-md border border-card-border bg-surface-elevated focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <span className="pl-3 text-foreground-muted text-sm">@</span>
                    <input
                      id="handle"
                      type="text"
                      value={formData.handle}
                      onChange={(e) => handleHandleChange(e.target.value)}
                      placeholder="seuhandle"
                      data-testid="input-handle"
                      className="flex-1 bg-transparent px-2 py-2.5 text-sm font-medium text-foreground placeholder:text-foreground-muted focus:outline-none border-0 rounded-r-md"
                      maxLength={30}
                      autoComplete="username"
                    />
                    <div className="pr-3 flex items-center w-5 justify-center">{handleFeedback()}</div>
                  </div>
                  <p className="text-xs text-foreground-muted">
                    Letras minúsculas, números e _ · 3-30 caracteres
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-full"
                    data-testid="button-back"
                  >
                    Voltar
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCreateAccount}
                    disabled={handleStatus !== 'available'}
                    className="flex-1 font-semibold rounded-full brand-gradient hover:opacity-90 transition-opacity disabled:opacity-50"
                    data-testid="button-signup"
                  >
                    Criar conta
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-sm text-foreground-secondary mt-6">
          Já tem uma conta?{' '}
          <Link to="/login" data-testid="link-login">
            <span className="text-primary font-semibold hover:underline cursor-pointer">Entrar</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
