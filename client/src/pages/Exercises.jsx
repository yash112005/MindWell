import React, { useState } from 'react';
import { exercises } from '../data/exercises';
import ExerciseModal from '../components/ExerciseModal';
import { Wind, Activity, Footprints, Heart, User, Zap, Moon, Clock } from 'lucide-react';

const IconMap = {
  Wind, Activity, Footprints, Heart, User, Zap, Moon
};

const Exercises = () => {
  const [selectedExercise, setSelectedExercise] = useState(null);

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in-up">
      {/* Header Section */}
      <section className="text-center space-y-4 pt-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          Exercises for Mental Wellness
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover a collection of scientifically-backed exercises designed to help you manage stress, release tension, and find your center.
        </p>
      </section>

      {/* Exercises Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {exercises.map((exercise) => {
          const IconComponent = IconMap[exercise.icon] || Activity;
          
          return (
            <div 
              key={exercise.id}
              onClick={() => setSelectedExercise(exercise)}
              className="card cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col"
            >
              {/* Preview Animation Box */}
              <div className={`w-full h-40 rounded-xl mb-6 flex items-center justify-center overflow-hidden transition-colors ${exercise.color}`}>
                <div className="w-16 h-16 rounded-full bg-white dark:bg-dark-bg shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <IconComponent className={`w-8 h-8 ${exercise.iconColor}`} />
                </div>
              </div>

              {/* Card Content */}
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
                    {exercise.title}
                  </h3>
                </div>
                
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                  {exercise.subtitle}
                </p>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 flex-1">
                  {exercise.tagline}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${exercise.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                    {exercise.difficulty}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {exercise.duration}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Modal */}
      {selectedExercise && (
        <ExerciseModal 
          exercise={selectedExercise} 
          onClose={() => setSelectedExercise(null)} 
        />
      )}
    </div>
  );
};

export default Exercises;
