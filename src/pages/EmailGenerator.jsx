import { useState } from 'react';
import * as aiApi from '../api/aiApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { Copy, Sparkles, Download, RotateCcw, X, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const EmailGenerator = () => {
  const [prompt, setPrompt] = useState('Write a professional leave request email to my professor because I have fever.');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestions = [
    {
      title: 'Leave Request',
      text: 'Write a professional leave request email to my professor because I have fever.'
    },
    {
      title: 'Internship Application',
      text: 'Write an internship application email for an AI/ML role.'
    },
    {
      title: 'Polite Complaint',
      text: 'Write a polite complaint email regarding delayed delivery.'
    }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter instructions prompt');
      return;
    }

    setLoading(true);
    try {
      const response = await aiApi.generateEmail({ prompt });
      setGeneratedEmail(response.data.emailContent);
      toast.success('Email generated successfully');
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Email generation failed';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedEmail) return;
    navigator.clipboard.writeText(generatedEmail);
    toast.success('Copied to clipboard');
  };

  const handleDownload = () => {
    if (!generatedEmail) return;
    const element = document.createElement("a");
    const file = new Blob([generatedEmail], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `ai_email.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Download started');
  };

  return (
    <div className="flex flex-col gap-6 text-left max-w-4xl mx-auto animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
          AI Email Generator
        </h1>
        <p className="text-[14px] text-gray-500 dark:text-gray-400">
          Generate professional emails based entirely on your custom instructions
        </p>
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setPrompt(s.text)}
            className="flex flex-col text-left p-4 bg-gray-50 dark:bg-gray-800/30 hover:bg-primary/5 dark:hover:bg-primary/10 border border-gray-100 dark:border-gray-800 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01] gap-1 group"
          >
            <div className="flex items-center gap-1.5 text-primary dark:text-[#A793FF] font-bold text-[12px] uppercase tracking-wide">
              <MessageSquare size={14} />
              <span>{s.title}</span>
            </div>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-snug group-hover:text-gray-700 dark:group-hover:text-gray-300">
              "{s.text}"
            </p>
          </button>
        ))}
      </div>

      {/* Main Container Card */}
      <div className="bg-white dark:bg-[#16171D] border border-gray-100 dark:border-gray-800/80 rounded-card p-6 shadow-subtle flex flex-col gap-6">
        
        {/* ChatGPT Style Textarea Container */}
        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-bold text-gray-400 dark:text-gray-500 tracking-wide uppercase">AI Instructions Prompt</label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.substring(0, 4000))}
              placeholder="e.g. Write a professional leave request email to my professor because I have fever."
              className="w-full min-h-[140px] p-4 pr-10 pb-12 bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-xl text-[14px] text-gray-950 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-all duration-200"
              maxLength={4000}
            />
            {/* Clear button */}
            {prompt && (
              <button
                onClick={() => setPrompt('')}
                className="absolute top-3 right-3 p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:scale-110 transition-all duration-200 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 flex items-center justify-center"
                title="Clear input"
              >
                <X size={16} />
              </button>
            )}
            {/* Character Count */}
            <span className="absolute bottom-4 right-4 text-[11px] font-mono text-gray-400 dark:text-gray-500">
              {prompt.length} / 4000
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-[14px] flex items-center gap-2 transition-all duration-200 shadow-md shadow-primary/20 hover:scale-[1.01] cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate Email</span>
              </>
            )}
          </button>
        </div>

        {/* Output container inside a light green card */}
        {generatedEmail && (
          <div className="flex flex-col gap-2 mt-2 animate-fade-in">
            <label className="text-[12px] font-bold text-gray-400 dark:text-gray-500 tracking-wide uppercase">Generated Email</label>
            <div className="w-full bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-5 flex flex-col gap-4">
              
              {/* Header with actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-emerald-100/50 dark:border-emerald-900/30">
                <span className="text-[13px] font-bold text-emerald-800 dark:text-emerald-400">Result</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20 rounded-lg transition-all duration-200 flex items-center gap-1 text-[12px] font-bold cursor-pointer disabled:opacity-50"
                    title="Regenerate Email"
                  >
                    <RotateCcw size={15} />
                    <span>Regenerate</span>
                  </button>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20 rounded-lg transition-all duration-200 flex items-center gap-1 text-[12px] font-bold cursor-pointer"
                    title="Copy Email"
                  >
                    <Copy size={15} />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20 rounded-lg transition-all duration-200 flex items-center gap-1 text-[12px] font-bold cursor-pointer"
                    title="Download as TXT"
                  >
                    <Download size={15} />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Email contents with formatting and line-breaks preserved */}
              <div className="text-[14px] text-emerald-955 dark:text-emerald-300 leading-relaxed text-left font-medium whitespace-pre-wrap">
                {generatedEmail}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailGenerator;
