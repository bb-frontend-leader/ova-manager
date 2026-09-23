import { Component, type ErrorInfo, type ReactNode } from 'react';
import { TriangleAlert } from 'lucide-react';

import { Button } from '../ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

// Error boundaries can only be class components. Without one, a render error blanks the whole app.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error:', error, info.componentStack);
  }

  private reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-12">
        <Card className="w-full max-w-md" role="alert">
          <CardHeader>
            <CardTitle>
              <h1 className="flex items-center gap-2 text-xl font-bold">
                <TriangleAlert className="h-5 w-5" aria-hidden="true" />
                Something went wrong
              </h1>
            </CardTitle>
            <CardDescription>
              An unexpected error interrupted the app. You can try again or reload the page.
            </CardDescription>
          </CardHeader>
          <CardFooter className="gap-2.5">
            <Button variant="neutral" onClick={this.reset}>
              Try again
            </Button>
            <Button onClick={() => window.location.reload()}>Reload page</Button>
          </CardFooter>
        </Card>
      </main>
    );
  }
}
