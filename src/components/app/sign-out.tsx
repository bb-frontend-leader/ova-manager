import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/hooks/useAuth';

import { Button } from '../ui';

export const SignOut = () => {
  const { logout } = useAuth();

  // ProtectedRoute sends the user to /login as soon as the session is cleared
  const handleSignOut = () => {
    logout().catch(() => toast.error('Could not reach the server to close your session.'));
  };

  return (
    <Button variant="reverse" className="bg-bw text-text" aria-label="Sign out" onClick={handleSignOut}>
      <LogOut className="h-4 w-4 mr-2" /> <span className="hidden md:inline">Sign Out</span>
    </Button>
  );
};
