import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Brain, Lock, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setIsLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 card">
      <div className="text-center mb-8">
        <Brain className="w-12 h-12 text-primary-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Create a new password for your account
        </p>
      </div>

      {success ? (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Password Reset Successful!</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Your password has been updated. Redirecting you to login...
          </p>
          <Link to="/login" className="btn-primary inline-flex items-center gap-2 mt-4">
            Go to Login <ArrowRight className="w-4 h-4" />
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
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pl-10 pr-10"
                  value={password}
                  placeholder="Enter new password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pl-10"
                  value={confirmPassword}
                  placeholder="Confirm new password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex justify-center items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <Link to="/login" className="text-primary-600 font-medium hover:underline">
              Back to Login
            </Link>
          </p>
        </>
      )}
    </div>
  );
};

export default ResetPassword;
