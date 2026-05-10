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

// Mirrors the backend zod rules in shared/schema.ts (insertUserSchema.password):
// 8+ chars, ≥1 uppercase, ≥1 digit, ≥1 special. Frontend MUST require all 4
// or the backend will 400.
function getPasswordChecks(password: string) {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    digit: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

function getPasswordStrength(password: string): 0 | 1 | 2 | 3 | 4 {
  if (!password) return 0;
  const c = getPasswordChecks(password);
  const score = (c.length ? 1 : 0) + (c.upper ? 1 : 0) + (c.digit ? 1 : 0) + (c.special ? 1 : 0);
  return Math.min(4, score) as 0 | 1 | 2 | 3 | 4;
}

function firstMissingPasswordRule(password: string): string | null {
  const c = getPasswordChecks(password);
  if (!c.length) return "A senha deve ter pelo menos 8 caracteres.";
  if (!c.upper) return "A senha deve conter pelo menos uma letra maiúscula.";
  if (!c.digit) return "A senha deve conter pelo menos um número.";
  if (!c.special) return "A senha deve conter pelo menos um caractere especial (ex: @, !, #).";
  return null;
}

type HandleStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

export default function SignupPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setSignupData = useSignupStore((s) => s.setSignupData);
  const existingSignupData = useSignupStore((s) => s.data);

  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  // Pre-populate from store so that when team-selection bounces the user back
  // (e.g. duplicate email), they don't have to retype everything.
  const [formData, setFormData] = useState({
    name: existingSignupData?.name ?? '',
    email: existingSignupData?.email ?? '',
    handle: existingSignupData?.handle ?? '',
    password: existingSignupData?.password ?? '',
  });

  // Per-field errors that persist until the user fixes them
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; handle?: string }>({});
  const clearError = (field: keyof typeof errors) =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

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
    // Validate ALL fields at once so the user sees every problem in one pass
    // instead of fixing one error and then discovering the next.
    const next: typeof errors = {};
    if (!formData.name.trim()) {
      next.name = 'Preencha seu nome.';
    } else if (formData.name.trim().length < 2) {
      next.name = 'Nome deve ter pelo menos 2 caracteres.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      next.email = 'Preencha seu email.';
    } else if (!emailRegex.test(formData.email)) {
      next.email = 'Email inválido. Use o formato nome@dominio.com.';
    }
    const missing = firstMissingPasswordRule(formData.password);
    if (!formData.password) {
      next.password = 'Crie uma senha.';
    } else if (missing) {
      next.password = missing;
    }
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    setStep(2);
  }, [formData.name, formData.email, formData.password]);

  const handleCreateAccount = useCallback(() => {
    if (!formData.handle) {
      setErrors((p) => ({ ...p, handle: 'Escolha um @.' }));
      return;
    }
    if (handleStatus === 'invalid') {
      setErrors((p) => ({ ...p, handle: 'Use letras minúsculas, números e _ (3-30 caracteres).' }));
      return;
    }
    if (handleStatus === 'taken') {
      setErrors((p) => ({ ...p, handle: `@${formData.handle} já está em uso. Escolha outro.` }));
      return;
    }
    if (handleStatus === 'checking') {
      setErrors((p) => ({ ...p, handle: 'Aguarde a verificação...' }));
      return;
    }
    if (handleStatus !== 'available') {
      setErrors((p) => ({ ...p, handle: 'Não foi possível verificar o @. Tente novamente.' }));
      return;
    }

    setErrors({});
    setSignupData({
      name: formData.name,
      email: formData.email,
      handle: formData.handle,
      password: formData.password,
    });

    navigate('/selecionar-time', { replace: true });
  }, [formData, handleStatus, setSignupData, navigate]);

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
                      onChange={(e) => { setFormData((prev) => ({ ...prev, name: e.target.value })); clearError('name'); }}
                      data-testid="input-name"
                      aria-invalid={errors.name ? true : undefined}
                      className={`pl-9 focus-visible:ring-primary ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      autoComplete="name"
                    />
                  </div>
                  {errors.name && (
                    <p role="alert" className="text-xs text-red-400 flex items-start gap-1 mt-1">
                      <XCircle className="h-3 w-3 mt-0.5 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
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
                      onChange={(e) => { setFormData((prev) => ({ ...prev, email: e.target.value })); clearError('email'); }}
                      data-testid="input-email"
                      aria-invalid={errors.email ? true : undefined}
                      className={`pl-9 focus-visible:ring-primary ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && (
                    <p role="alert" className="text-xs text-red-400 flex items-start gap-1 mt-1">
                      <XCircle className="h-3 w-3 mt-0.5 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
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
                      onChange={(e) => { setFormData((prev) => ({ ...prev, password: e.target.value })); clearError('password'); }}
                      data-testid="input-password"
                      aria-invalid={errors.password ? true : undefined}
                      className={`pl-9 pr-9 focus-visible:ring-primary ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
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
                  {/* Live requirements checklist (matches backend rules exactly) */}
                  {formData.password.length > 0 && (() => {
                    const c = getPasswordChecks(formData.password);
                    const Item = ({ ok, label }: { ok: boolean; label: string }) => (
                      <li className={`flex items-center gap-1.5 text-xs ${ok ? 'text-green-500' : 'text-foreground-muted'}`}>
                        {ok ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        <span>{label}</span>
                      </li>
                    );
                    return (
                      <ul className="space-y-0.5 mt-2">
                        <Item ok={c.length} label="Pelo menos 8 caracteres" />
                        <Item ok={c.upper} label="Uma letra maiúscula" />
                        <Item ok={c.digit} label="Um número" />
                        <Item ok={c.special} label="Um caractere especial (ex: @, !, #)" />
                      </ul>
                    );
                  })()}
                  {errors.password && (
                    <p role="alert" className="text-xs text-red-400 flex items-start gap-1 mt-1">
                      <XCircle className="h-3 w-3 mt-0.5 shrink-0" />
                      <span>{errors.password}</span>
                    </p>
                  )}
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
                  <div className={`flex items-center rounded-md border bg-surface-elevated focus-within:ring-2 transition-all ${
                    errors.handle || handleStatus === 'taken' || handleStatus === 'invalid'
                      ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20'
                      : 'border-card-border focus-within:border-primary focus-within:ring-primary/20'
                  }`}>
                    <span className="pl-3 text-foreground-muted text-sm">@</span>
                    <input
                      id="handle"
                      type="text"
                      value={formData.handle}
                      onChange={(e) => { handleHandleChange(e.target.value); clearError('handle'); }}
                      placeholder="seuhandle"
                      data-testid="input-handle"
                      aria-invalid={errors.handle ? true : undefined}
                      className="flex-1 bg-transparent px-2 py-2.5 text-sm font-medium text-foreground placeholder:text-foreground-muted focus:outline-none border-0 rounded-r-md"
                      maxLength={30}
                      autoComplete="username"
                    />
                    <div className="pr-3 flex items-center w-5 justify-center">{handleFeedback()}</div>
                  </div>
                  <p className="text-xs text-foreground-muted">
                    Letras minúsculas, números e _ · 3-30 caracteres
                  </p>
                  {/* Surface live status from check-handle so users see "taken" without clicking */}
                  {!errors.handle && handleStatus === 'taken' && (
                    <p role="alert" className="text-xs text-red-400 flex items-start gap-1 mt-1">
                      <XCircle className="h-3 w-3 mt-0.5 shrink-0" />
                      <span>@{formData.handle} já está em uso. Escolha outro.</span>
                    </p>
                  )}
                  {!errors.handle && handleStatus === 'invalid' && formData.handle.length > 0 && (
                    <p role="alert" className="text-xs text-red-400 flex items-start gap-1 mt-1">
                      <XCircle className="h-3 w-3 mt-0.5 shrink-0" />
                      <span>Use letras minúsculas, números e _ (3-30 caracteres).</span>
                    </p>
                  )}
                  {errors.handle && (
                    <p role="alert" className="text-xs text-red-400 flex items-start gap-1 mt-1">
                      <XCircle className="h-3 w-3 mt-0.5 shrink-0" />
                      <span>{errors.handle}</span>
                    </p>
                  )}
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
                    className="flex-1 font-semibold rounded-full brand-gradient hover:opacity-90 transition-opacity"
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
