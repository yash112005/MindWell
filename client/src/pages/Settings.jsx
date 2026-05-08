import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Bell, Moon, Sun, Lock, Save, Loader2, Sparkles, Trash2 as TrashIcon } from 'lucide-react';
import { updateProfile, updatePreferences, updatePassword, reset } from '../store/features/authSlice';
import { getFingerprint, updateMapping, deleteVocabulary } from '../utils/emotionalFingerprint';

const Settings = () => {
  const dispatch = useDispatch();
  const { user, isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [fingerprint, setFingerprint] = useState(getFingerprint());

  const [preferences, setPreferences] = useState({
    theme: user?.preferences?.theme || localStorage.getItem('theme') || 'dark',
    notifications: user?.preferences?.notifications !== undefined ? user.preferences.notifications : true,
    dailyReminderTime: user?.preferences?.dailyReminderTime || '09:00',
  });

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const standardEmotions = [
    'anxious', 'stressed', 'overwhelmed', 'depressed', 'sad', 
    'happy', 'excited', 'angry', 'frustrated', 'lonely', 
    'tired', 'relaxed', 'calm', 'worried'
  ];

  useEffect(() => {
    if (isSuccess) {
      alert(activeTab === 'security' ? 'Password updated successfully!' : 'Settings updated successfully!');
      if (activeTab === 'security') {
        setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    }
    if (isError) {
      alert(message);
    }
    dispatch(reset());
  }, [isSuccess, isError, message, dispatch, activeTab]);

  const handlePreferenceChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setPreferences({ ...preferences, [e.target.name]: value });
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSecurityChange = (e) => {
    setSecurity({ ...security, [e.target.name]: e.target.value });
  };

  const handleUpdateMapping = (word, mappedTo) => {
    updateMapping(word, mappedTo);
    setFingerprint(getFingerprint());
  };

  const handleDeleteVocab = (word) => {
    if (window.confirm(`Delete "${word}" from your vocabulary?`)) {
      deleteVocabulary(word);
      setFingerprint(getFingerprint());
    }
  };

  const saveProfile = (e) => {
    e.preventDefault();
    dispatch(updateProfile({ name: profile.name, phone: profile.phone }));
  };

  const savePreferences = (e) => {
    e.preventDefault();
    dispatch(updatePreferences(preferences));
    
    // Apply theme immediately
    localStorage.setItem('theme', preferences.theme);
    if(preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const saveSecurity = (e) => {
    e.preventDefault();
    if (security.newPassword !== security.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    dispatch(updatePassword({ 
      currentPassword: security.currentPassword, 
      newPassword: security.newPassword 
    }));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Account Settings</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'profile' ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <User className="w-5 h-5" /> Profile
          </button>
          <button 
            onClick={() => setActiveTab('preferences')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'preferences' ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <Bell className="w-5 h-5" /> Preferences
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'security' ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <Lock className="w-5 h-5" /> Security
          </button>
          <button 
            onClick={() => setActiveTab('vocabulary')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'vocabulary' ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <Sparkles className="w-5 h-5" /> Vocabulary
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2">
          {activeTab === 'profile' && (
            <div className="card animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Information</h2>
              <form onSubmit={saveProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    disabled
                    className="input-field bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-70"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    className="input-field"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <button type="submit" className="btn-primary flex items-center gap-2 px-8" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
                    Save Profile
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="card animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">App Preferences</h2>
              <form onSubmit={savePreferences} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</label>
                  <div className="flex gap-4">
                    <label className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${preferences.theme === 'light' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md scale-[1.02]' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                      <input type="radio" name="theme" value="light" checked={preferences.theme === 'light'} onChange={handlePreferenceChange} className="sr-only" />
                      <Sun className={`w-6 h-6 ${preferences.theme === 'light' ? 'text-amber-500 fill-amber-500' : 'text-gray-400'}`} />
                      <span className="font-medium text-gray-900 dark:text-white">Light</span>
                    </label>
                    <label className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${preferences.theme === 'dark' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md scale-[1.02]' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                      <input type="radio" name="theme" value="dark" checked={preferences.theme === 'dark'} onChange={handlePreferenceChange} className="sr-only" />
                      <Moon className={`w-6 h-6 ${preferences.theme === 'dark' ? 'text-blue-500 fill-blue-500' : 'text-gray-400'}`} />
                      <span className="font-medium text-gray-900 dark:text-white">Dark</span>
                    </label>
                  </div>
                </div>

                <hr className="border-gray-100 dark:border-gray-800" />

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Daily Reminders</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive an email to check-in with your journal.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="notifications" checked={preferences.notifications} onChange={handlePreferenceChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                {preferences.notifications && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reminder Time</label>
                    <input
                      type="time"
                      name="dailyReminderTime"
                      value={preferences.dailyReminderTime}
                      onChange={handlePreferenceChange}
                      className="input-field"
                    />
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <button type="submit" className="btn-primary flex items-center gap-2 px-8" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
                    Save Preferences
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Security Settings</h2>
              <form onSubmit={saveSecurity} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={security.currentPassword}
                    onChange={handleSecurityChange}
                    className="input-field"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <hr className="border-gray-100 dark:border-gray-800 my-4" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={security.newPassword}
                    onChange={handleSecurityChange}
                    className="input-field"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={security.confirmPassword}
                    onChange={handleSecurityChange}
                    className="input-field"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <button type="submit" className="btn-primary flex items-center gap-2 px-8" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />} 
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'vocabulary' && (
            <div className="card animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-6 h-6 text-primary-500" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Emotional Fingerprint</h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                We learn your unique way of expressing feelings. Here are the words we've noticed you use often and how we reflect them back to you.
              </p>

              {Object.keys(fingerprint.tracking).length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
                  <p className="text-gray-400">No custom vocabulary learned yet. Keep journaling!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(fingerprint.tracking).map(([word, data]) => (
                    <div key={word} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary-600 dark:text-primary-400 font-mono">"{word}"</span>
                          <span className="text-[10px] bg-gray-200 dark:bg-gray-700 text-gray-500 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Used {data.count}x</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 italic line-clamp-1">
                          Example: ...{data.examples[0]}...
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 uppercase font-bold ml-1 mb-0.5">Maps to</span>
                          <select 
                            className="text-sm bg-white dark:bg-dark-surface border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-primary-500"
                            value={fingerprint.mappings[word] || ''}
                            onChange={(e) => handleUpdateMapping(word, e.target.value)}
                          >
                            <option value="">Unmapped</option>
                            {standardEmotions.map(emotion => (
                              <option key={emotion} value={emotion}>{emotion}</option>
                            ))}
                          </select>
                        </div>
                        <button 
                          onClick={() => handleDeleteVocab(word)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors mt-4"
                          title="Delete word"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
