import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { TEAMS_DATA } from '@/lib/team-data';
import { Crest } from '@/components/ui-premium';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function TeamSelectionPage() {
  const [, setLocation] = useLocation();
  const { register } = useAuth();
  const { toast } = useToast();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTeamClick = (teamId: string) => {
    setSelectedTeam(teamId);
    setShowConfirmDialog(true);
  };

  const handleConfirm = async () => {
    if (!selectedTeam) return;

    const signupDataStr = sessionStorage.getItem('signupData');
    if (!signupDataStr) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Dados de cadastro não encontrados. Por favor, refaça o cadastro.',
      });
      setLocation('/cadastro');
      return;
    }

    const signupData = JSON.parse(signupDataStr);
    setIsLoading(true);

    try {
      await register(signupData.name, signupData.email, signupData.password, selectedTeam);
      sessionStorage.removeItem('signupData');
      toast({
        title: 'Conta criada com sucesso!',
        description: 'Bem-vindo à plataforma Brasileirão',
      });
      setLocation('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar conta',
        description: error.message || 'Tente novamente mais tarde',
      });
    } finally {
      setIsLoading(false);
      setShowConfirmDialog(false);
    }
  };

  const team = TEAMS_DATA.find(t => t.id === selectedTeam);

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container py-10 sm:py-14">
        <div className="rounded-2xl border border-white/5 bg-card p-6 sm:p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="rounded-full border border-card-border bg-surface-elevated p-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground">
                Escolha seu time do coração
              </h1>
              <p className="text-foreground-secondary mt-2">
                Atenção: esta escolha é permanente (por enquanto). Escolha com carinho ⚽
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 sm:gap-4">
          {TEAMS_DATA.map((team) => (
            <button
              key={team.id}
              onClick={() => handleTeamClick(team.id)}
              className="rounded-2xl border border-white/5 bg-card hover:border-white/10 transition-colors group flex flex-col items-center gap-2 p-3 transition-all"
              data-testid={`button-team-${team.id}`}
            >
              <div className="relative w-full aspect-square rounded-full overflow-hidden border border-white/5 bg-card flex items-center justify-center p-2 group-hover:border-primary transition-colors">
                <Crest slug={team.id} alt={team.name} size="lg" className="w-full h-full" />
              </div>
              <span className="text-xs font-semibold text-center leading-tight hidden md:block text-foreground">
                {team.shortName}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md bg-popover/90 backdrop-blur-md border-card-border">
          <DialogHeader>
            <DialogTitle className="text-center">Confirmar escolha</DialogTitle>
            <DialogDescription className="text-center pt-4">
              {team && (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 flex items-center justify-center p-2" style={{ borderColor: team.primaryColor }}>
                    <Crest slug={team.id} alt={team.name} size="lg" className="w-full h-full" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-xl mb-2">{team.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Tem certeza? Esta escolha é <span className="font-semibold text-foreground">permanente</span> e não poderá ser alterada depois!
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
                'Confirmar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
