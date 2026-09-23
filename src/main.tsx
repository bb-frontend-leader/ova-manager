import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import { ThemeProvider } from 'next-themes';

import { ErrorBoundary } from '@/components/app/error-boundary';

import { TanStackProvider } from './plugins/tanstack-provider.tsx';
import App from './router/router.tsx';

import '@styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
      <TanStackProvider>
        {/* Honor the OS "reduce motion" setting: transform/layout animations are skipped */}
        <MotionConfig reducedMotion="user">
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </MotionConfig>
      </TanStackProvider>
    </ThemeProvider>
  </StrictMode>
);
