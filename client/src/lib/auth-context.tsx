import { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest, getQueryFn } from './queryClient';

export interface MeUser {
  id: string;
  name: string;
  email: string;
  teamId: string | null;
  avatarUrl: string | null;
  userType: string;
  journalistStatus?: 'APPROVED' | 'PENDING' | 'REJECTED' | 'SUSPENDED' | null;
  isJournalist?: boolean;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: MeUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, teamId?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<MeUser | null>({
    queryKey: ['/api/auth/me'],
    queryFn: getQueryFn<MeUser | null>({ on401: 'returnNull' }),
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      return await apiRequest('POST', '/api/auth/login', { email, password });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/auth/logout', {});
    },
    onSuccess: () => {
      queryClient.setQueryData(['/api/auth/me'], null);
      queryClient.clear();
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ name, email, password, teamId }: { name: string; email: string; password: string; teamId?: string }) => {
      return await apiRequest('POST', '/api/auth/register', { name, email, password, teamId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const register = async (name: string, email: string, password: string, teamId?: string) => {
    await registerMutation.mutateAsync({ name, email, password, teamId });
  };

  return (
    <AuthContext.Provider value={{ user: user ?? null, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
