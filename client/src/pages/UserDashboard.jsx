import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import {
  BookOpen, MessageSquare, Target, Zap, Smile, Meh, Frown,
  Brain, Cloud, Heart, Compass, Moon, Flame, Award, Sparkles,
  Lightbulb, CheckCircle2, Send, RefreshCw, TrendingUp
} from 'lucide-react';
import { fetchDashboardStats, quickCreateJournal, resetDashboard } from '../store/features/dashboardSlice';
import CrisisSupport from '../components/CrisisSupport';


const promptsByMood = {
  low:    ['What is one small thing that brought you even a little comfort today?', 'What would you tell a friend who is feeling the way you do right now?', 'What is one thing you are looking forward to, no matter how small?'],
  mid:    ['Describe a moment today where you felt most like yourself.', 'What emotion showed up most often today, and what do you think triggered it?', 'What is something you want to let go of before tomorrow?'],
  high:   ['What went well today and what role did you play in that?', 'How did you take care of yourself today?', 'What lesson did today teach you that you want to remember?'],
};

const getMoodBucket = (score) => score <= 3 ? 'low' : score <= 6 ? 'mid' : 'high';


const getMoodColor = (mood) => {
  if (!mood) return 'bg-gray-100 dark:bg-gray-800';
  if (mood >= 8) return 'bg-green-400';
  if (mood >= 6) return 'bg-green-300';
  if (mood >= 4) return 'bg-amber-300';
  if (mood >= 2) return 'bg-orange-300';
  return 'bg-red-400';
};

const buildHeatmapGrid = (heatmapData) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const map = {};
  (heatmapData || []).forEach((d) => { map[d.date] = d; });
  const cells = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    cells.push({ day, dateStr, ...(map[dateStr] || {}) });
  }
  return cells;
};


const milestones = [
  { days: 7,   label: '1 Week Streak',  icon: Flame,       color: 'text-orange-500' },
  { days: 30,  label: '1 Month Strong', icon: Award,       color: 'text-purple-500' },
  { days: 100, label: 'Century Club',   icon: Sparkles,    color: 'text-yellow-500' },
];


const Skeleton = ({ className }) => <div className={`skeleton rounded-xl ${className}`} />;


const Briefcase = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);


