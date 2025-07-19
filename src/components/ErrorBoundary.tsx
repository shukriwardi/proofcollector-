
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error('🚨 Error boundary caught error:', error);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Error boundary details:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6">
          <Card className="p-12 bg-gray-900 border border-red-800 shadow-2xl rounded-2xl text-center max-w-md w-full">
            <div className="w-20 h-20 bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-red-800">
              <span className="text-4xl">💥</span>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-6">Something Went Wrong</h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              The app encountered an unexpected error. This shouldn't affect other parts of the application.
            </p>
            
            <div className="space-y-4">
              <Button 
                onClick={this.handleReset}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Try Again
              </Button>
              
              <Button 
                onClick={this.handleReload}
                variant="outline"
                className="w-full border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white hover:border-purple-500"
              >
                Reload Page
              </Button>
              
              <Button 
                onClick={this.handleGoHome}
                variant="outline"
                className="w-full border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white hover:border-purple-500"
              >
                Go to Homepage
              </Button>
            </div>
            
            {this.state.error && (
              <details className="mt-8 text-left">
                <summary className="text-gray-400 cursor-pointer hover:text-gray-300">
                  Technical Details
                </summary>
                <pre className="mt-4 p-4 bg-gray-800 rounded text-xs text-red-400 overflow-auto max-h-32">
                  {this.state.error.toString()}
                  {this.state.errorInfo && (
                    <>
                      {'\n\nComponent Stack:'}
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
