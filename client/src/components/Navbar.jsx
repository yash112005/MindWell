import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../store/features/authSlice';
import { Brain, LogOut, User as UserIcon, Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  const navLinks = user 
    ? user.role === 'admin'
      ? [
          { name: 'Admin Dashboard', path: '/admin-dashboard' },
        ]
      : [
          { name: 'User Dashboard', path: '/dashboard' },
          { name: 'Journal', path: '/journal' },
          { name: 'Chat AI', path: '/chat' },
          { name: 'Analytics', path: '/analytics' },
        ]
    : [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/#about' },
        { name: 'Features', path: '/#features' },
        { name: 'Contact', path: '/#contact' },
      ];

  return (
    <nav className="glass-panel sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">MindWell</span>
            </Link>
          </div>

          {}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-4">
              {navLinks.map((link) => (
                link.path.startsWith('/#') ? (
                  <a
                    key={link.name}
                    href={link.path}
                    className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {link.name}
                  </Link>
                )
              ))}
            </div>
            
            <div className="flex items-center space-x-4 border-l border-gray-200 dark:border-gray-700 pl-4">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/settings" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors">
                    <UserIcon className="h-5 w-5" />
                  </Link>
                  <button onClick={onLogout} className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors text-sm font-medium">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 font-medium text-sm">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary text-sm">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>

          {}
          <div className="md:hidden flex items-center">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 mr-2 text-gray-500 dark:text-gray-400">
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t dark:border-gray-700">
            {navLinks.map((link) => (
              link.path.startsWith('/#') ? (
                <a
                  key={link.name}
                  href={link.path}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              )
            ))}
            
            {user ? (
              <>
                <Link to="/settings" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200" onClick={() => setIsOpen(false)}>Settings</Link>
                <button onClick={() => { onLogout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-medium text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 p-3">
                <Link to="/login" className="btn-secondary text-center" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/register" className="btn-primary text-center" onClick={() => setIsOpen(false)}>Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
