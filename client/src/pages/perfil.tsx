import { useEffect, useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { MeUser } from '@/lib/auth-context';
import { User, BarChart3, Award, Loader2, ShieldCheck, Search } from 'lucide-react';

export default function PerfilPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Ensure the UI reflects permission changes (e.g., journalist approval) even with aggressive caching.
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
  }, [queryClient]);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const profileMutation = useMutation({
    mutationFn: async (data: { name: string; email: string }) => {
      return await apiRequest('PUT', '/api/profile', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram salvas com sucesso',
      });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Não foi possível atualizar o perfil',
      });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      return await apiRequest('PUT', '/api/profile/password', data);
    },
    onSuccess: () => {
      toast({
        title: 'Senha alterada',
        description: 'Sua senha foi atualizada com sucesso',
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Não foi possível alterar a senha',
      });
    },
  });

  const handleSaveProfile = async () => {
    profileMutation.mutate(profileData);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'As senhas não coincidem',
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'A nova senha deve ter pelo menos 6 caracteres',
      });
      return;
    }

    passwordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  const mockStats = {
    ratingsCount: 24,
    newsLiked: 15,
    daysActive: 7,
  };

  const { data: badges = [], refetch: refetchBadges } = useQuery({
    queryKey: ['/api/badges'],
  });

  const [adminSearchQ, setAdminSearchQ] = useState('');
  const [adminResults, setAdminResults] = useState<Array<{ id: string; email: string; name: string; journalistStatus: string | null; isJournalist: boolean }>>([]);
  const [lastAdminQuery, setLastAdminQuery] = useState('');

  const adminSearchMutation = useMutation({
    mutationFn: async (q: string) => {
      const res = await apiRequest('GET', `/api/admin/users/search?q=${encodeURIComponent(q)}`);
      return res.json() as Promise<Array<{ id: string; email: string; name: string; journalistStatus: string | null; isJournalist: boolean }>>;
    },
    onSuccess: (data, q) => {
      setAdminResults(data);
      setLastAdminQuery(q);
    },
    onError: (err: any) => {
      toast({ variant: 'destructive', title: 'Erro', description: err?.message || 'Falha ao buscar usuários' });
    },
  });

  const adminActionMutation = useMutation({
    mutationFn: async ({ userId, action }: { userId: string; action: string }) => {
      await apiRequest('PATCH', `/api/admin/journalists/${userId}`, { action });
    },
    onSuccess: (_, { action }) => {
      toast({ title: 'Sucesso', description: `Ação "${action}" concluída.` });
      if (lastAdminQuery) adminSearchMutation.mutate(lastAdminQuery);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
    onError: (err: any) => {
      toast({ variant: 'destructive', title: 'Erro', description: err?.message || 'Falha na ação' });
    },
  });

  const handleAdminSearch = () => {
    const q = adminSearchQ.trim();
    if (!q) return;
    adminSearchMutation.mutate(q);
  };

  const statusBadge = (u: MeUser | null) => {
    if (!u) return null;
    if (u.isJournalist) return { label: 'Journalist', variant: 'default' as const };
    if (u.journalistStatus === 'PENDING') return { label: 'Journalist (Pending approval)', variant: 'secondary' as const };
    return { label: 'Fan', variant: 'outline' as const };
  };

  const sb = statusBadge(user);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container px-4 py-8 max-w-5xl mx-auto">
        {/* Header Premium */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl mb-2 text-foreground">Meu Perfil</h1>
          <p className="text-foreground-secondary">Gerencie suas informações e preferências</p>
        </div>

        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className={`grid w-full ${user?.isAdmin ? 'grid-cols-4' : 'grid-cols-3'}`}>
            <TabsTrigger value="info" className="gap-2" data-testid="tab-info">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Informações</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2" data-testid="tab-stats">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Estatísticas</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="gap-2" data-testid="tab-badges">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Badges</span>
            </TabsTrigger>
            {user?.isAdmin && (
              <TabsTrigger value="admin" className="gap-2" data-testid="tab-admin">
                <ShieldCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            {sb && (
              <Card className="glass-card border-primary/30 bg-gradient-to-br from-surface-card to-surface-elevated">
                <CardContent className="pt-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge 
                      variant={sb.variant === 'default' ? 'default' : sb.variant === 'secondary' ? 'secondary' : 'outline'} 
                      className={`text-xs font-semibold ${
                        sb.variant === 'default' ? 'badge-journalist' : 
                        sb.variant === 'secondary' ? 'badge-pending' : ''
                      }`}
                    >
                      {sb.label}
                    </Badge>
                    {user?.journalistStatus === 'PENDING' && (
                      <span className="text-sm text-foreground-secondary">Aguardando aprovação do administrador.</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
                <CardDescription>Atualize suas informações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={!isEditing}
                    data-testid="input-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!isEditing}
                    data-testid="input-email"
                  />
                </div>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} disabled={profileMutation.isPending} data-testid="button-save">
                      {profileMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        'Salvar'
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} disabled={profileMutation.isPending} data-testid="button-cancel">
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditing(true)} data-testid="button-edit">
                    Editar Perfil
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
                <CardDescription>Mantenha sua conta segura</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha atual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    data-testid="input-current-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    data-testid="input-new-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    data-testid="input-confirm-password"
                  />
                </div>
                <Button onClick={handleChangePassword} disabled={passwordMutation.isPending} data-testid="button-change-password">
                  {passwordMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Alterando...
                    </>
                  ) : (
                    'Alterar Senha'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="glass-card-hover group">
                <CardContent className="p-6 text-center">
                  <div className="stat-number text-primary mb-2 group-hover:scale-110 transition-transform duration-fast">
                    {mockStats.ratingsCount}
                  </div>
                  <p className="stat-label">Avaliações Feitas</p>
                </CardContent>
              </Card>
              <Card className="glass-card-hover group">
                <CardContent className="p-6 text-center">
                  <div className="stat-number text-primary mb-2 group-hover:scale-110 transition-transform duration-fast">
                    {mockStats.newsLiked}
                  </div>
                  <p className="stat-label">Notícias Curtidas</p>
                </CardContent>
              </Card>
              <Card className="glass-card-hover group">
                <CardContent className="p-6 text-center">
                  <div className="stat-number text-primary mb-2 group-hover:scale-110 transition-transform duration-fast">
                    {mockStats.daysActive}
                  </div>
                  <p className="stat-label">Dias Ativo</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="badges">
            <div className="grid md:grid-cols-2 gap-4">
              {badges.map((badge: any) => (
                <Card 
                  key={badge.id} 
                  className={`glass-card-hover ${!badge.unlocked ? 'opacity-60 grayscale' : ''} transition-all duration-fast`}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="text-4xl">{badge.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-lg mb-1 text-foreground">{badge.name}</h3>
                      <p className="text-sm text-foreground-secondary mb-3">{badge.description}</p>
                      <Badge 
                        variant={badge.unlocked ? 'default' : 'outline'}
                        className={badge.unlocked ? 'badge-journalist' : ''}
                      >
                        {badge.unlocked ? 'Desbloqueado' : 'Bloqueado'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {user?.isAdmin && (
            <TabsContent value="admin" className="space-y-6">
              <Card className="glass-card border-warning/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-warning" />
                    Gerenciar Jornalistas
                  </CardTitle>
                  <CardDescription>Busque por email ou nome. Promova, aprove, rejeite ou revogue.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Email ou nome..."
                      value={adminSearchQ}
                      onChange={(e) => setAdminSearchQ(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAdminSearch()}
                    />
                    <Button onClick={handleAdminSearch} disabled={adminSearchMutation.isPending}>
                      {adminSearchMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                      <span className="ml-2">Buscar</span>
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {adminResults.map((r) => (
                      <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-medium border border-card-border bg-surface-card p-4 hover:bg-surface-elevated transition-colors">
                        <div>
                          <span className="font-semibold text-foreground">{r.name}</span>
                          <span className="text-foreground-secondary text-sm ml-2">{r.email}</span>
                          <Badge 
                            variant={r.isJournalist ? 'default' : r.journalistStatus === 'PENDING' ? 'secondary' : 'outline'}
                            className={`ml-2 text-xs ${
                              r.isJournalist ? 'badge-journalist' : 
                              r.journalistStatus === 'PENDING' ? 'badge-pending' : ''
                            }`}
                          >
                            {r.isJournalist ? 'Journalist' : r.journalistStatus === 'PENDING' ? 'Pending' : 'Fan'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {!r.journalistStatus && !r.isJournalist && (
                            <Button size="sm" variant="outline" onClick={() => adminActionMutation.mutate({ userId: r.id, action: 'promote' })} disabled={adminActionMutation.isPending}>
                              Promover
                            </Button>
                          )}
                          {(r.journalistStatus === 'PENDING' || r.journalistStatus === 'REJECTED') && (
                            <>
                              <Button size="sm" variant="default" onClick={() => adminActionMutation.mutate({ userId: r.id, action: 'approve' })} disabled={adminActionMutation.isPending}>
                                Aprovar
                              </Button>
                              {r.journalistStatus === 'PENDING' && (
                                <Button size="sm" variant="destructive" onClick={() => adminActionMutation.mutate({ userId: r.id, action: 'reject' })} disabled={adminActionMutation.isPending}>
                                  Rejeitar
                                </Button>
                              )}
                            </>
                          )}
                          {(r.isJournalist || r.journalistStatus === 'REJECTED' || r.journalistStatus === 'PENDING') && (
                            <Button size="sm" variant="secondary" onClick={() => adminActionMutation.mutate({ userId: r.id, action: 'revoke' })} disabled={adminActionMutation.isPending}>
                              Revogar
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {adminSearchMutation.isSuccess && adminResults.length === 0 && lastAdminQuery && (
                      <p className="text-sm text-muted-foreground">Nenhum usuário encontrado.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
