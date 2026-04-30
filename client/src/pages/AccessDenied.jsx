import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full text-center p-8 card bg-dark-card border-red-900/30">
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full"></div>
          <ShieldAlert className="w-20 h-20 text-red-500 mx-auto relative z-10" />
        </div>
        
        <h1 className="text-6xl font-black text-red-500 mb-2">403</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
        
        <p className="text-gray-400 mb-8 leading-relaxed">
          You do not have the required permissions to view this module. 
          Please contact a superadmin if you believe this is an error.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate(-1)}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
