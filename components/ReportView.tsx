import React from 'react';
import { AIReport } from '../types';
import { Sparkles, TrendingUp, Lightbulb, CheckCircle2 } from 'lucide-react';

interface ReportViewProps {
  report: AIReport;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export const ReportView: React.FC<ReportViewProps> = ({ report, onRegenerate, isRegenerating }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI Strategy Report</h2>
              <p className="text-indigo-200 text-sm">Generated at {report.generatedAt} using Gemini 2.5 Flash</p>
            </div>
          </div>
          
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isRegenerating ? 'Analyzing...' : 'Regenerate'}
            <Sparkles className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Executive Summary */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-indigo-300 mb-3 flex items-center gap-2">
              Executive Summary
            </h3>
            <p className="text-slate-200 leading-relaxed text-lg">
              {report.executiveSummary}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Key Insights */}
            <div>
              <h3 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Key Performance Insights
              </h3>
              <ul className="space-y-3">
                {report.keyInsights.map((insight, idx) => (
                  <li key={idx} className="flex gap-3 items-start bg-emerald-950/30 p-3 rounded-lg border border-emerald-900/50">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggestions */}
            <div>
              <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Strategic Suggestions
              </h3>
              <ul className="space-y-3">
                {report.improvementSuggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex gap-3 items-start bg-amber-950/30 p-3 rounded-lg border border-amber-900/50">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      {idx + 1}
                    </div>
                    <span className="text-slate-300 text-sm">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};