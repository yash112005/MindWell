import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 card">
      <div className="text-center mb-8">
        <Brain className="w-12 h-12 text-primary-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Forgot Password</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      {sent ? (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Check Your Email</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            We've sent a password reset link to <strong>{email}</strong>. 
            The link will expire in 15 minutes.
          </p>
          <Link to="/login" className="btn-primary inline-flex items-center gap-2 mt-4">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  className="input-field pl-10"
                  value={email}
                  placeholder="Enter your registered email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex justify-center items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Remember your password?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">
              Back to Login
            </Link>
          </p>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
