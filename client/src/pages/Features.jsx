import { MessageSquare, BookOpen, TrendingUp, Shield, Bell, Award } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <MessageSquare className="w-8 h-8 text-blue-500" />,
      title: 'AI Chatbot Support',
      description: 'Real-time empathetic conversation powered by advanced AI. Get personalized coping strategies, breathing exercises, and emotional support 24/7.',
      color: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: <BookOpen className="w-8 h-8 text-primary-500" />,
      title: 'Smart Journaling',
      description: 'Document your thoughts in a secure digital space. Our system automatically analyzes the sentiment of your entries to help you understand your emotional patterns.',
      color: 'bg-primary-50 dark:bg-primary-900/20'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-500" />,
      title: 'Mood Analytics',
      description: 'Visualize your emotional journey with interactive charts. Track daily trends, discover weekly insights, and receive AI-generated progress reports.',
      color: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      icon: <Bell className="w-8 h-8 text-amber-500" />,
      title: 'Daily Check-ins',
      description: 'Set personalized reminders to take a moment for yourself. Consistent check-ins build emotional awareness and resilience.',
      color: 'bg-amber-50 dark:bg-amber-900/20'
    },
    {
      icon: <Shield className="w-8 h-8 text-emerald-500" />,
      title: 'Privacy First',
      description: 'Your mental health data is sensitive. We use industry-standard encryption, strict access controls, and give you complete ownership of your data.',
      color: 'bg-emerald-50 dark:bg-emerald-900/20'
    },
    {
      icon: <Award className="w-8 h-8 text-rose-500" />,
      title: 'Gamified Wellness',
      description: 'Stay motivated with journaling streaks, milestones, and encouraging insights that celebrate your commitment to mental wellness.',
      color: 'bg-rose-50 dark:bg-rose-900/20'
    }
  ];

  return (
    <div className="py-8 animate-fade-in-up">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Platform Features</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Everything you need to support your mental wellness journey, all in one secure place.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="card hover:shadow-md transition-shadow group">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${feature.color}`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
