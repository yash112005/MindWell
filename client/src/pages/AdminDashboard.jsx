import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Users, Activity, UserPlus, TrendingUp, AlertTriangle,
  MessageSquare, Download, ShieldAlert, ThumbsUp, ThumbsDown,
  ShieldCheck, ShieldOff, Search, RefreshCw, Crown, BookOpen
} from 'lucide-react';
import { io } from 'socket.io-client';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area
} from 'recharts';

const API = 'http://localhost:5000/api/auth';

const dauData = [
  { date: 'Week 1', users: 1200 },
  { date: 'Week 2', users: 1350 },
  { date: 'Week 3', users: 1500 },
  { date: 'Week 4', users: 1800 },
];

const sentimentData = [
  { name: 'Mon', positive: 60, neutral: 20, negative: 20 },
  { name: 'Tue', positive: 65, neutral: 15, negative: 20 },
  { name: 'Wed', positive: 55, neutral: 25, negative: 20 },
  { name: 'Thu', positive: 70, neutral: 20, negative: 10 },
  { name: 'Fri', positive: 75, neutral: 15, negative: 10 },
  { name: 'Sat', positive: 80, neutral: 10, negative: 10 },
  { name: 'Sun', positive: 85, neutral: 10, negative:  5 },
];

const TABS = ['Overview', 'Analytics', 'Crisis Alerts', 'AI Performance', 'User Management'];


