import React, { useState } from 'react';
import * as aiApi from '../api/aiApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { Sparkles, ArrowRightLeft, Copy, Download, Volume2, Loader2, Mic, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Translator = () => {
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Tamil');
  const [text, setText] = useState('Hello, how are you?');
  const [translatedText, setTranslatedText] = useState('வணக்கம், நீங்கள் எப்படி இருக்கிறீர்கள்?');
  const [loading, setLoading] = useState(false);
  const [speakingInput, setSpeakingInput] = useState(false);
  const [speakingOutput, setSpeakingOutput] = useState(false);
  const [listening, setListening] = useState(false);
  
  const activeAudioRef = React.useRef(null);
  const recognitionRef = React.useRef(null);

  const speechLangMap = {
    'arabic': 'ar-SA',
    'bengali': 'bn-IN',
    'chinese simplified': 'zh-CN',
    'chinese traditional': 'zh-TW',
    'dutch': 'nl-NL',
    'english': 'en-US',
    'finnish': 'fi-FI',
    'french': 'fr-FR',
    'german': 'de-DE',
    'greek': 'el-GR',
    'gujarati': 'gu-IN',
    'hebrew': 'he-IL',
    'hindi': 'hi-IN',
    'indonesian': 'id-ID',
    'italian': 'it-IT',
    'japanese': 'ja-JP',
    'kannada': 'kn-IN',
    'korean': 'ko-KR',
    'malayalam': 'ml-IN',
    'marathi': 'mr-IN',
    'norwegian': 'no-NO',
    'persian': 'fa-IR',
    'polish': 'pl-PL',
    'portuguese': 'pt-PT',
    'punjabi': 'pa-IN',
    'russian': 'ru-RU',
    'spanish': 'es-ES',
    'swedish': 'sv-SE',
    'tamil': 'ta-IN',
    'telugu': 'te-IN',
    'thai': 'th-TH',
    'turkish': 'tr-TR',
    'ukrainian': 'uk-UA',
    'urdu': 'ur-PK',
    'vietnamese': 'vi-VN'
  };

  React.useEffect(() => {
    return () => {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Browser does not support Speech Recognition. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      
      const langCode = speechLangMap[sourceLang.toLowerCase()] || 'en-US';
      recognition.lang = langCode;

      recognition.onstart = () => {
        setListening(true);
        toast.success('Microphone active. Start speaking...');
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          toast.error('Microphone permission denied.');
        } else if (event.error === 'no-speech') {
          toast.error('No speech detected.');
        } else {
          toast.error(`Voice input error: ${event.error}`);
        }
        stopListening();
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognition.onresult = (event) => {
        const currentResultIndex = event.resultIndex;
        const transcript = event.results[currentResultIndex][0].transcript;
        if (transcript) {
          setText((prev) => {
            const trimmedPrev = prev.trim();
            return trimmedPrev ? `${trimmedPrev} ${transcript.trim()}` : transcript.trim();
          });
          toast.success('Speech recognized');
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      toast.error('Failed to start speech recognition.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
    toast.success('Microphone turned off.');
  };

  const toggleListening = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const speakText = async (textToSpeak, langName, isInput = true) => {
    if (!textToSpeak.trim()) return;

    if (isInput) setSpeakingInput(true);
    else setSpeakingOutput(true);

    try {
      // Pause any ongoing playback
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      }

      const ttsLangMap = {
        'arabic': 'ar',
        'bengali': 'bn',
        'chinese simplified': 'zh-CN',
        'chinese traditional': 'zh-TW',
        'dutch': 'nl',
        'english': 'en',
        'finnish': 'fi',
        'french': 'fr',
        'german': 'de',
        'greek': 'el',
        'gujarati': 'gu',
        'hebrew': 'iw',
        'hindi': 'hi',
        'indonesian': 'id',
        'italian': 'it',
        'japanese': 'ja',
        'kannada': 'kn',
        'korean': 'ko',
        'malayalam': 'ml',
        'marathi': 'mr',
        'norwegian': 'no',
        'persian': 'fa',
        'polish': 'pl',
        'portuguese': 'pt',
        'punjabi': 'pa',
        'russian': 'ru',
        'spanish': 'es',
        'swedish': 'sv',
        'tamil': 'ta',
        'telugu': 'te',
        'thai': 'th',
        'turkish': 'tr',
        'ukrainian': 'uk',
        'urdu': 'ur',
        'vietnamese': 'vi'
      };

      const langCode = ttsLangMap[langName.toLowerCase()] || 'en';

      const response = await aiApi.generateSpeech(textToSpeak, langCode);
      const blob = response.data;
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      activeAudioRef.current = audio;

      await new Promise((resolve, reject) => {
        audio.onended = () => {
          if (activeAudioRef.current === audio) activeAudioRef.current = null;
          resolve();
        };
        audio.onerror = (err) => {
          if (activeAudioRef.current === audio) activeAudioRef.current = null;
          reject(err);
        };
        audio.play().catch(reject);
      });
    } catch (err) {
      console.error('Speech synthesis error:', err);
      toast.error('Failed to generate or play speech.');
    } finally {
      if (isInput) setSpeakingInput(false);
      else setSpeakingOutput(false);
    }
  };

  const languages = [
    'Arabic',
    'Bengali',
    'Chinese Simplified',
    'Chinese Traditional',
    'Dutch',
    'English',
    'Finnish',
    'French',
    'German',
    'Greek',
    'Gujarati',
    'Hebrew',
    'Hindi',
    'Indonesian',
    'Italian',
    'Japanese',
    'Kannada',
    'Korean',
    'Malayalam',
    'Marathi',
    'Norwegian',
    'Persian',
    'Polish',
    'Portuguese',
    'Punjabi',
    'Russian',
    'Spanish',
    'Swedish',
    'Tamil',
    'Telugu',
    'Thai',
    'Turkish',
    'Ukrainian',
    'Urdu',
    'Vietnamese'
  ];

  const handleSwap = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    // Swap text and translatedText if available
    const tempText = text;
    setText(translatedText);
    setTranslatedText(tempText);
  };

  const handleTranslate = async () => {
    if (!text.trim()) {
      toast.error('Please enter text to translate');
      return;
    }

    setLoading(true);
    try {
      const response = await aiApi.translateText({ sourceLang, targetLang, text });
      setTranslatedText(response.data.translatedText);
      toast.success('Text translated successfully');
    } catch (err) {
      console.error(err);
      toast.error('Translation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    toast.success('Copied to clipboard');
  };

  const handleDownload = () => {
    if (!translatedText) return;
    const element = document.createElement("a");
    const file = new Blob([translatedText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `translated_${sourceLang}_to_${targetLang}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Download started');
  };

  return (
    <div className="flex flex-col gap-6 text-left max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
          Language Translator
        </h1>
        <p className="text-[14px] text-gray-500 dark:text-gray-400">
          Translate text between multiple languages
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-[#16171D] border border-gray-100 dark:border-gray-800/80 rounded-card p-6 shadow-subtle flex flex-col gap-6 relative">
        
        {/* Language Selectors */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
          {/* Source Lang */}
          <div className="flex-1 w-full flex flex-col gap-2">
            <label className="text-[12px] font-bold text-gray-400 dark:text-gray-500 tracking-wide uppercase">Source Language</label>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-xl text-[14px] text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
            >
              {languages.map(lang => (
                <option key={lang} value={lang} className="dark:bg-[#16171D]">{lang}</option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            className="p-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-primary/10 hover:text-primary dark:hover:text-[#A793FF] rounded-xl text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-gray-800 transition-all duration-200 mt-0 sm:mt-6 cursor-pointer"
            title="Swap Languages"
          >
            <ArrowRightLeft size={16} />
          </button>

          {/* Target Lang */}
          <div className="flex-1 w-full flex flex-col gap-2">
            <label className="text-[12px] font-bold text-gray-400 dark:text-gray-500 tracking-wide uppercase">Target Language</label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-xl text-[14px] text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
            >
              {languages.map(lang => (
                <option key={lang} value={lang} className="dark:bg-[#16171D]">{lang}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Input Text Area */}
        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-bold text-gray-400 dark:text-gray-500 tracking-wide uppercase">Enter Text</label>
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.substring(0, 5000))}
              placeholder="Enter text to translate..."
              className="w-full min-h-[160px] p-4 pr-10 pb-12 bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-xl text-[14px] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-all duration-200"
              maxLength={5000}
            />
            {/* Clear Input Button */}
            {text && (
              <button
                onClick={() => {
                  setText('');
                  setTranslatedText('');
                }}
                className="absolute top-3 right-3 p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:scale-110 transition-all duration-200 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 flex items-center justify-center"
                title="Clear input"
              >
                <X size={16} />
              </button>
            )}
            {/* Character Count */}
            <span className="absolute bottom-4 right-4 text-[11px] font-mono text-gray-400 dark:text-gray-500">
              {text.length} / 5000
            </span>
            {/* Listen Button */}
            <button
              onClick={() => speakText(text, sourceLang, true)}
              disabled={!text.trim() || speakingInput}
              className="absolute bottom-3 left-4 p-2 text-gray-400 dark:text-gray-500 hover:text-[#6C4CF1] dark:hover:text-[#A793FF] hover:scale-110 disabled:opacity-45 disabled:hover:text-gray-400 dark:disabled:hover:text-gray-500 disabled:hover:scale-100 transition-all duration-200 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 flex items-center justify-center w-8 h-8"
              title="Listen"
            >
              {speakingInput ? (
                <Loader2 size={16} className="animate-spin text-[#6C4CF1] dark:text-[#A793FF]" />
              ) : (
                <Volume2 size={16} />
              )}
            </button>
            {/* Speech-to-Text Microphone Button */}
            <button
              onClick={toggleListening}
              className={`absolute bottom-3 left-14 p-2 transition-all duration-200 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 flex items-center justify-center w-8 h-8
                ${listening 
                  ? 'text-red-500 hover:text-red-605 animate-pulse bg-red-50 dark:bg-red-950/20' 
                  : 'text-gray-400 dark:text-gray-500 hover:text-[#6C4CF1] dark:hover:text-[#A793FF] hover:scale-110'
                }
              `}
              title={listening ? "Stop listening" : "Voice input"}
            >
              <Mic size={16} />
            </button>
          </div>
          {listening && (
            <span className="text-[12px] text-red-500 dark:text-red-400 font-semibold animate-pulse mt-1 ml-1">
              Listening... Speak now
            </span>
          )}
        </div>

        {/* Center Translate Button */}
        <div className="flex justify-center mt-2">
          <button
            onClick={handleTranslate}
            disabled={loading}
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-[14px] flex items-center gap-2 transition-all duration-200 shadow-md shadow-primary/20 hover:scale-[1.01] disabled:opacity-50"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                <span>Translating...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Translate</span>
              </>
            )}
          </button>
        </div>

        {/* Output Text Container */}
        {translatedText && (
          <div className="flex flex-col gap-2 mt-4 animate-fade-in">
            <label className="text-[12px] font-bold text-gray-400 dark:text-gray-500 tracking-wide uppercase">Translated Text</label>
            <div className="w-full min-h-[100px] p-5 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl flex justify-between items-start gap-4">
              <span className="text-[15px] font-bold text-emerald-950 dark:text-emerald-300 leading-relaxed text-left whitespace-pre-wrap">
                {translatedText}
              </span>
              
              {/* Copy, Download, and Listen Buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => speakText(translatedText, targetLang, false)}
                  disabled={!translatedText.trim() || speakingOutput}
                  className="p-2 text-emerald-650 dark:text-emerald-400 hover:text-[#6C4CF1] dark:hover:text-[#A793FF] hover:scale-110 disabled:opacity-45 disabled:hover:text-emerald-600 dark:disabled:hover:text-emerald-400 disabled:hover:scale-100 transition-all duration-200 cursor-pointer rounded-lg hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20 flex items-center justify-center w-8 h-8"
                  title="Listen"
                >
                  {speakingOutput ? (
                    <Loader2 size={16} className="animate-spin text-[#6C4CF1] dark:text-[#A793FF]" />
                  ) : (
                    <Volume2 size={16} />
                  )}
                </button>
                <button
                  onClick={handleCopy}
                  className="p-2 text-emerald-650 dark:text-emerald-400 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors duration-150 cursor-pointer"
                  title="Copy Translation"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 text-emerald-650 dark:text-emerald-400 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors duration-150 cursor-pointer"
                  title="Download File"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Translator;
