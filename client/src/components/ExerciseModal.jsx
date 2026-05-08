import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Clock, AlertTriangle, CheckCircle2, BookOpen, Activity, Wind, Footprints, Heart, User, Zap, Moon } from 'lucide-react';

// Icon Map to dynamically render icons based on the string in data
const IconMap = {
  Wind, Activity, Footprints, Heart, User, Zap, Moon
};

const ExerciseModal = ({ exercise, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!exercise) return null;

  const IconComponent = IconMap[exercise.icon] || Activity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content */}
      <div 
        className="relative bg-white dark:bg-dark-surface w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{exercise.title}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{exercise.subtitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 dark:text-gray-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 md:p-8 space-y-10 custom-scrollbar">
          
          {/* ① Animation & Intro Section */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            
            {/* Animation Box */}
            <div className={`relative w-full aspect-video md:aspect-auto md:h-72 rounded-2xl flex flex-col items-center justify-center overflow-hidden ${exercise.color}`}>
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-white/80 dark:bg-black/50 backdrop-blur-sm p-2 rounded-full text-gray-700 dark:text-white hover:bg-white dark:hover:bg-black transition-colors"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Custom CSS Animation Container based on animationType */}
              <div className={`w-24 h-24 flex items-center justify-center rounded-full bg-white dark:bg-dark-bg shadow-md ${isPlaying ? `animate-${exercise.animationType}` : ''}`}>
                <IconComponent className={`w-12 h-12 ${exercise.iconColor}`} />
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${exercise.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                  {exercise.difficulty}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {exercise.duration}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">What is it?</h3>
              <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed">
                {exercise.description}
              </p>
              <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-lg border border-primary-100 dark:border-primary-900/50">
                <p className="text-primary-800 dark:text-primary-300 text-sm font-medium">
                  <strong>Frequency:</strong> {exercise.frequency}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800"></div>

          {/* ② How to do it */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" /> How to do it
            </h3>
            <div className="space-y-3">
              {exercise.steps.map((step, index) => (
                <div key={index} className="flex gap-4 p-3 hover:bg-gray-50 dark:hover:bg-dark-bg rounded-lg transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* ③ Pros Section */}
            <div className="bg-green-50/50 dark:bg-green-900/10 p-5 rounded-xl border border-green-100 dark:border-green-900/30">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Benefits
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-2">Mental</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {exercise.pros.mental.map((pro, i) => <li key={i}>{pro}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-2">Physical</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {exercise.pros.physical.map((pro, i) => <li key={i}>{pro}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-2">Best For</h4>
                  <div className="flex flex-wrap gap-2">
                    {exercise.pros.bestFor.map((item, i) => (
                      <span key={i} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ④ Cons Section */}
            <div className="bg-orange-50/50 dark:bg-orange-900/10 p-5 rounded-xl border border-orange-100 dark:border-orange-900/30">
              <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-400 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Watch Out
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-2">Avoid If</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {exercise.cons.avoidIf.map((con, i) => <li key={i}>{con}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-2">Common Mistakes</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {exercise.cons.mistakes.map((con, i) => <li key={i}>{con}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-200 mb-2">When NOT to do it</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {exercise.cons.whenNotToDo.map((con, i) => <li key={i}>{con}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ⑤ Science Section */}
          <div className="bg-gray-50 dark:bg-dark-bg p-5 rounded-xl border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-500" /> The Science Behind It
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-2">
              {exercise.science}
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-xs italic">
              Reference: {exercise.reference}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ExerciseModal;
