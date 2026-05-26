import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  error: Error | null;
  retryCount: number;
}

const MAX_RETRIES = 3;

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null, retryCount: 0 };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[BiasSense] Uncaught error:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return this.props.fallback ?? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: 12,
          fontFamily: 'Geist, sans-serif',
          color: 'var(--text, #e9e2cf)',
          background: 'var(--bg, #0b0c10)',
        }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Something went wrong</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted, #8a8070)', maxWidth: 360, textAlign: 'center' }}>
            {this.state.error.message}
          </div>
          <button
            disabled={this.state.retryCount >= MAX_RETRIES}
            onClick={() => {
              if (this.state.retryCount >= MAX_RETRIES) {
                window.location.reload();
                return;
              }
              this.setState((prev) => ({ error: null, retryCount: prev.retryCount + 1 }));
            }}
            style={{
              marginTop: 8,
              padding: '8px 16px',
              borderRadius: 8,
              background: 'var(--cream, #e9e2cf)',
              color: '#0b0c10',
              border: 'none',
              fontSize: 13,
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            {this.state.retryCount >= MAX_RETRIES ? 'Reload page' : 'Try again'}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
