import { useEffect } from 'react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

import LoginForm from '@/components/app/login-form';
import { useAuth } from '@/hooks/useAuth';

const LoginPage = () => {
  const [, setLocation] = useLocation();
  const { login, isAuthenticated } = useAuth();

  // Go to the main page as soon as there is a session (already signed in, or just logged in)
  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);

  const handleLogin = async (username: string, password: string) => {
    await login({ username, password }); // rejects with a user-facing message, shown by LoginForm
    toast.success('Welcome! You have successfully logged in.');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-12 sm:px-6 lg:px-8 bg-[radial-gradient(#80808080_1px,transparent_1px)] bg-size-[16px_16px]">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-bold tracking-tight ">Sign in to your account</h1>
          <p className="mt-2 text-center text-sm text-text/60">OVA Manager System</p>
        </div>
        <LoginForm onLogin={handleLogin} />
      </div>
    </main>
  );
};

export default LoginPage;
