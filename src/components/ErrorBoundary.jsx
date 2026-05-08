import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
          <section className="max-w-lg rounded-3xl border border-white/10 bg-white/10 p-8 text-center">
            <h1 className="font-display text-3xl font-bold">Mission console paused</h1>
            <p className="mt-3 text-slate-300">{this.state.message}</p>
            <button className="button-primary mt-6" onClick={() => window.location.reload()}>
              Reload dashboard
            </button>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}