const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { stats, isLoading, isSaving, saveSuccess } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedMood, setSelectedMood] = useState(5);
  const [moodLabel, setMoodLabel]       = useState('Happy');
  const [prompts, setPrompts]           = useState(promptsByMood.high);
  const [quickEntry, setQuickEntry]     = useState({ title: '', content: '', mood: 5 });
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [savedMsg, setSavedMsg]         = useState(false);

  // Load stats on mount
  useEffect(() => { if (user) dispatch(fetchDashboardStats()); }, [user, dispatch]);

  // Refresh prompts when mood changes
  useEffect(() => {
    const bucket = getMoodBucket(selectedMood);
    setPrompts(promptsByMood[bucket]);
  }, [selectedMood]);

  // Handle save success feedback
  useEffect(() => {
    if (saveSuccess) {
      setSavedMsg(true);
      setQuickEntry({ title: '', content: '', mood: 5 });
      setShowQuickForm(false);
      setTimeout(() => { setSavedMsg(false); dispatch(resetDashboard()); dispatch(fetchDashboardStats()); }, 2000);
    }
  }, [saveSuccess, dispatch]);

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    dispatch(quickCreateJournal({ ...quickEntry, sentiment: 'Neutral' }));
  };

  const applyPrompt = (p) => {
    setQuickEntry((prev) => ({ ...prev, content: p + '\n\n' }));
    setShowQuickForm(true);
  };

  const refreshPrompts = () => {
    const bucket = getMoodBucket(selectedMood);
    const pool = promptsByMood[bucket];
    setPrompts([...pool].sort(() => Math.random() - 0.5));
  };

  const streak       = stats?.streak       ?? 0;
  const totalEntries = stats?.totalEntries  ?? 0;
  const weeklyMood   = stats?.weeklyMood    ?? [];
  const heatmapCells = buildHeatmapGrid(stats?.heatmap);
  const sentiment    = stats?.sentimentCounts ?? {};
  const insights     = stats?.insights ?? null;
  const insightTip   = stats?.insightPattern ?? null;

  const moodOptions = [
    { icon: Frown,  label: 'Struggling', value: 2, activeClass: 'text-red-500 ring-4 ring-red-100 dark:ring-red-900/30 scale-110' },
    { icon: Meh,    label: 'Okay',       value: 5, activeClass: 'text-amber-500 ring-4 ring-amber-100 dark:ring-amber-900/30 scale-110' },
    { icon: Smile,  label: 'Happy',      value: 8, activeClass: 'text-green-500 ring-4 ring-green-100 dark:ring-green-900/30 scale-110' },
  ];

  const monthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">

      {}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Good morning, {user?.name?.split(' ')[0] || 'Friend'} ☀️
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Take a breath. Here is your wellness overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {streak > 0 && (
            <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 px-4 py-2 rounded-xl">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-orange-600 dark:text-orange-400">{streak} day streak</span>
            </div>
          )}
          <Link to="/journal" className="btn-primary">
            <BookOpen className="w-4 h-4" /> Full Journal
          </Link>
        </div>
      </div>

      {}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Journal Entries', value: isLoading ? '—' : totalEntries, icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
          { label: 'Day Streak',      value: isLoading ? '—' : streak,       icon: Flame,    color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
          { label: 'Positive Days',   value: isLoading ? '—' : (sentiment.Positive || 0), icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/20' },
          { label: 'AI Chats',        value: '—',                             icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        ].map((s, i) => (
          <div key={i} className="card flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {}
        <div className="card space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Smile className="w-6 h-6 text-yellow-500" /> Today's Check-in
            </h2>
            {streak >= 7 && <span className="text-xs font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full flex items-center gap-1"><Flame className="w-3 h-3" /> {streak}-day streak!</span>}
          </div>

          <div className="flex gap-4 justify-center">
            {moodOptions.map((m) => (
              <button
                key={m.label}
                onClick={() => { setSelectedMood(m.value); setMoodLabel(m.label); }}
                className={`flex flex-col items-center w-20 h-20 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-md ${moodLabel === m.label ? m.activeClass : 'text-gray-400 hover:text-gray-600'}`}
              >
                <m.icon className="w-10 h-10 mt-3 mb-1" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">{m.label}</span>
              </button>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">7-Day Mood Trend</h3>
            {isLoading ? <Skeleton className="h-40 w-full" /> : (
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyMood}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <YAxis hide domain={[0, 10]} />
                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} formatter={(v) => [`${v}/10`, 'Mood']} />
                    <Line type="monotone" dataKey="score" stroke="#14b8a6" strokeWidth={3} dot={{ r: 5, fill: '#14b8a6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {}
        <div className="card space-y-5 flex flex-col">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-500" /> Quick Entry
            </h2>
            {savedMsg && (
              <span className="text-green-600 dark:text-green-400 text-sm font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Saved!
              </span>
            )}
          </div>

          {}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-800/40">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> AI Writing Prompts
              </p>
              <button onClick={refreshPrompts} className="text-indigo-500 hover:text-indigo-700 transition-colors" title="Refresh prompts">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <ul className="space-y-2">
              {prompts.map((p, i) => (
                <li key={i}>
                  <button
                    onClick={() => applyPrompt(p)}
                    className="w-full text-left text-sm text-gray-700 dark:text-gray-300 bg-white/70 dark:bg-gray-800/60 border border-indigo-100 dark:border-indigo-800/30 rounded-xl px-3 py-2 hover:border-indigo-400 hover:shadow-sm transition-all"
                  >
                    💭 {p}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {!showQuickForm ? (
            <button
              onClick={() => setShowQuickForm(true)}
              className="w-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl py-6 text-gray-400 hover:border-primary-400 hover:text-primary-500 transition-all flex flex-col items-center gap-2"
            >
              <BookOpen className="w-8 h-8" />
              <span className="font-medium">Start writing today's entry...</span>
            </button>
          ) : (
            <form onSubmit={handleQuickSubmit} className="space-y-3 flex-1">
              <input
                type="text"
                placeholder="Entry title..."
                className="input-field"
                value={quickEntry.title}
                onChange={(e) => setQuickEntry((p) => ({ ...p, title: e.target.value }))}
                required
              />
              <textarea
                placeholder="How are you feeling? What's on your mind..."
                className="input-field min-h-[100px] resize-none"
                value={quickEntry.content}
                onChange={(e) => setQuickEntry((p) => ({ ...p, content: e.target.value }))}
                required
              />
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">Mood:</span>
                <input type="range" min="1" max="10" value={quickEntry.mood}
                  onChange={(e) => setQuickEntry((p) => ({ ...p, mood: Number(e.target.value) }))}
                  className="flex-1 accent-primary-600"
                />
                <span className="text-sm font-bold text-primary-600">{quickEntry.mood}/10</span>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setShowQuickForm(false)} className="btn-secondary flex-1 text-sm py-2">Cancel</button>
                <button type="submit" disabled={isSaving} className="btn-primary flex-1 text-sm py-2 flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> {isSaving ? 'Saving…' : 'Save Entry'}
                </button>
              </div>
            </form>
          )}
        </div>

        {}
        <div className="card space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-500" /> {monthName} Heatmap
          </h2>
          {isLoading ? <Skeleton className="h-32 w-full" /> : (
            <>
              <div className="grid grid-cols-7 gap-1.5">
                {heatmapCells.map(({ day, dateStr, mood, sentiment: s }) => (
                  <div
                    key={day}
                    title={mood ? `Day ${day}: Mood ${mood}/10 · ${s}` : `Day ${day}: No entry`}
                    className={`aspect-square rounded-lg ${getMoodColor(mood)} transition-transform hover:scale-110 cursor-default`}
                  >
                    <span className="text-[9px] font-bold text-gray-600 dark:text-gray-300 flex items-center justify-center h-full opacity-60">{day}</span>
                  </div>
                ))}
              </div>
              {}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Less</span>
                {['bg-gray-100 dark:bg-gray-800', 'bg-red-400', 'bg-orange-300', 'bg-amber-300', 'bg-green-300', 'bg-green-400'].map((c, i) => (
                  <span key={i} className={`w-4 h-4 rounded-sm ${c}`} />
                ))}
                <span>More</span>
              </div>
            </>
          )}
        </div>

        {}
        <div className="card space-y-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-green-500" /> Progress & Milestones
          </h2>

          {}
          <div className="flex items-center gap-5 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-4 border border-orange-100 dark:border-orange-800/30">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#fed7aa" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f97316" strokeWidth="3"
                  strokeDasharray={`${Math.min((streak / 30) * 100, 100)} 100`} strokeLinecap="round" />
              </svg>
              <Flame className="w-6 h-6 text-orange-500 absolute inset-0 m-auto" />
            </div>
            <div>
              <p className="text-3xl font-black text-orange-600 dark:text-orange-400">{streak}</p>
              <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">day streak</p>
              <p className="text-xs text-gray-500 mt-0.5">{Math.max(0, 30 - streak)} days to 1-month milestone</p>
            </div>
          </div>

          {}
          <div className="space-y-3">
            {milestones.map(({ days, label, icon: Icon, color }) => {
              const unlocked = streak >= days;
              return (
                <div key={days} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${unlocked ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' : 'border-dashed border-gray-200 dark:border-gray-700 opacity-50'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${unlocked ? 'bg-gray-50 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    <Icon className={`w-4 h-4 ${unlocked ? color : 'text-gray-300'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</p>
                    <p className="text-xs text-gray-400">{days} consecutive days</p>
                  </div>
                  {unlocked && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                </div>
              );
            })}
          </div>

          {}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-600 dark:text-gray-300">Total entries written</span>
              <span className="text-gray-500">{totalEntries}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-gradient-to-r from-primary-500 to-indigo-500 h-2.5 rounded-full transition-all duration-700" style={{ width: `${Math.min((totalEntries / 100) * 100, 100)}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">{Math.max(0, 100 - totalEntries)} entries to reach 100 milestone</p>
          </div>
        </div>
      </div>

      {}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-5">
          <Brain className="w-6 h-6 text-violet-500" /> AI Insights
          <span className="text-xs font-normal text-gray-400 ml-2">Anonymous data only · Privacy-safe</span>
        </h2>
        {isLoading ? (
          <div className="space-y-3"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></div>
        ) : insights ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/40 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Compass className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <p className="text-sm font-bold text-violet-700 dark:text-violet-300">Pattern Detected</p>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">"{insights}"</p>
            </div>
            {insightTip && (
              <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/40 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <p className="text-sm font-bold text-teal-700 dark:text-teal-300">Suggestion</p>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">"{insightTip}"</p>
              </div>
            )}
            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Cloud className="w-4 h-4" /> Sentiment Distribution (30 Days)
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(sentiment).map(([key, val]) => {
                      const colors = { Positive: 'bg-green-500', Neutral: 'bg-amber-400', Negative: 'bg-red-400', Mixed: 'bg-purple-400' };
                      const total = Object.values(sentiment).reduce((a, b) => a + b, 0) || 1;
                      return (
                        <div key={key} className="flex items-center gap-2 text-sm">
                          <span className={`w-3 h-3 rounded-full ${colors[key] || 'bg-gray-400'}`} />
                          <span className="text-gray-600 dark:text-gray-300">{key}</span>
                          <span className="font-bold text-gray-900 dark:text-white">{Math.round((val / total) * 100)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {stats?.emotionCounts && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Brain className="w-4 h-4" /> Dominant Emotions (30 Days)
                    </p>
                    <div className="flex flex-wrap gap-4">
                      {Object.entries(stats.emotionCounts).filter(([_, val]) => val > 0).map(([key, val]) => {
                        const total = Object.values(stats.emotionCounts).reduce((a, b) => a + b, 0) || 1;
                        return (
                          <div key={key} className="flex items-center gap-2 text-sm">
                            <span className="text-gray-600 dark:text-gray-300 capitalize">{key}</span>
                            <span className="font-bold text-gray-900 dark:text-white">{Math.round((val / total) * 100)}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Write at least 3 journal entries to unlock AI insights.</p>
            <Link to="/journal" className="btn-primary mt-4 inline-flex">Start Journaling</Link>
          </div>
        )}
      </div>

      {}
      <CrisisSupport />
    </div>
  );
};

export default UserDashboard;
