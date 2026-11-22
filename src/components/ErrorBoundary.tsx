import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('DeepScript ErrorBoundary caught an error:', error, errorInfo);
  }

  public handleReload = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '400px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center',
          color: 'var(--text-primary, #f8fafc)',
          background: 'var(--panel-bg, rgba(22, 22, 26, 0.75))',
          borderRadius: '16px',
          border: '1px solid var(--panel-border, rgba(255, 255, 255, 0.1))',
          margin: '20px'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'rgba(239, 68, 68, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            color: '#f87171'
          }}>
            <AlertTriangle size={28} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
            {this.props.fallbackTitle || 'Workspace View Recovered'}
          </h3>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary, #94a3b8)', maxWidth: '440px', lineHeight: 1.6, marginBottom: '20px' }}>
            A temporary component rendering error was safely intercepted. Your session data is intact.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: '10px 22px',
              fontSize: '13px',
              fontWeight: '600',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--gta-pink, #e6007e) 0%, var(--gta-orange, #ff9600) 100%)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(230, 0, 126, 0.25)'
            }}
          >
            <RefreshCw size={15} /> Reload Workspace
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

