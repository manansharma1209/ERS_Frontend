import { Component } from 'react';
import { ErrorFallback } from './ui/ErrorFallback';
import { errorTracking } from '../lib/errorTracking';

export class ErrorBoundary extends Component {
  state = { error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    errorTracking.logError({
      error,
      category: 'React',
      context: { errorInfo }
    });
  }

  handleReset = () => {
    this.setState({ error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <ErrorFallback 
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

export function withErrorBoundary(Component, onReset) {
  return function WithErrorBoundary(props) {
    return (
      <ErrorBoundary onReset={onReset}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}