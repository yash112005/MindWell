import { Link } from 'react-router-dom';
import { ShieldOff, ArrowLeft, Home } from 'lucide-react';

const Forbidden = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in-up">
      {}
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
          <ShieldOff className="w-14 h-14 text-red-500" />
        </div>
        <span className="absolute -top-2 -right-2 text-4xl font-black text-red-500 bg-white dark:bg-dark-surface px-2 rounded-full shadow">
          403
        </span>
      </div>

      {}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
        Access Denied
      </h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8 leading-relaxed">
        You don't have permission to view this page. If you believe this is a
        mistake, please contact your administrator.
      </p>

      {}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/" className="btn-primary flex items-center gap-2">
          <Home className="w-4 h-4" /> Go Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    </div>
  );
};

export default Forbidden;