const UserManagement = ({ token }) => {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [updating, setUpdating] = useState(null);
  const [msg, setMsg]           = useState('');

  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/users`, config);
      setUsers(data);
    } catch (e) {
      setMsg('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    setUpdating(userId);
    try {
      await axios.patch(`${API}/users/${userId}/role`, { role: newRole }, config);
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, role: newRole } : u));
      setMsg(`Role updated to "${newRole}" successfully.`);
      setTimeout(() => setMsg(''), 3000);
    } catch (e) {
      setMsg(e.response?.data?.message || 'Failed to update role.');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-primary-500" /> User Management
          <span className="text-sm font-normal text-gray-400">({users.length} total)</span>
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 py-2 text-sm w-52"
            />
          </div>
          <button onClick={fetchUsers} className="btn-secondary p-2" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {msg && (
        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-sm px-4 py-2 rounded-xl">
          {msg}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading users…</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 font-medium rounded-l-xl">User</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                          {u.name}
                          {u.role === 'admin' && <Crown className="w-3.5 h-3.5 text-yellow-500" />}
                        </div>
                        <div className="text-xs text-gray-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      u.role === 'admin'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                    }`}>
                      {u.role === 'admin' ? <Crown className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleRoleToggle(u._id, u.role)}
                      disabled={updating === u._id}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all disabled:opacity-50 ${
                        u.role === 'admin'
                          ? 'border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                          : 'border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                      }`}
                    >
                      {u.role === 'admin'
                        ? <><ShieldOff className="w-3.5 h-3.5" /> Revoke Admin</>
                        : <><ShieldCheck className="w-3.5 h-3.5" /> Make Admin</>
                      }
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="text-center py-8 text-gray-400">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([
    { id: '8492', keyword: '"give up"',  severity: 'High',   color: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',    text: 'text-red-500' },
    { id: '1102', keyword: '"hopeless"', severity: 'Medium', color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400', text: 'text-orange-500' }
  ]);

  useEffect(() => {
    
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await axios.get('http://localhost:5000/api/admin/stats', config);
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch admin stats', err);
      }
    };
    if (user?.role === 'admin' || user?.role === 'superadmin') {
      fetchStats();
    }

    
    const socket = io('http://localhost:5000');
    socket.on('crisis:new-alert', (data) => {
      const newAlert = {
        id: data.alert._id.substring(0, 6),
        keyword: `"${data.alert.keyword}"`,
        severity: 'High',
        color: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
        text: 'text-red-500'
      };
      setAlerts(prev => [newAlert, ...prev]);
      
      
      setStats(prev => prev ? { ...prev, crisisAlertsWeek: (prev.crisisAlertsWeek || 0) + 1 } : prev);
    });

    return () => socket.disconnect();
  }, [user]);

  
  const dynamicSentimentData = stats?.sentiments ? [
    { name: 'Total', positive: stats.sentiments.positive || 0, neutral: stats.sentiments.neutral || 0, negative: stats.sentiments.negative || 0 }
  ] : sentimentData;

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-fade-in-up pb-10">

      {}
      <aside className="w-full md:w-56 flex-shrink-0">
        <div className="card sticky top-24 p-4 space-y-1">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Admin Menu</h3>
          {TABS.map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                activeTab === item
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <span>{item}</span>
              {item === 'Crisis Alerts' && alerts.length > 2 && (
                 <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{alerts.length}</span>
              )}
            </button>
          ))}
        </div>
      </aside>

      {}
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{activeTab}</h1>
          {activeTab === 'Overview' && (
            <button className="btn-secondary flex items-center gap-2 py-1.5 px-3 text-sm">
              <Download className="w-4 h-4" /> Export Data
            </button>
          )}
        </div>

        {}
        {activeTab === 'User Management' && (
          <UserManagement token={user?.token} />
        )}

        {}
        {activeTab === 'Overview' && (
          <>
            {}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Users',  value: stats?.totalUsers || '...', icon: Users,         trend: 'All time', up: null },
                { label: 'Active Today', value: stats?.activeUsersToday || '...',  icon: Activity,      trend: 'Today',  up: null },
                { label: 'Total Entries',value: stats?.totalEntries || '...',    icon: BookOpen,      trend: 'All time', up: null },
                { label: 'Crisis Alerts',value: stats?.crisisAlertsWeek || '...',    icon: AlertTriangle, trend: 'Last 7 Days',  up: false },
              ].map((k) => (
                <div key={k.label} className="card p-4">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                    <k.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{k.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{k.value}</div>
                  <div className={`text-xs mt-1 flex items-center ${k.up === true ? 'text-green-500' : k.up === false ? 'text-red-500' : 'text-gray-400'}`}>
                    {k.up !== null && <TrendingUp className={`w-3 h-3 mr-1 ${k.up === false ? 'rotate-180' : ''}`} />}
                    {k.trend}
                  </div>
                </div>
              ))}
            </div>

            {}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Users Trend (DAU)</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dauData}>
                      <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Mood & Sentiment Distribution</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sentimentData} stackOffset="expand">
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <YAxis hide />
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="positive" stackId="a" fill="#10b981" />
                      <Bar dataKey="neutral"  stackId="a" fill="#f59e0b" />
                      <Bar dataKey="negative" stackId="a" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {}
            <div className="card border-l-4 border-l-red-500">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" /> Crisis & Safety Monitoring
                </h2>
                <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold px-2 py-1 rounded-full">
                  2 Active Alerts
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300">
                    <tr>
                      <th className="px-4 py-2 font-medium">User / ID</th>
                      <th className="px-4 py-2 font-medium">Flagged Keyword</th>
                      <th className="px-4 py-2 font-medium">Severity</th>
                      <th className="px-4 py-2 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {alerts.map((r) => (
                      <tr key={r.id}>
                        <td className="px-4 py-3">Anonymous (ID: {r.id})</td>
                        <td className={`px-4 py-3 ${r.text}`}>{r.keyword}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-medium ${r.color}`}>{r.severity}</span></td>
                        <td className="px-4 py-3"><button className="text-primary-600 hover:underline text-xs font-medium">Review Chat</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {}
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Content & AI Performance</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {['Work Stress (32%)', 'Sleep Deprivation (25%)', 'Relationship Anxiety (18%)', 'Burnout (15%)'].map((t, i) => (
                  <span key={i} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs">{t}</span>
                ))}
              </div>
              <div className="flex gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <ThumbsUp className="w-4 h-4" /> <span className="font-bold">92%</span> <span className="text-sm text-gray-400">positive</span>
                </div>
                <div className="flex items-center gap-2 text-red-500 dark:text-red-400">
                  <ThumbsDown className="w-4 h-4" /> <span className="font-bold">8%</span> <span className="text-sm text-gray-400">negative</span>
                </div>
              </div>
            </div>
          </>
        )}

        {}
        {['Analytics', 'Crisis Alerts', 'AI Performance'].includes(activeTab) && (
          <div className="card text-center py-16 text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">{activeTab} — coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
