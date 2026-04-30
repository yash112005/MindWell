import { useState } from 'react';
import { useSelector } from 'react-redux';
import { User, Bell, Moon, Sun, Lock, Save } from 'lucide-react';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  
  const [preferences, setPreferences] = useState({
    theme: localStorage.getItem('theme') || 'dark',
    notifications: true,
    dailyReminderTime: '09:00',
  });

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handlePreferenceChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setPreferences({ ...preferences, [e.target.name]: value });
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const saveSettings = (e) => {
    e.preventDefault();
    
    alert('Settings saved successfully!');
    if(preferences.theme !== localStorage.getItem('theme')) {
       
       localStorage.setItem('theme', preferences.theme);
       if(preferences.theme === 'dark') {
          document.documentElement.classList.add('dark');
       } else {
          document.documentElement.classList.remove('dark');
       }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Account Settings</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {}
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 font-medium">
            <User className="w-5 h-5" /> Profile
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors">
            <Bell className="w-5 h-5" /> Preferences
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors">
            <Lock className="w-5 h-5" /> Security
          </button>
        </div>

        {}
        <div className="md:col-span-2 space-y-8">
          <form onSubmit={saveSettings} className="space-y-8">
            
            {}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    disabled
                    className="input-field bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                  />
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
              </div>
            </div>

            {}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">App Preferences</h2>
              <div className="space-y-6">
                
                {}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</label>
                  <div className="flex gap-4">
                    <label className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${preferences.theme === 'light' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                      <input type="radio" name="theme" value="light" checked={preferences.theme === 'light'} onChange={handlePreferenceChange} className="sr-only" />
                      <Sun className="w-6 h-6 text-amber-500" />
                      <span className="font-medium text-gray-900 dark:text-white">Light</span>
                    </label>
                    <label className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${preferences.theme === 'dark' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                      <input type="radio" name="theme" value="dark" checked={preferences.theme === 'dark'} onChange={handlePreferenceChange} className="sr-only" />
                      <Moon className="w-6 h-6 text-blue-500" />
                      <span className="font-medium text-gray-900 dark:text-white">Dark</span>
                    </label>
                  </div>
                </div>

                <hr className="border-gray-100 dark:border-gray-800" />

                {}
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
                  <div>
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
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn-primary flex items-center gap-2 px-8">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
