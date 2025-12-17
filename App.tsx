import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { MetricCard } from './components/MetricCard';
import { VideoChart } from './components/VideoChart';
import { ReportView } from './components/ReportView';
import { fetchChannelDetails, fetchRecentVideos } from './services/youtubeService';
import { generateChannelReport } from './services/geminiService';
import { AppState } from './types';
import { 
  Users, 
  Eye, 
  Video, 
  Search, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  KeyRound
} from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [state, setState] = useState<AppState>({
    youtubeApiKey: '',
    channelInput: '@GoogleDevelopers', // Default demo channel
    channelData: null,
    recentVideos: [],
    report: null,
    loading: false,
    error: null,
    analyzing: false,
  });

  const [showSettings, setShowSettings] = useState(false);

  // --- Handlers ---

  const handleFetchData = async () => {
    if (!state.youtubeApiKey) {
      setShowSettings(true);
      return;
    }

    if (!state.channelInput) return;

    setState(prev => ({ ...prev, loading: true, error: null, report: null }));

    try {
      // 1. Fetch Channel Info
      const channel = await fetchChannelDetails(state.channelInput, state.youtubeApiKey);
      
      // 2. Fetch Recent Videos using Uploads Playlist ID
      const uploadsId = channel.contentDetails.relatedPlaylists.uploads;
      const videos = await fetchRecentVideos(uploadsId, state.youtubeApiKey);

      setState(prev => ({
        ...prev,
        channelData: channel,
        recentVideos: videos,
        loading: false
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch YouTube data'
      }));
    }
  };

  const handleGenerateReport = async () => {
    if (!state.channelData || state.recentVideos.length === 0) return;

    setState(prev => ({ ...prev, analyzing: true }));

    try {
      const report = await generateChannelReport(state.channelData, state.recentVideos);
      setState(prev => ({ ...prev, report, analyzing: false }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        analyzing: false,
        error: err instanceof Error ? err.message : 'Failed to generate AI report'
      }));
    }
  };

  // --- Formatters ---
  const formatNumber = (numStr: string) => {
    return new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(parseInt(numStr));
  };

  // --- Render ---

  return (
    <Layout onOpenSettings={() => setShowSettings(true)}>
      {/* Settings Modal (Simple Overlay) */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <KeyRound className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-white">API Configuration</h2>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              To fetch real data, you need a <strong>YouTube Data API v3 Key</strong>.
              This key is stored only in your browser memory.
            </p>
            
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              YouTube API Key
            </label>
            <input
              type="password"
              value={state.youtubeApiKey}
              onChange={(e) => setState(prev => ({ ...prev, youtubeApiKey: e.target.value }))}
              placeholder="AIzaSy..."
              className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-6 font-mono text-sm"
            />
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowSettings(false)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
              >
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero / Search Section */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
          Unlock Your Channel's <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">True Potential</span>
        </h2>
        <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
          Get real-time metrics and AI-powered strategic insights for any public YouTube channel in seconds.
        </p>

        <div className="relative max-w-lg mx-auto group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex bg-slate-900 rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl">
            <input
              type="text"
              value={state.channelInput}
              onChange={(e) => setState(prev => ({ ...prev, channelInput: e.target.value }))}
              placeholder="Enter Channel ID or Handle (e.g., @GoogleDevelopers)"
              className="flex-1 bg-transparent text-white px-6 py-4 focus:outline-none placeholder-slate-500"
              onKeyDown={(e) => e.key === 'Enter' && handleFetchData()}
            />
            <button
              onClick={handleFetchData}
              disabled={state.loading}
              className="px-6 bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors flex items-center gap-2 disabled:bg-slate-700"
            >
              {state.loading ? 'Fetching...' : (
                <>
                  Analyze <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
        
        {!state.youtubeApiKey && (
          <p onClick={() => setShowSettings(true)} className="text-xs text-yellow-500/80 mt-4 cursor-pointer hover:underline">
            ⚠️ YouTube API Key Required. Click to configure.
          </p>
        )}

        {state.error && (
          <div className="mt-6 bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center justify-center gap-2 max-w-lg mx-auto">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{state.error}</p>
          </div>
        )}
      </div>

      {/* Dashboard Section */}
      {state.channelData && (
        <div className="animate-fade-in-up">
          {/* Header Info */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-800">
            <img 
              src={state.channelData.snippet.thumbnails.medium.url} 
              alt={state.channelData.snippet.title}
              className="w-16 h-16 rounded-full border-2 border-slate-700 shadow-lg"
            />
            <div>
              <h2 className="text-2xl font-bold text-white">{state.channelData.snippet.title}</h2>
              <p className="text-slate-400 text-sm">{state.channelData.snippet.customUrl}</p>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <MetricCard
              title="Total Subscribers"
              value={formatNumber(state.channelData.statistics.subscriberCount)}
              icon={Users}
              color="text-blue-400"
            />
            <MetricCard
              title="Total Views"
              value={formatNumber(state.channelData.statistics.viewCount)}
              icon={Eye}
              color="text-emerald-400"
            />
            <MetricCard
              title="Video Count"
              value={formatNumber(state.channelData.statistics.videoCount)}
              icon={Video}
              color="text-purple-400"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Chart */}
            <div className="lg:col-span-2">
              <VideoChart videos={state.recentVideos} />
            </div>

            {/* AI Action Panel */}
            <div className="lg:col-span-1 flex flex-col justify-center items-center bg-slate-800/30 border border-slate-700 rounded-2xl p-8 text-center">
              <div className="bg-indigo-500/10 p-4 rounded-full mb-6">
                <Sparkles className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Generate AI Report</h3>
              <p className="text-slate-400 text-sm mb-6">
                Use Gemini to analyze your recent performance and discover actionable growth opportunities.
              </p>
              <button
                onClick={handleGenerateReport}
                disabled={state.analyzing}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-900/20 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.analyzing ? 'Generating Insights...' : 'Create Strategy Report'}
              </button>
            </div>
          </div>

          {/* AI Report Result */}
          {state.report && (
            <div className="animate-fade-in-up">
              <ReportView 
                report={state.report} 
                onRegenerate={handleGenerateReport}
                isRegenerating={state.analyzing}
              />
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default App;