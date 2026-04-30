import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Activity, Calendar } from 'lucide-react';

const MoodAnalytics = () => {
  const { user } = useSelector((state) => state.auth);
  const [report, setReport] = useState(null);
  const [journals, setJournals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [reportRes, journalRes] = await Promise.all([
          axios.get('http://localhost:5000/api/report', config),
          axios.get('http://localhost:5000/api/journal', config)
        ]);
        
        setReport(reportRes.data);
        
        
        const formattedData = journalRes.data
          .slice(0, 14) 
          .reverse() 
          .map(j => ({
            date: new Date(j.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            mood: j.mood,
            title: j.title
          }));
          
        setJournals(formattedData);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-dark-surface p-3 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800">
          <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
          <p className="text-primary-600 dark:text-primary-400 font-bold mt-1">Mood: {payload[0].value}/10</p>
          {payload[0].payload.title && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-1 max-w-[200px]">{payload[0].payload.title}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 py-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-purple-500" /> Mood Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Visualize your emotional well-being trends over time.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-500">Loading your analytics...</p>
        </div>
      ) : (
        <>
          {}
          <div className="card shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" /> Mood Trend (Last 14 Entries)
              </h2>
            </div>
            
            <div className="h-[400px] w-full">
              {journals.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={journals} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:opacity-20" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6b7280', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      domain={[0, 10]} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorMood)" 
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#8b5cf6' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Not enough data yet. Keep journaling!
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {}
            <div className="card bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/10 dark:to-dark-surface border-primary-100 dark:border-primary-800/30">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AI Wellness Report</h2>
              <div className="prose dark:prose-invert">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {report?.insights || "Your AI insights will appear here once you start journaling regularly."}
                </p>
              </div>
            </div>

            {}
            <div className="card space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-500" /> Summary Statistics
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Average Mood</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {report?.averageMood ? report.averageMood.toFixed(1) : '-'} <span className="text-sm font-normal text-gray-500">/10</span>
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Entries</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {report?.streaks || 0}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Highest Mood</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {journals.length > 0 ? Math.max(...journals.map(j => j.mood)) : '-'} <span className="text-sm font-normal text-gray-500">/10</span>
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Lowest Mood</p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {journals.length > 0 ? Math.min(...journals.map(j => j.mood)) : '-'} <span className="text-sm font-normal text-gray-500">/10</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MoodAnalytics;
