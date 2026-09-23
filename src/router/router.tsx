import { Redirect, Route, Router, Switch } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { Toaster } from '@ui';

import { ProtectedRoute } from '@/components/app';
import LoginPage from '@/pages/login-page';
import MainPage from '@/pages/main-page';

const App = () => {
  return (
    <>
      <Router hook={useHashLocation}>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/">
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          </Route>
          {/* Unknown paths (#/anything) go home instead of rendering a blank page */}
          <Route>
            <Redirect to="/" replace />
          </Route>
        </Switch>
      </Router>
      <Toaster />
    </>
  );
};

export default App;
