import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Translator from './pages/Translator';
import EmailGenerator from './pages/EmailGenerator';
import EntityRecognition from './pages/EntityRecognition';
import History from './pages/History';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          {/* Toast notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'dark:bg-[#16171D] dark:text-white dark:border-gray-800 border border-gray-100 text-[14px] font-medium rounded-xl shadow-md',
              duration: 3500,
              style: {
                padding: '12px 16px',
              }
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes with Dashboard Layout */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Redirect root to home */}
              <Route index element={<Navigate to="/home" replace />} />
              
              <Route path="home" element={<Home />} />
              <Route path="translator" element={<Translator />} />
              <Route path="email-generator" element={<EmailGenerator />} />
              <Route path="entity-recognition" element={<EntityRecognition />} />
              <Route path="history" element={<History />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
