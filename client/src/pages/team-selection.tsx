import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { useSignupStore } from '../store/useSignupStore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { TEAMS_DATA } from '@/lib/team-data';
import { Crest } from '@/components/ui-premium';
import { Loader2, Check } from 'lucide-react';

export default function TeamSelectionPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const signupData = useSignupStore((s) => s.data);
  const clearSignupData = useSignupStore((s) => s.clearSignupData);

  const handleTeamClick = (teamId: string) => {
    setSelectedTeam(teamId);
    setShowConfirmDialog(true);
  };

  const handleConfirm = async () => {
    if (!selectedTeam) return;

    if (!signupData) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Dados de cadastro não encontrados. Por favor, refaça o cadastro.',
      });
      navigate('/cadastro', { replace: true });
      return;
    }

    setIsLoading(true);

    try {
      await register(signupData.name, signupData.email, signupData.password, selectedTeam, signupData.handle);
      clearSignupData();
      toast({
        title: 'Conta criada com sucesso!',
        description: 'Bem-vindo à plataforma Brasileirão',
      });
      navigate('/', { replace: true });
    } catch (error: unknown) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar conta',
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde',
      });
    } finally {
      setIsLoading(false);
      setShowConfirmDialog(false);
    }
  };

  const team = TEAMS_DATA.find((t) => t.id === selectedTeam);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚽</span>
          <span className="font-extrabold text-lg tracking-tight text-foreground">FUTTWITTER</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground-secondary">Passo final</span>
          <span className="text-sm font-bold text-primary">3/3</span>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Escolha seu time ❤️
        </h1>
        <p className="text-foreground-secondary mb-8">
          Esta escolha é permanente. Escolha com carinho.
        </p>

        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
          {TEAMS_DATA.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTeamClick(t.id)}
              className="rounded-2xl border-2 border-border bg-surface-elevated/50 hover:scale-[1.05] transition-all duration-200 flex flex-col items-center gap-2 p-3 sm:p-4"
              style={
                {
                  '--team-color': t.primaryColor,
                  ...(selectedTeam === t.id && { borderColor: t.primaryColor }),
                } as React.CSSProperties
              }
              data-testid={`button-team-${t.id}`}
            >
              <div
                className={`relative w-full aspect-square rounded-full overflow-hidden flex items-center justify-center p-2 transition-all duration-200 border-2 ${
                  selectedTeam === t.id ? 'ring-2 ring-offset-2 ring-offset-black' : 'border-transparent'
                }`}
                style={
                  selectedTeam === t.id
                    ? ({ borderColor: t.primaryColor, '--tw-ring-color': t.primaryColor } as React.CSSProperties)
                    : undefined
                }
              >
                <Crest slug={t.id} alt={t.name} size="lg" className="w-full h-full" />
                {selectedTeam === t.id && (
                  <div
                    className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: t.primaryColor }}
                  >
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <span className="text-xs font-semibold text-center leading-tight text-foreground">
                {t.shortName}
              </span>
            </button>
          ))}
        </div>
      </main>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md bg-surface-elevated border-card-border">
          <DialogHeader>
            <DialogTitle className="text-center">Confirmar escolha</DialogTitle>
            <DialogDescription className="text-center pt-4">
              {team && (
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="w-24 h-24 rounded-full overflow-hidden border-2 flex items-center justify-center p-2"
                    style={{ borderColor: team.primaryColor }}
                  >
                    <Crest slug={team.id} alt={team.name} size="lg" className="w-full h-full" />
                  </div>
                  <div>
                    <p className="font-bold text-xl mb-2">{team.name}</p>
                    <p className="text-sm text-foreground-muted">
                      Tem certeza? Esta escolha é{' '}
                      <span className="font-semibold text-foreground">permanente</span> e não poderá
                      ser alterada depois!
                    </p>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isLoading}
              data-testid="button-cancel"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              data-testid="button-confirm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                'Confirmar e entrar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
