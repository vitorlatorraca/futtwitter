'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crest } from '@/components/ui-premium';
import { useToast } from '@/hooks/use-toast';
import { getApiUrl } from '@/lib/queryClient';
import { useCreateTransferRumor, useUpdateTransferRumor, TRANSFER_RUMOR_STATUSES, type TransferRumorStatus, type TransferRumorItem } from './api';

const STATUS_LABELS: Record<TransferRumorStatus, string> = {
  RUMOR: 'Rumor',
  NEGOTIATING: 'Em negociação',
  DONE: 'Fechado',
  CANCELLED: 'Cancelado',
};

const CURRENCIES = ['BRL', 'EUR', 'USD'];

interface Team {
  id: string;
  name: string;
  shortName: string;
}

interface PlayerSearchResult {
  id: string;
  name: string;
  photoUrl: string | null;
  position: string | null;
  teamName?: string;
}

interface CreateTransferRumorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRumor?: TransferRumorItem | null;
  onSuccess?: () => void;
}

export function CreateTransferRumorDialog({
  open,
  onOpenChange,
  editingRumor,
  onSuccess,
}: CreateTransferRumorDialogProps) {
  const { toast } = useToast();
  const createMutation = useCreateTransferRumor();
  const updateMutation = useUpdateTransferRumor();

  const [playerSearch, setPlayerSearch] = useState('');
  const [playerResults, setPlayerResults] = useState<PlayerSearchResult[]>([]);
  const [playerSearching, setPlayerSearching] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerSearchResult | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const playerSearchRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    playerId: '',
    fromTeamId: '',
    toTeamId: '',
    status: 'RUMOR' as TransferRumorStatus,
    feeAmount: '',
    feeCurrency: 'BRL',
    contractUntil: '',
    sourceName: '',
    sourceUrl: '',
    note: '',
  });

  const isEditing = !!editingRumor;

  const fetchTeams = useCallback(async () => {
    try {
      const res = await fetch(getApiUrl('/api/teams'), { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setTeams(data);
      }
    } finally {
      setTeamsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchTeams();
  }, [open, fetchTeams]);

  useEffect(() => {
    if (!open) return;
    if (editingRumor) {
      setFormData({
        playerId: editingRumor.player.id,
        fromTeamId: editingRumor.fromTeam?.id ?? '',
        toTeamId: editingRumor.toTeam?.id ?? '',
        status: editingRumor.status,
        feeAmount: editingRumor.feeAmount != null ? String(editingRumor.feeAmount) : '',
        feeCurrency: 'BRL',
        contractUntil: '',
        sourceName: editingRumor.sourceName ?? '',
        sourceUrl: editingRumor.sourceUrl ?? '',
        note: editingRumor.note ?? '',
      });
      setSelectedPlayer({
        id: editingRumor.player.id,
        name: editingRumor.player.name,
        photoUrl: editingRumor.player.photoUrl,
        position: editingRumor.player.position,
      });
      setPlayerSearch(editingRumor.player.name);
    } else {
      setFormData({
        playerId: '',
        fromTeamId: '',
        toTeamId: '',
        status: 'RUMOR',
        feeAmount: '',
        feeCurrency: 'BRL',
        contractUntil: '',
        sourceName: '',
        sourceUrl: '',
        note: '',
      });
      setSelectedPlayer(null);
      setPlayerSearch('');
    }
  }, [open, editingRumor]);

  useEffect(() => {
    if (!playerSearch.trim() || playerSearch.length < 2) {
      setPlayerResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setPlayerSearching(true);
      try {
        const res = await fetch(
          getApiUrl(`/api/players/search?q=${encodeURIComponent(playerSearch.trim())}&limit=10`),
          { credentials: 'include' }
        );
        if (res.ok) {
          const data = await res.json();
          setPlayerResults(data);
        } else {
          setPlayerResults([]);
        }
      } catch {
        setPlayerResults([]);
      } finally {
        setPlayerSearching(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [playerSearch]);

  const handleSelectPlayer = (p: PlayerSearchResult) => {
    setSelectedPlayer(p);
    setFormData((prev) => ({ ...prev, playerId: p.id }));
    setPlayerSearch(p.name);
    setPlayerResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.playerId || !formData.fromTeamId || !formData.toTeamId) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Preencha jogador, time vendedor e time comprador.',
      });
      return;
    }
    if (formData.fromTeamId === formData.toTeamId) {
      toast({
        variant: 'destructive',
        title: 'Times inválidos',
        description: 'O time vendedor e comprador devem ser diferentes.',
      });
      return;
    }

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: editingRumor.id,
          data: {
            status: formData.status,
            feeAmount: formData.feeAmount ? Number(formData.feeAmount) : null,
            feeCurrency: formData.feeCurrency,
            contractUntil: formData.contractUntil || null,
            sourceName: formData.sourceName || null,
            sourceUrl: formData.sourceUrl || null,
            note: formData.note || null,
          },
        });
        toast({ title: 'Negociação atualizada!', description: 'Suas alterações foram salvas.' });
      } else {
        await createMutation.mutateAsync({
          playerId: formData.playerId,
          fromTeamId: formData.fromTeamId,
          toTeamId: formData.toTeamId,
          status: formData.status,
          feeAmount: formData.feeAmount ? Number(formData.feeAmount) : null,
          feeCurrency: formData.feeCurrency,
          contractUntil: formData.contractUntil || null,
          sourceName: formData.sourceName || null,
          sourceUrl: formData.sourceUrl || null,
          note: formData.note || null,
        });
        toast({ title: 'Negociação publicada!', description: 'Sua negociação foi criada com sucesso.' });
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: isEditing ? 'Erro ao atualizar' : 'Erro ao publicar',
        description: err?.message || 'Tente novamente.',
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-popover/90 backdrop-blur-md border-card-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {isEditing ? 'Editar negociação' : 'Nova negociação (Vai e Vem)'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Ajuste status e detalhes da negociação.'
              : 'Crie um rumor ou negociação oficial — com autoria do jornalista.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isEditing && (
            <div className="space-y-2">
              <Label>Jogador *</Label>
              <div className="relative" ref={playerSearchRef}>
                <Input
                  value={playerSearch}
                  onChange={(e) => {
                    setPlayerSearch(e.target.value);
                    if (!e.target.value) setSelectedPlayer(null);
                  }}
                  placeholder="Buscar por nome..."
                  className="pr-4"
                />
                {playerSearching && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-foreground-muted">
                    Buscando...
                  </span>
                )}
                {playerResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full rounded-medium border border-card-border bg-popover shadow-lg max-h-48 overflow-y-auto">
                    {playerResults.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-surface-elevated transition-colors"
                        onClick={() => handleSelectPlayer(p)}
                      >
                        {p.photoUrl ? (
                          <img
                            src={p.photoUrl}
                            alt=""
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-surface-elevated flex items-center justify-center text-xs font-medium">
                            ?
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="font-medium truncate block">{p.name}</span>
                          {p.teamName && (
                            <span className="text-xs text-foreground-muted truncate block">
                              {p.teamName}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Time vendedor (De) *</Label>
              <Select
                value={formData.fromTeamId}
                onValueChange={(v) => setFormData((prev) => ({ ...prev, fromTeamId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o time" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      <div className="flex items-center gap-2">
                        <Crest slug={t.id} alt={t.name} size="xs" />
                        {t.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Time comprador (Para) *</Label>
              <Select
                value={formData.toTeamId}
                onValueChange={(v) => setFormData((prev) => ({ ...prev, toTeamId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o time" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      <div className="flex items-center gap-2">
                        <Crest slug={t.id} alt={t.name} size="xs" />
                        {t.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tipo / Status</Label>
            <Select
              value={formData.status}
              onValueChange={(v: TransferRumorStatus) =>
                setFormData((prev) => ({ ...prev, status: v }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRANSFER_RUMOR_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Valor (opcional)</Label>
              <Input
                type="number"
                placeholder="Ex: 5"
                value={formData.feeAmount}
                onChange={(e) => setFormData((prev) => ({ ...prev, feeAmount: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Moeda</Label>
              <Select
                value={formData.feeCurrency}
                onValueChange={(v) => setFormData((prev) => ({ ...prev, feeCurrency: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Contrato até (opcional)</Label>
              <Input
                type="date"
                value={formData.contractUntil}
                onChange={(e) => setFormData((prev) => ({ ...prev, contractUntil: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fonte (opcional)</Label>
              <Input
                placeholder="Ex: GE, UOL, Fabrizio"
                value={formData.sourceName}
                onChange={(e) => setFormData((prev) => ({ ...prev, sourceName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>URL da fonte (opcional)</Label>
              <Input
                type="url"
                placeholder="https://..."
                value={formData.sourceUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, sourceUrl: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Resumo / Observação do jornalista</Label>
            <Textarea
              placeholder="Contexto ou observação (300–800 caracteres)"
              value={formData.note}
              onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
              maxLength={800}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-foreground-muted text-right font-mono">
              {formData.note.length}/800
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Publicar negociação'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
