import { Brain, Heart, Shield, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8">
      {}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-primary-100 dark:bg-primary-900/50 rounded-full mb-4">
          <Brain className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">About MindWell</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          We believe that mental wellness should be accessible, private, and personalized for everyone.
        </p>
      </section>

      {}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="card bg-gradient-to-br from-white to-primary-50 dark:from-dark-surface dark:to-primary-900/10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-primary-600 dark:text-primary-400">
            <Heart className="w-6 h-6" /> Our Mission
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            To provide a safe, intelligent, and non-judgmental space for individuals to track their emotions, reflect on their thoughts, and receive empathetic AI-driven support whenever they need it.
          </p>
        </div>
        
        <div className="card bg-gradient-to-br from-white to-blue-50 dark:from-dark-surface dark:to-blue-900/10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Users className="w-6 h-6" /> Our Vision
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            A world where everyone has immediate access to mental wellness tools, fostering emotional resilience and breaking the stigma around mental health through the power of compassionate AI.
          </p>
        </div>
      </section>

      {}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Why MindWell?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card text-center">
            <Shield className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Absolute Privacy</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Your data is yours. We use top-tier encryption to ensure your thoughts remain completely private.</p>
          </div>
          <div className="card text-center border-primary-200 dark:border-primary-800">
            <Brain className="w-10 h-10 text-primary-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Intelligent AI</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Powered by advanced LLMs, our AI understands context and provides genuinely helpful, empathetic responses.</p>
          </div>
          <div className="card text-center">
            <Heart className="w-10 h-10 text-rose-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Holistic Approach</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Combining journaling, mood tracking, and real-time chat for a complete wellness toolkit.</p>
          </div>
        </div>
      </section>

      {}
      <section className="space-y-8 pt-8 border-t border-gray-100 dark:border-gray-800">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Meet Our Team</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card text-center hover:-translate-y-1 transition-transform">
            <div className="w-20 h-20 mx-auto bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">YN</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Yash Namdeo</h3>
            <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">Team Leader</p>
          </div>
          <div className="card text-center hover:-translate-y-1 transition-transform">
            <div className="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">VS</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Vedansh Sahu</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-2">Developer</p>
          </div>
          <div className="card text-center hover:-translate-y-1 transition-transform">
            <div className="w-20 h-20 mx-auto bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">PA</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pradyumn Awasthi</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-2">Developer</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
