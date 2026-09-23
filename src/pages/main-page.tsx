import { useEffect } from 'react';
import { ServerCrash } from 'lucide-react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Alert, AlertDescription, AlertTitle, Footer, Header } from '@ui';

import { OvaView, OvaViewSkeleton } from '@/components/app';
import { useAuth } from '@/hooks/useAuth';
import ovaService from '@/services/ova-service';

const MainPage = () => {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  // Get the OVAs
  const ovas = useQuery({
    queryKey: ['ovas'],
    queryFn: () => ovaService.fetchOvas(),
    refetchOnWindowFocus: false,
    retry: false
  });

  // Get the OVA groups
  const groups = useQuery({
    queryKey: ['groups'],
    queryFn: () => ovaService.fetchOvaGroups(),
    refetchOnWindowFocus: false,
    retry: false
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);

  // Check authentication before rendering
  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="relative h-screen w-full bg-bg grid grid-rows-[auto_1fr_auto] gap-3.5 overflow-hidden">
      <Header />
      <main className="container mx-auto h-full min-h-0 w-[min(100%-1rem,150ch)]">
        <section className="w-full h-full grid grid-rows-[auto_1fr] gap-2.5">
          {ovas.isError && (
            <div className="container-border h-fit min-h-0 overflow-y-auto px-10 py-8 not-prose z-15 relative bg-[radial-gradient(#80808080_1px,transparent_1px)] shadow-light dark:shadow-dark bg-size-[16px_16px]">
              <Alert>
                <ServerCrash className="h-6 w-6 inline-flex justify-center items-center" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{ovas.error instanceof Error ? ovas.error.message : 'Error fetching data from API'}</AlertDescription>
              </Alert>
            </div>
          )}

          {groups.isError && (
            <div className="container-border h-fit min-h-0 overflow-y-auto px-10 py-8 not-prose z-15 relative bg-[radial-gradient(#80808080_1px,transparent_1px)] shadow-light dark:shadow-dark bg-size-[16px_16px]">
              <Alert>
                <ServerCrash className="h-6 w-6 inline-flex justify-center items-center" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{groups.error instanceof Error ? groups.error.message : 'Error fetching groups from API'}</AlertDescription>
              </Alert>
            </div>
          )}

          {(ovas.isLoading || groups.isLoading) && (
            <div className="h-full min-h-0 overflow-y-auto">
              <OvaViewSkeleton
                viewMode={new URLSearchParams(window.location.search).get('view') === 'list' ? 'list' : 'grid'}
              />
            </div>
          )}

          {ovas.isSuccess && groups.isSuccess && <OvaView data={ovas.data.data} groups={groups.data.data} />}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MainPage;
