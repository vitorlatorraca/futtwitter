import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setErrorMsg('Informe seu email.'); return; }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await apiRequest('POST', '/api/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao enviar. Tente novamente.';
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

        <AnimatePresence mode="wait">
          {submitted ? (
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
              <h2 className="text-2xl font-bold text-foreground">Email enviado!</h2>
              <p className="text-foreground-secondary text-[15px] leading-relaxed">
                Se <strong className="text-foreground">{email}</strong> estiver cadastrado,
                você receberá as instruções para redefinir sua senha em breve.
                Verifique também a pasta de spam.
              </p>
              <p className="text-sm text-foreground-muted">O link expira em 1 hora.</p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline mt-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao login
              </Link>
            </motion.div>
          ) : (
            <motion.div key="form">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                Esqueci minha senha
              </h2>
              <p className="text-foreground-secondary mb-8 text-[15px]">
                Informe seu email e enviaremos um link para redefinir sua senha.
              </p>

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
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrorMsg(null); }}
                      disabled={isLoading}
                      autoComplete="email"
                      className="pl-9 border-border focus-visible:ring-primary focus-visible:border-primary"
                    />
                  </div>
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
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enviando...</>
                  ) : (
                    'Enviar link de redefinição'
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-foreground-secondary">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-primary font-semibold hover:underline">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Voltar ao login
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
