import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/landing';
import { LoginPage } from './pages/login';
import { SignupPage } from './pages/signup';
import { Dashboard } from './pages/dashboard';
import ForgotPassword  from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

export default function App() {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showToast = (message) => {
    setNotification(message);
  };
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
          } 
        />

        <Route 
          path="/signup" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <SignupPage />
          } 
        />

        <Route 
          path="/dashboard/*" 
          element={
            isAuthenticated 
              ? <Dashboard showToast={showToast} /> 
              : <Navigate to="/login" />
          } 
        />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />
      </Routes>

      {notification && (
        <div className="fixed bottom-5 right-5 z-[100] bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl transition-all animate-bounce">
          {notification}
        </div>
      )}
    </Router>
  );
}