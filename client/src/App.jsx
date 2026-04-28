import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

// Simple PrivateRoute component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (!token) return <Navigate to="/login" />;
  if (role === 'admin') return <Navigate to="/admin-dashboard" />;
  
  return children;
};

// Admin Route component
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (!token) return <Navigate to="/login" />;
  if (role !== 'admin') return <Navigate to="/dashboard" />;
  
  return children;
};

function App() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    window.location.href = '/login';
  };

  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <h1>
            <Shield size={28} color="#818cf8" />
            SecurePass
          </h1>
          {isAuthenticated && (
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          )}
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin-dashboard" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
