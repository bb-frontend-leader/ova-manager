import { LogOut } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { useNotice } from '@/hooks/useNotice';

import { Button } from '../ui';

export const SignOut = () => {
  const { logout } = useAuth();
  const { showNotice } = useNotice();

  // ProtectedRoute sends the user to /login as soon as the session is cleared
  const handleSignOut = () => {
    logout().catch(() =>
      showNotice({
        variant: 'error',
        title: "We couldn't fully sign you out",
        description:
          "You were taken back to the sign-in screen, but we couldn't reach the server to close your session, so it may still be open.",
        steps: [
          'Check that your internet connection is working.',
          'If you are on a shared computer, reload this page. If the app opens without asking for your password, press "Sign Out" again.'
        ]
      })
    );
  };

  return (
    <Button variant="reverse" className="bg-bw text-text" aria-label="Sign out" onClick={handleSignOut}>
      <LogOut className="h-4 w-4 mr-2" /> <span className="hidden md:inline">Sign Out</span>
    </Button>
  );
};
