import React, { useState, useEffect } from 'react';
import { Sparkles, Moon, Activity, X, Info, CheckCircle } from 'lucide-react';
import { getInsights, dismissInsight } from '../utils/bodyMindSync';

const BodyMindSyncInsight = () => {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    setInsights(getInsights());
  }, []);

  const handleDismiss = (id) => {
    dismissInsight(id);
    setInsights(getInsights());
  };

  if (insights.length === 0) return null;

  return (
    <div className="space-y-4 mb-8">
      {insights.map(insight => (
        <div 
          key={insight.id} 
          className={`relative p-5 rounded-2xl border-2 animate-fade-in-up overflow-hidden ${
            insight.severity === 'success' 
              ? 'bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800/50' 
              : 'bg-indigo-50 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800/50'
          }`}
        >
          {/* Subtle Background Icon */}
          <div className="absolute -right-4 -bottom-4 opacity-10">
            {insight.type === 'sleep' ? <Moon className="w-24 h-24" /> : <Activity className="w-24 h-24" />}
          </div>

          <div className="flex gap-4 relative z-10">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              insight.severity === 'success' 
                ? 'bg-green-100 dark:bg-green-800/50 text-green-600' 
                : 'bg-indigo-100 dark:bg-indigo-800/50 text-indigo-600'
            }`}>
              {insight.severity === 'success' ? <CheckCircle className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
            </div>

            <div className="flex-1 pr-8">
              <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Body-Mind Insight
                <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full ${
                  insight.severity === 'success' ? 'bg-green-200 text-green-800' : 'bg-indigo-200 text-indigo-800'
                }`}>
                  New Pattern
                </span>
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
                Noticed something — {insight.text}
              </p>
              
              <div className="mt-4 flex gap-3">
                <button className={`text-sm font-bold px-4 py-2 rounded-lg transition-colors ${
                  insight.severity === 'success' 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}>
                  View Details
                </button>
                <button 
                  onClick={() => handleDismiss(insight.id)}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-4 py-2"
                >
                  Dismiss
                </button>
              </div>
            </div>

            <button 
              onClick={() => handleDismiss(insight.id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BodyMindSyncInsight;
