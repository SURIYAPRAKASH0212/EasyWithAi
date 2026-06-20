import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as historyApi from '../api/historyApi';
import FeatureCard from '../components/FeatureCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Globe, 
  Mail, 
  Users, 
  History, 
  Bot, 
  Sparkles, 
  Clock, 
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ translations: 0, emails: 0, entities: 0, total: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await historyApi.getStats();
        setStats(response.data.stats);
        setRecentActivity(response.data.recent);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        toast.error('Could not refresh stats');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const featureCards = [
    {
      title: 'Translator',
      description: 'Translate text between different languages instantly.',
      buttonText: 'Get Started →',
      linkTo: '/translator',
      icon: Globe,
      iconBgColor: 'from-purple-500/10 to-indigo-500/10 dark:from-purple-950/20 dark:to-indigo-950/20',
      iconColor: 'text-[#6C4CF1] dark:text-[#A793FF]',
      btnBgColor: 'bg-[#6C4CF1] hover:bg-[#5534DB]',
      btnHoverColor: 'shadow-md shadow-purple-500/10',
    },
    {
      title: 'Email Generator',
      description: 'Generate professional emails in seconds with AI.',
      buttonText: 'Get Started →',
      linkTo: '/email-generator',
      icon: Mail,
      iconBgColor: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/20 dark:to-teal-950/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      btnBgColor: 'bg-[#10B981] hover:bg-[#059669]',
      btnHoverColor: 'shadow-md shadow-emerald-500/10',
    },
    {
      title: 'Entity Recognition',
      description: 'Extract important entities like names, places and organizations.',
      buttonText: 'Get Started →',
      linkTo: '/entity-recognition',
      icon: Users,
      iconBgColor: 'from-blue-500/10 to-cyan-500/10 dark:from-blue-950/20 dark:to-cyan-950/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      btnBgColor: 'bg-[#1D4ED8] hover:bg-[#1E40AF]',
      btnHoverColor: 'shadow-md shadow-blue-500/10',
    },
    {
      title: 'History',
      description: 'View and manage your past AI interactions.',
      buttonText: 'View History →',
      linkTo: '/history',
      icon: History,
      iconBgColor: 'from-amber-500/10 to-orange-500/10 dark:from-amber-950/20 dark:to-orange-950/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
      btnBgColor: 'bg-[#F59E0B] hover:bg-[#D97706]',
      btnHoverColor: 'shadow-md shadow-amber-500/10',
    },
  ];

  return (
    <div className="flex flex-col gap-8 text-left max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2 mb-1.5">
          Welcome to EasyWithAI 👋
        </h1>
        <p className="text-[15px] text-gray-500 dark:text-gray-400">
          Your all-in-one AI assistant for text processing
        </p>
      </div>

      {/* Stats Row */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-white dark:bg-[#16171D] border border-gray-100 dark:border-gray-800/80 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Translations Stats */}
          <div className="bg-white dark:bg-[#16171D] border border-gray-100 dark:border-gray-800/80 p-5 rounded-2xl shadow-subtle flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase">Translations</span>
              <span className="text-2xl font-black text-gray-900 dark:text-white mt-1">{stats.translations}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-[#A793FF] flex items-center justify-center shrink-0">
              <Globe size={20} />
            </div>
          </div>

          {/* Emails Generated Stats */}
          <div className="bg-white dark:bg-[#16171D] border border-gray-100 dark:border-gray-800/80 p-5 rounded-2xl shadow-subtle flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase">Emails Generated</span>
              <span className="text-2xl font-black text-gray-900 dark:text-white mt-1">{stats.emails}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Mail size={20} />
            </div>
          </div>

          {/* Entities Extracted Stats */}
          <div className="bg-white dark:bg-[#16171D] border border-gray-100 dark:border-gray-800/80 p-5 rounded-2xl shadow-subtle flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase">Entities Extracted</span>
              <span className="text-2xl font-black text-gray-900 dark:text-white mt-1">{stats.entities}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Users size={20} />
            </div>
          </div>

          {/* Total History Stats */}
          <div className="bg-white dark:bg-[#16171D] border border-gray-100 dark:border-gray-800/80 p-5 rounded-2xl shadow-subtle flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase">History Records</span>
              <span className="text-2xl font-black text-gray-900 dark:text-white mt-1">{stats.total}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <History size={20} />
            </div>
          </div>
        </div>
      )}

      {/* Grid: 4 Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featureCards.map((card, idx) => (
          <FeatureCard key={idx} {...card} />
        ))}
      </div>

      {/* Bottom Section Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Banner Section (Col span 2) */}
        <div className="lg:col-span-2 bg-[#F7F4FF] dark:bg-purple-950/10 border border-purple-100/50 dark:border-purple-900/20 rounded-card p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-subtle relative overflow-hidden group">
          <div className="flex-1 flex flex-col gap-3.5 z-10">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Powerful AI. Simple Interface. Smart Results.
            </h2>
            <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-[420px]">
              EasyWithAI combines advanced LLMs with a user-friendly interface to make AI accessible for everyone. Toggle models, view detailed records, and streamline your text processing workflows instantly.
            </p>
            <div className="flex items-center gap-2 text-primary dark:text-[#A793FF] text-[13px] font-bold mt-2 cursor-default select-none">
              <Sparkles size={16} className="animate-pulse" />
              <span>Powered by Gemini 1.5 Flash</span>
            </div>
          </div>

          {/* Premium Animated SVG Robot */}
          <div className="w-40 h-40 flex items-center justify-center z-10 shrink-0 relative select-none">
            <svg viewBox="0 0 200 200" className="w-36 h-36 drop-shadow-md animate-[bounce_4s_ease-in-out_infinite]">
              {/* Floating Base */}
              <ellipse cx="100" cy="170" rx="35" ry="6" fill="#6C4CF1" opacity="0.25" className="animate-[pulse_2s_infinite]" />
              {/* Antenna */}
              <line x1="100" y1="50" x2="100" y2="25" stroke="#6C4CF1" strokeWidth="4" strokeLinecap="round" />
              <circle cx="100" cy="22" r="6" fill="#10B981" className="animate-ping" />
              <circle cx="100" cy="22" r="6" fill="#6C4CF1" />
              {/* Arms */}
              <rect x="42" y="85" width="12" height="40" rx="6" fill="#6C4CF1" opacity="0.8" transform="rotate(-15 42 85)" />
              <rect x="146" y="85" width="12" height="40" rx="6" fill="#6C4CF1" opacity="0.8" transform="rotate(15 146 85)" />
              {/* Robot Body */}
              <rect x="58" y="70" width="84" height="75" rx="20" fill="#6C4CF1" />
              {/* Screen */}
              <rect x="68" y="80" width="64" height="42" rx="10" fill="#1F2937" />
              {/* Glowing Eyes */}
              <circle cx="86" cy="98" r="5" fill="#10B981" className="animate-pulse" />
              <circle cx="114" cy="98" r="5" fill="#10B981" className="animate-pulse" />
              {/* Smile Mouth */}
              <path d="M 90 112 Q 100 118 110 112" stroke="#F9FAFB" strokeWidth="3" fill="none" strokeLinecap="round" />
              {/* Robot Neck */}
              <rect x="90" y="145" width="20" height="12" rx="3" fill="#A793FF" />
            </svg>
          </div>
        </div>

        {/* Recent Activity Widget */}
        <div className="bg-white dark:bg-[#16171D] border border-gray-100 dark:border-gray-800/80 rounded-card p-6 shadow-subtle flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
              <Clock size={18} className="text-gray-400" />
              <h3 className="font-bold text-[16px] text-gray-900 dark:text-white">
                Recent Activity
              </h3>
            </div>

            {loading ? (
              <div className="flex flex-col gap-3 py-4 items-center justify-center text-gray-400">
                <LoadingSpinner size="sm" />
                <span className="text-[12px]">Loading logs...</span>
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="flex flex-col py-8 items-center justify-center text-center">
                <Bot size={28} className="text-gray-300 dark:text-gray-700 mb-2" />
                <span className="text-[13px] text-gray-400 font-medium">No activity yet.</span>
                <span className="text-[11px] text-gray-400 mt-0.5">Try translating or generating emails!</span>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5">
                {recentActivity.map((activity, idx) => {
                  let moduleColor = 'bg-purple-100 text-[#6C4CF1] dark:bg-purple-950/20 dark:text-[#A793FF]';
                  if (activity.module === 'Email Generator') {
                    moduleColor = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400';
                  } else if (activity.module === 'Entity Recognition') {
                    moduleColor = 'bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400';
                  }
                  
                  return (
                    <div key={idx} className="flex flex-col text-left gap-1 py-1 group/item">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${moduleColor}`}>
                          {activity.module}
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">
                          {new Date(activity.created_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                        </span>
                      </div>
                      <span className="text-[13px] font-semibold text-gray-800 dark:text-gray-300 truncate pr-4 mt-0.5">
                        {activity.input}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <Link
            to="/history"
            className="flex items-center justify-center gap-1.5 text-primary dark:text-[#A793FF] text-[13px] font-bold hover:underline py-2.5 border-t border-gray-100 dark:border-gray-800 mt-4 group"
          >
            <span>View Full History</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
