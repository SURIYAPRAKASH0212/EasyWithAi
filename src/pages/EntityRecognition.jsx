import React, { useState } from 'react';
import * as aiApi from '../api/aiApi';
import EntityCard from '../components/EntityCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Sparkles, BrainCircuit } from 'lucide-react';
import toast from 'react-hot-toast';

const EntityRecognition = () => {
  const [text, setText] = useState('John works at Google in Chennai.');
  const [entities, setEntities] = useState({
    persons: ['John'],
    organizations: ['Google'],
    locations: ['Chennai']
  });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(true);

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
      toast.error('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const hasEntities = 
    entities.persons.length > 0 || 
    entities.organizations.length > 0 || 
    entities.locations.length > 0;

  return (
    <div className="flex flex-col gap-6 text-left max-w-4xl mx-auto">
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
              placeholder="Paste text here to extract names, companies, and locations..."
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
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-[14px] flex items-center gap-2 transition-all duration-200 shadow-md shadow-primary/20 hover:scale-[1.01] cursor-pointer"
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
            <label className="text-[12px] font-bold text-gray-400 dark:text-gray-500 tracking-wide uppercase">Extracted Entities</label>
            
            {!hasEntities ? (
              <div className="w-full p-8 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-center flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <BrainCircuit size={28} className="mb-2" />
                <span className="text-[13px] font-medium">No entities found in the text</span>
                <span className="text-[11px] mt-0.5">Try mentioning names, places (e.g. Chennai), or companies (e.g. Google).</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Persons */}
                {entities.persons.map((person, idx) => (
                  <EntityCard key={`person-${idx}`} type="PERSON" name={person} />
                ))}

                {/* Organizations */}
                {entities.organizations.map((org, idx) => (
                  <EntityCard key={`org-${idx}`} type="ORGANIZATION" name={org} />
                ))}

                {/* Locations */}
                {entities.locations.map((loc, idx) => (
                  <EntityCard key={`loc-${idx}`} type="LOCATION" name={loc} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EntityRecognition;
