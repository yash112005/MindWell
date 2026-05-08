import React, { useState } from 'react';
import { Moon, Activity, Zap, CheckCircle2, X } from 'lucide-react';
import { saveDailySync } from '../utils/bodyMindSync';

const BodyMindSyncWidget = ({ moodScore, onClose }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    sleepScore: 3,
    exercised: false,
    energyLevel: 3,
    moodScore: moodScore
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      saveDailySync(data);
      setStep(4); // Success step
    }
  };

  if (step === 4) {
    return (
      <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-2xl border border-primary-100 dark:border-primary-900/50 animate-fade-in text-center">
        <CheckCircle2 className="w-12 h-12 text-primary-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sync Complete</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">We'll look for patterns between your body and mind.</p>
        <button onClick={onClose} className="mt-4 text-sm font-bold text-primary-600 hover:underline">Close</button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary-500" />
          <h3 className="font-bold text-gray-900 dark:text-white">Body-Mind Sync</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
      </div>

      <div className="space-y-6">
        {step === 1 && (
          <div className="space-y-4 animate-slide-right">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Moon className="w-4 h-4 text-blue-500" /> How did you sleep last night?
            </p>
            <div className="flex justify-between items-center gap-2">
              {[1, 2, 3, 4, 5].map(val => (
                <button
                  key={val}
                  onClick={() => setData({ ...data, sleepScore: val })}
                  className={`w-10 h-10 rounded-full font-bold transition-all ${data.sleepScore === val ? 'bg-blue-500 text-white scale-110 shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}
                >
                  {val}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 uppercase font-bold px-1">
              <span>Poor</span>
              <span>Great</span>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-slide-right">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" /> Did you exercise today?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setData({ ...data, exercised: true })}
                className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${data.exercised === true ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700' : 'border-gray-100 dark:border-gray-800 text-gray-400'}`}
              >
                Yes
              </button>
              <button
                onClick={() => setData({ ...data, exercised: false })}
                className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${data.exercised === false ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700' : 'border-gray-100 dark:border-gray-800 text-gray-400'}`}
              >
                No
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-slide-right">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> What's your energy level?
            </p>
            <div className="flex justify-between items-center gap-2">
              {[1, 2, 3, 4, 5].map(val => (
                <button
                  key={val}
                  onClick={() => setData({ ...data, energyLevel: val })}
                  className={`w-10 h-10 rounded-full font-bold transition-all ${data.energyLevel === val ? 'bg-amber-500 text-white scale-110 shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}
                >
                  {val}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 uppercase font-bold px-1">
              <span>Depleted</span>
              <span>Vibrant</span>
            </div>
          </div>
        )}

        <button 
          onClick={handleNext}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-bold transition-all mt-4"
        >
          {step === 3 ? 'Finish Sync' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default BodyMindSyncWidget;
