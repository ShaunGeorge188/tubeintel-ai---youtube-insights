import React from 'react';
import { Youtube, BarChart3, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onOpenSettings: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onOpenSettings }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 p-2 rounded-lg">
              <Youtube className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              TubeIntel AI
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={onOpenSettings}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
              title="API Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center gap-2 text-xs font-medium px-3 py-1 bg-slate-800 rounded-full text-slate-400 border border-slate-700">
              <BarChart3 className="w-3 h-3" />
              <span>Real-Time Data</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-slate-500 text-sm">
        <p>Powered by YouTube Data API v3 & Google Gemini 2.5 Flash</p>
      </footer>
    </div>
  );
};