import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("SignalForge render error", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <section className="rounded-lg border border-forge-coral/40 bg-forge-coral/10 p-5">
          <h2 className="text-lg font-semibold text-white">Strategy workspace could not render</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            The demo recovered from a UI error. Refresh the page or adjust the selected token universe and try again.
          </p>
          <p className="mt-3 text-xs text-slate-500">{this.state.error.message}</p>
        </section>
      );
    }

    return this.props.children;
  }
}
