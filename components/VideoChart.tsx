import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { VideoData } from '../types';

interface VideoChartProps {
  videos: VideoData[];
}

export const VideoChart: React.FC<VideoChartProps> = ({ videos }) => {
  // Process data for chart
  const data = videos.slice(0, 10).reverse().map(video => ({
    name: video.snippet.title.length > 15 ? video.snippet.title.substring(0, 15) + '...' : video.snippet.title,
    fullTitle: video.snippet.title,
    views: parseInt(video.statistics.viewCount),
    likes: parseInt(video.statistics.likeCount),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-sm font-semibold text-white mb-2">{payload[0].payload.fullTitle}</p>
          <p className="text-xs text-blue-400">Views: {payload[0].value.toLocaleString()}</p>
          <p className="text-xs text-emerald-400">Likes: {payload[1].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[350px] bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4">
      <h3 className="text-lg font-semibold text-slate-200 mb-4 px-2">Recent Video Performance</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value >= 1000000 ? `${(value/1000000).toFixed(1)}M` : value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}
          />
          <Tooltip content={<CustomTooltip />} cursor={{fill: '#334155', opacity: 0.2}} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="views" name="Views" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
          <Bar dataKey="likes" name="Likes" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};