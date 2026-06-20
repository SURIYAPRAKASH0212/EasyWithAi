import { useState } from 'react';
import * as aiApi from '../api/aiApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Sparkles, 
  BrainCircuit, 
  User, 
  Building2, 
  MapPin, 
  Briefcase, 
  Mail, 
  Phone, 
  Calendar, 
  ShoppingBag, 
  Award, 
  Lightbulb, 
  Link, 
  Copy, 
  Download 
} from 'lucide-react';
import toast from 'react-hot-toast';

const EntityRecognition = () => {
  const [text, setText] = useState('John works at Google in Chennai.');
  const [entities, setEntities] = useState({
    persons: ['John'],
    organizations: ['Google'],
    locations: ['Chennai'],
    professions: [],
    emails: [],
    phones: [],
    dates: [],
    products: [],
    events: [],
    skills: [],
    urls: []
  });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(true);

  const categoryConfigs = {
    persons: {
      label: 'Persons',
      icon: User,
      bgColor: 'bg-purple-50/40 dark:bg-purple-950/10',
      borderColor: 'border-purple-100/80 dark:border-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-100/60 dark:bg-purple-900/40',
      badgeClass: 'bg-purple-100/80 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/30'
    },
    organizations: {
      label: 'Organizations',
      icon: Building2,
      bgColor: 'bg-emerald-50/40 dark:bg-emerald-950/10',
      borderColor: 'border-emerald-100/80 dark:border-emerald-900/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-100/60 dark:bg-emerald-900/40',
      badgeClass: 'bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/30'
    },
    locations: {
      label: 'Locations',
      icon: MapPin,
      bgColor: 'bg-amber-50/40 dark:bg-amber-950/10',
      borderColor: 'border-amber-100/80 dark:border-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-100/60 dark:bg-amber-900/40',
      badgeClass: 'bg-amber-100/80 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/30'
    },
    professions: {
      label: 'Professions',
      icon: Briefcase,
      bgColor: 'bg-indigo-50/40 dark:bg-indigo-950/10',
      borderColor: 'border-indigo-100/80 dark:border-indigo-900/30',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      iconBg: 'bg-indigo-100/60 dark:bg-indigo-900/40',
      badgeClass: 'bg-indigo-100/80 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/30'
    },
    emails: {
      label: 'Emails',
      icon: Mail,
      bgColor: 'bg-blue-50/40 dark:bg-blue-950/10',
      borderColor: 'border-blue-100/80 dark:border-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-100/60 dark:bg-blue-900/40',
      badgeClass: 'bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/30'
    },
    phones: {
      label: 'Phones',
      icon: Phone,
      bgColor: 'bg-rose-50/40 dark:bg-rose-950/10',
      borderColor: 'border-rose-100/80 dark:border-rose-900/30',
      iconColor: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-rose-100/60 dark:bg-rose-900/40',
      badgeClass: 'bg-rose-100/80 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/30'
    },
    dates: {
      label: 'Dates',
      icon: Calendar,
      bgColor: 'bg-teal-50/40 dark:bg-teal-950/10',
      borderColor: 'border-teal-100/80 dark:border-teal-900/30',
      iconColor: 'text-teal-600 dark:text-teal-400',
      iconBg: 'bg-teal-100/60 dark:bg-teal-900/40',
      badgeClass: 'bg-teal-100/80 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/30'
    },
    products: {
      label: 'Products',
      icon: ShoppingBag,
      bgColor: 'bg-pink-50/40 dark:bg-pink-950/10',
      borderColor: 'border-pink-100/80 dark:border-pink-900/30',
      iconColor: 'text-pink-600 dark:text-pink-400',
      iconBg: 'bg-pink-100/60 dark:bg-pink-900/40',
      badgeClass: 'bg-pink-100/80 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border border-pink-200/50 dark:border-pink-800/30'
    },
    events: {
      label: 'Events',
      icon: Award,
      bgColor: 'bg-cyan-50/40 dark:bg-cyan-950/10',
      borderColor: 'border-cyan-100/80 dark:border-cyan-900/30',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
      iconBg: 'bg-cyan-100/60 dark:bg-cyan-900/40',
      badgeClass: 'bg-cyan-100/80 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border border-cyan-200/50 dark:border-cyan-800/30'
    },
    skills: {
      label: 'Skills',
      icon: Lightbulb,
      bgColor: 'bg-orange-50/40 dark:bg-orange-950/10',
      borderColor: 'border-orange-100/80 dark:border-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
      iconBg: 'bg-orange-100/60 dark:bg-orange-900/40',
      badgeClass: 'bg-orange-100/80 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200/50 dark:border-orange-800/30'
    },
    urls: {
      label: 'URLs',
      icon: Link,
      bgColor: 'bg-slate-50/40 dark:bg-slate-900/10',
      borderColor: 'border-slate-100 dark:border-slate-800/50',
      iconColor: 'text-slate-600 dark:text-slate-400',
      iconBg: 'bg-slate-100/60 dark:bg-slate-900/40',
      badgeClass: 'bg-slate-100/80 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-800/30'
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast.error('Please enter text to analyze');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const response = await aiApi.analyzeEntities({ text });
      setEntities(response.data.entities);
      toast.success('Text analyzed successfully');
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Analysis failed';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyJSON = () => {
    if (!entities) return;
    const jsonString = JSON.stringify(entities, null, 2);
    navigator.clipboard.writeText(jsonString);
    toast.success('JSON copied to clipboard');
  };

  const handleDownloadJSON = () => {
    if (!entities) return;
    const jsonString = JSON.stringify(entities, null, 2);
    const element = document.createElement("a");
    const file = new Blob([jsonString], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `extracted_entities.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('JSON download started');
  };

  const handleDownloadCSV = () => {
    if (!entities) return;
    let csvContent = "Category,Entity\n";
    Object.entries(entities).forEach(([category, list]) => {
      if (Array.isArray(list)) {
        list.forEach(item => {
          const escapedItem = item.replace(/"/g, '""');
          csvContent += `"${category}","${escapedItem}"\n`;
        });
      }
    });

    const element = document.createElement("a");
    const file = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    element.href = URL.createObjectURL(file);
    element.download = `extracted_entities.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('CSV download started');
  };

  const hasEntities = Object.keys(categoryConfigs).some(
    (key) => entities[key] && entities[key].length > 0
  );

  return (
    <div className="flex flex-col gap-6 text-left max-w-4xl mx-auto animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
          Entity Recognition
        </h1>
        <p className="text-[14px] text-gray-500 dark:text-gray-400">
          Extract important entities from the text
        </p>
      </div>

      {/* Main Container Card */}
      <div className="bg-white dark:bg-[#16171D] border border-gray-100 dark:border-gray-800/80 rounded-card p-6 shadow-subtle flex flex-col gap-6">
        
        {/* Input area */}
        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-bold text-gray-400 dark:text-gray-500 tracking-wide uppercase">Enter Text</label>
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.substring(0, 5000))}
              placeholder="Paste text here to extract names, companies, locations, emails, phone numbers, and more..."
              className="w-full min-h-[140px] p-4 bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-xl text-[14px] text-gray-950 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-all duration-200"
              maxLength={5000}
            />
            {/* Character Count */}
            <span className="absolute bottom-4 right-4 text-[11px] font-mono text-gray-400 dark:text-gray-500">
              {text.length} / 5000
            </span>
          </div>
        </div>

        {/* Analyze Button */}
        <div className="flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-[14px] flex items-center gap-2 transition-all duration-200 shadow-md shadow-primary/20 hover:scale-[1.01] cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                <span>Analyzing text...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Analyze Text</span>
              </>
            )}
          </button>
        </div>

        {/* Extracted Entities Result Grid */}
        {hasSearched && !loading && (
          <div className="flex flex-col gap-4 mt-2 animate-fade-in">
            {/* Header with actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800/60">
              <label className="text-[12px] font-bold text-gray-400 dark:text-gray-500 tracking-wide uppercase">Extracted Entities</label>
              {hasEntities && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopyJSON}
                    className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/20 rounded-lg transition-all duration-200 flex items-center gap-1 text-[12px] font-bold cursor-pointer"
                    title="Copy JSON to clipboard"
                  >
                    <Copy size={14} />
                    <span>Copy JSON</span>
                  </button>
                  <button
                    onClick={handleDownloadJSON}
                    className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/20 rounded-lg transition-all duration-200 flex items-center gap-1 text-[12px] font-bold cursor-pointer"
                    title="Download JSON file"
                  >
                    <Download size={14} />
                    <span>JSON</span>
                  </button>
                  <button
                    onClick={handleDownloadCSV}
                    className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/20 rounded-lg transition-all duration-200 flex items-center gap-1 text-[12px] font-bold cursor-pointer"
                    title="Download CSV file"
                  >
                    <Download size={14} />
                    <span>CSV</span>
                  </button>
                </div>
              )}
            </div>
            
            {!hasEntities ? (
              <div className="w-full p-8 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-center flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <BrainCircuit size={28} className="mb-2" />
                <span className="text-[13px] font-medium">No entities found in the text</span>
                <span className="text-[11px] mt-0.5">Try mentioning names, places, companies, or details like dates/emails.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(categoryConfigs).map(([key, config]) => {
                  const list = entities[key] || [];
                  if (list.length === 0) return null;
                  const Icon = config.icon;
                  return (
                    <div
                      key={key}
                      className={`flex flex-col gap-3 p-4 border rounded-xl shadow-sm transition-all duration-300 hover:shadow-md ${config.bgColor} ${config.borderColor}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg flex items-center justify-center ${config.iconBg} ${config.iconColor}`}>
                          <Icon size={18} />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[14px] font-bold text-gray-900 dark:text-white leading-tight">
                            {config.label}
                          </span>
                          <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 mt-0.5">
                            {list.length} {list.length === 1 ? 'entity' : 'entities'} found
                          </span>
                        </div>
                      </div>
                      {/* Tags List */}
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {list.map((item, idx) => (
                          <span
                            key={idx}
                            className={`px-2.5 py-1 rounded-lg text-[12px] font-bold ${config.badgeClass}`}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EntityRecognition;
