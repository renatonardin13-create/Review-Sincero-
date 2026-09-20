import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class SettingsErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[SettingsErrorBoundary] Erro capturado no gerenciador de banners:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-[#121214] text-white rounded-2xl border border-[#27272a] my-8">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 mb-4 border border-red-500/20">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">Erro ao carregar o gerenciador de banners.</h2>
          <p className="text-gray-400 text-center max-w-md mb-6 text-sm">
            Ocorreu uma exceção inesperada ao renderizar as configurações ou o gerenciador de slides. Nossos dados foram protegidos.
          </p>
          <button
            onClick={this.handleReload}
            className="flex items-center gap-2 px-6 py-3 bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] font-bold rounded-xl transition-all shadow-lg shadow-[#F5C542]/10 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Recarregar Página</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
