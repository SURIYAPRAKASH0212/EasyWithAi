import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Bot, Lock, Mail, User, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { registerUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !username || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await registerUser(username, email, password, fullName);
      toast.success('Registration successful! Welcome.');
      navigate('/home');
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Error occurred during registration';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0F1015] relative overflow-hidden px-4">
      {/* Scattered Characters Background Layer */}
      <div className="fixed inset-0 bg-characters opacity-60 dark:opacity-35 mix-blend-multiply dark:invert dark:mix-blend-screen pointer-events-none z-0" />

      {/* Floating Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-white dark:bg-[#16171D] border border-gray-100 dark:border-gray-800/80 text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-all duration-200 shadow-sm cursor-pointer"
          aria-label="Toggle dark mode"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      {/* Register Card */}
      <div className="w-full max-w-[460px] bg-white dark:bg-[#16171D] border border-gray-100 dark:border-gray-800/80 shadow-subtle p-8 z-10 rounded-card flex flex-col items-center">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-6 select-none">
          <div className="bg-primary/10 p-3 rounded-2xl text-primary dark:bg-primary/20 dark:text-[#A793FF]">
            <Bot size={32} />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-gray-900 dark:text-white">
            EasyWithAI
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          Create an account
        </h2>
        <p className="text-[13px] text-gray-400 dark:text-gray-500 mb-8 text-center">
          Get started with your free AI text assistant
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {/* Full Name */}
          <div className="flex flex-col text-left gap-1.5">
            <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 tracking-wide uppercase">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 dark:text-gray-500">
                <User size={16} />
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-xl text-[14px] text-gray-950 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col text-left gap-1.5">
            <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 tracking-wide uppercase">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 dark:text-gray-500">
                <Mail size={16} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-xl text-[14px] text-gray-950 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                disabled={loading}
              />
            </div>
          </div>

          {/* Username */}
          <div className="flex flex-col text-left gap-1.5">
            <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 tracking-wide uppercase">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 dark:text-gray-500">
                <Bot size={16} />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="john_doe"
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-xl text-[14px] text-gray-950 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col text-left gap-1.5">
            <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 tracking-wide uppercase">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 dark:text-gray-500">
                <Lock size={16} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-xl text-[14px] text-gray-950 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 bg-gray-950 hover:bg-black text-white font-bold rounded-xl text-[14px] transition-all duration-200 shadow-md shadow-gray-200/50 dark:bg-primary dark:hover:bg-primary-dark dark:shadow-primary/20 flex items-center justify-center gap-2 mt-3 disabled:opacity-50 cursor-pointer"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <span className="text-[13px] text-gray-400 dark:text-gray-500 mt-8">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-primary hover:underline font-semibold dark:text-[#A793FF]"
          >
            Sign In
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Register;
