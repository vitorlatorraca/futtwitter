import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const map = [
    { label: '', color: '' },
    { label: 'Fraca', color: 'bg-rose-500' },
    { label: 'Razoável', color: 'bg-yellow-500' },
    { label: 'Boa', color: 'bg-blue-500' },
    { label: 'Forte', color: 'bg-green-500' },
  ] as const;
  return { score, ...map[score] };
}

type TokenStatus = 'checking' | 'valid' | 'invalid';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';

  const [tokenStatus, setTokenStatus] = useState<TokenStatus>('checking');
  const [invalidReason, setInvalidReason] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const strength = getPasswordStrength(password);

  // Validar token ao montar
  useEffect(() => {
    if (!token) {
      setTokenStatus('invalid');
      setInvalidReason('Link inválido ou incompleto.');
      return;
    }
    fetch(`/api/auth/reset-password/validate/${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) {
          setTokenStatus('valid');
        } else {
          setTokenStatus('invalid');
          setInvalidReason(data.message ?? 'Token inválido ou expirado.');
        }
      })
      .catch(() => {
        setTokenStatus('invalid');
        setInvalidReason('Erro ao validar o link. Tente novamente.');
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('As senhas não coincidem.');
      return;
    }
    if (strength.score < 3) {
      setErrorMsg('A senha não atende os requisitos mínimos.');
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest('POST', '/api/auth/reset-password', { token, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao redefinir. Tente novamente.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-[400px]"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-2xl">⚽</span>
          <span className="font-extrabold text-xl tracking-tight text-foreground">FUTTWITTER</span>
        </div>

        {/* Verificando token */}
        {tokenStatus === 'checking' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-foreground-secondary text-[15px]">Verificando link...</p>
          </div>
        )}

        {/* Token inválido */}
        {tokenStatus === 'invalid' && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-rose-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground">Link inválido</h2>
            <p className="text-foreground-secondary text-[15px]">{invalidReason}</p>
            <Link
              to="/esqueci-senha"
              className="inline-block mt-2 px-6 py-2.5 rounded-full bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Solicitar novo link
            </Link>
          </div>
        )}

        {/* Formulário */}
        {tokenStatus === 'valid' && (
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-green-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-foreground">Senha redefinida!</h2>
                <p className="text-foreground-secondary text-[15px]">
                  Sua senha foi alterada com sucesso. Redirecionando para o login...
                </p>
              </motion.div>
            ) : (
              <motion.div key="form">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                  Nova senha
                </h2>
                <p className="text-foreground-secondary mb-8 text-[15px]">
                  Crie uma senha forte para proteger sua conta.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Nova senha */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground-secondary">
                      Nova senha
                    </Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 8 caracteres"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setErrorMsg(null); }}
                        disabled={isLoading}
                        autoComplete="new-password"
                        className="pl-9 pr-10 border-border focus-visible:ring-primary focus-visible:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors p-1 rounded"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {/* Barra de força */}
                    {password.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                i <= strength.score ? strength.color : 'bg-muted'
                              }`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs font-medium ${
                          strength.score <= 1 ? 'text-rose-400' :
                          strength.score === 2 ? 'text-yellow-400' :
                          strength.score === 3 ? 'text-blue-400' : 'text-green-400'
                        }`}>
                          {strength.label}
                        </p>
                        <ul className="space-y-0.5">
                          {[
                            { ok: password.length >= 8, text: 'Mínimo 8 caracteres' },
                            { ok: /[A-Z]/.test(password), text: 'Letra maiúscula' },
                            { ok: /[0-9]/.test(password), text: 'Número' },
                            { ok: /[^A-Za-z0-9]/.test(password), text: 'Caractere especial (!@#$...)' },
                          ].map(({ ok, text }) => (
                            <li key={text} className={`flex items-center gap-1.5 text-xs ${ok ? 'text-green-400' : 'text-foreground-muted'}`}>
                              <span>{ok ? '✓' : '·'}</span>
                              {text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Confirmar senha */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-foreground-secondary">
                      Confirmar nova senha
                    </Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                      <Input
                        id="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Repita a senha"
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setErrorMsg(null); }}
                        disabled={isLoading}
                        autoComplete="new-password"
                        className="pl-9 pr-10 border-border focus-visible:ring-primary focus-visible:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors p-1 rounded"
                        tabIndex={-1}
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-rose-400">As senhas não coincidem.</p>
                    )}
                  </div>

                  <AnimatePresence>
                    {errorMsg && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
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
                    disabled={isLoading || strength.score < 3 || password !== confirmPassword}
                  >
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</>
                    ) : (
                      'Redefinir senha'
                    )}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
}
