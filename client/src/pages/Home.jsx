import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Brain, Activity, Shield } from 'lucide-react';
import About from './About';
import Features from './Features';
import Contact from './Contact';

const Home = () => {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {}
      <section className="text-center pt-16 md:pt-24 px-4 flex flex-col items-center animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 text-sm font-medium mb-6">
          <Brain className="w-4 h-4" />
          <span>Your AI Mental Wellness Companion</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 max-w-4xl leading-tight">
          Find Your Peace with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">MindWell</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-10 leading-relaxed">
          An intelligent journaling and mood-tracking platform that provides empathetic AI support, personalized insights, and a safe space for your thoughts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
          <Link to="/register" className="btn-primary flex items-center justify-center gap-2 text-lg py-3 px-8 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50">
            Start Your Journey <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="#features" className="btn-secondary text-lg py-3 px-8 text-center">
            Explore Features
          </a>
        </div>
      </section>

      {}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-gray-100 dark:border-gray-800">
        <div className="card text-center hover:-translate-y-1 transition-transform cursor-pointer">
          <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/50 text-primary-600 mx-auto rounded-2xl flex items-center justify-center mb-6">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold mb-3 dark:text-white">Empathetic AI Chat</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Talk to an AI that listens without judgment. Get real-time support, coping strategies, and breathing exercises.
          </p>
        </div>
        
        <div className="card text-center hover:-translate-y-1 transition-transform cursor-pointer">
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 text-blue-600 mx-auto rounded-2xl flex items-center justify-center mb-6">
            <Activity className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold mb-3 dark:text-white">Mood Tracking</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Log your daily emotions and visualize your mental wellness journey over time with beautiful, insightful charts.
          </p>
        </div>
        
        <div className="card text-center hover:-translate-y-1 transition-transform cursor-pointer">
          <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/50 text-purple-600 mx-auto rounded-2xl flex items-center justify-center mb-6">
            <Shield className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold mb-3 dark:text-white">Private & Secure</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Your journal entries and conversations are heavily encrypted and completely private. We prioritize your safety.
          </p>
        </div>
      </section>

      <section id="about" className="pt-20">
        <About />
      </section>

      <section id="features" className="pt-20">
        <Features />
      </section>

      <section id="contact" className="pt-20">
        <Contact />
      </section>
    </div>
  );
};

export default Home;
