import { Component, ErrorInfo, ReactNode } from 'react';

interface GlobalErrorBoundaryProps {
  children: ReactNode;
}

interface GlobalErrorBoundaryState {
  hasError: boolean;
}

/**
 * Global React error boundary to avoid white screens in production.
 * Ensures unexpected render errors are captured and a friendly UI is shown.
 */
export class GlobalErrorBoundary extends Component<
  GlobalErrorBoundaryProps,
  GlobalErrorBoundaryState
> {
  state: GlobalErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): GlobalErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In production this can be wired to an observability tool (Sentry, Datadog, etc.)
    // For this MVP we rely on the backend logs and browser console.
     
    console.error('Global React error boundary caught an error', {
      error,
      errorInfo,
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
          <div className="max-w-md text-center space-y-4 px-4">
            <h1 className="text-2xl font-semibold">
              Something went wrong on the client
            </h1>
            <p className="text-slate-300 text-sm">
              An unexpected error occurred while rendering the interface.
              Please refresh the page. If the problem persists, contact support
              with the time of occurrence so we can correlate with backend logs.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

