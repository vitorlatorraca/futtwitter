import { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest, getApiUrl } from './queryClient';

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
  handle?: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  coverPhotoUrl?: string | null;
  followersCount?: number;
  followingCount?: number;
}

interface AuthContextType {
  user: MeUser | null;
  isLoading: boolean;
  isError: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, teamId?: string, handle?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: user, isLoading, isError } = useQuery<MeUser | null>({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      try {
        const res = await fetch(getApiUrl('/api/auth/me'), { credentials: 'include' });
        if (!res.ok) return null;
        const data = await res.json();
        return data;
      } catch {
        return null; // rede/erro → trata como não logado
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      return await apiRequest('POST', '/api/auth/login', { email, password });
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/auth/logout', {});
    },
    onSuccess: () => {
      queryClient.setQueryData(['/api/auth/me'], null);
      queryClient.clear();
      window.location.href = '/login';
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ name, email, password, teamId, handle }: { name: string; email: string; password: string; teamId?: string; handle?: string }) => {
      return await apiRequest('POST', '/api/auth/register', { name, email, password, teamId, handle });
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const register = async (name: string, email: string, password: string, teamId?: string, handle?: string) => {
    await registerMutation.mutateAsync({ name, email, password, teamId, handle });
  };

  return (
    <AuthContext.Provider value={{ user: user ?? null, isLoading, isError: isError ?? false, login, logout, register }}>
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
