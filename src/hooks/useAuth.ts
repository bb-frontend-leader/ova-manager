import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import authService from '@/services/auth-service';
import type { LoginCredentials } from '@/types/auth';

const AUTH_QUERY_KEY = ['auth', 'me'] as const;

export const useAuth = () => {
  const queryClient = useQueryClient();

  // The session is owned by the server (HttpOnly cookie), so the UI asks it who is signed in.
  const session = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: () => authService.getSession(),
    retry: false,
    staleTime: 5 * 60 * 1000
  });

  const loginMutation = useMutation({
    mutationFn: ({ username, password }: LoginCredentials) => authService.login(username, password),
    onSuccess: (response) => queryClient.setQueryData(AUTH_QUERY_KEY, response.user)
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    // Sign out locally even if the server couldn't be reached, and drop data cached for that session.
    onSettled: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.removeQueries({ queryKey: ['ovas'] });
      queryClient.removeQueries({ queryKey: ['groups'] });
    }
  });

  const user = session.data ?? null;

  return {
    user,
    isAuthenticated: user !== null,
    isLoading: session.isLoading,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync
  };
};
