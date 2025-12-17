import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: React.ElementType;
  color?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subValue, 
  icon: Icon,
  color = "text-blue-500" 
}) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
          {subValue && (
            <p className="text-xs text-slate-500 mt-1">{subValue}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-slate-900/80 ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};