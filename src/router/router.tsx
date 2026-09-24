import { Redirect, Route, Router, Switch } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';

import { NoticeProvider, ProtectedRoute } from '@/components/app';
import LoginPage from '@/pages/login-page';
import MainPage from '@/pages/main-page';

const App = () => {
  return (
    <NoticeProvider>
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
    </NoticeProvider>
  );
};

export default App;
