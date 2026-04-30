import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Journal from './pages/Journal';
import Chat from './pages/Chat';
import MoodAnalytics from './pages/MoodAnalytics';
import Settings from './pages/Settings';
import AccessDenied from './pages/AccessDenied';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            {}
            <Route
              path="/"
              element={
                user
                  ? <Navigate to={['admin', 'superadmin', 'moderator', 'analyst', 'editor'].includes(user.role) ? '/admin-dashboard' : '/dashboard'} replace />
                  : <Home />
              }
            />
            <Route
              path="/login"
              element={
                !user
                  ? <Login />
                  : <Navigate to={['admin', 'superadmin', 'moderator', 'analyst', 'editor'].includes(user.role) ? '/admin-dashboard' : '/dashboard'} replace />
              }
            />
            <Route
              path="/register"
              element={
                !user
                  ? <Register />
                  : <Navigate to={['admin', 'superadmin', 'moderator', 'analyst', 'editor'].includes(user.role) ? '/admin-dashboard' : '/dashboard'} replace />
              }
            />

            {}
            <Route path="/dashboard" element={
              <ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>
            } />
            <Route path="/journal" element={
              <ProtectedRoute role="user"><Journal /></ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute role="user"><Chat /></ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute role="user"><MoodAnalytics /></ProtectedRoute>
            } />

            {}
            <Route path="/admin-dashboard" element={
              <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
            } />

            {}
            <Route path="/settings" element={
              <ProtectedRoute><Settings /></ProtectedRoute>
            } />

            {}
            <Route path="/403" element={<AccessDenied />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
