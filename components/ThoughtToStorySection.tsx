import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LiteraryStyle } from '../types';
import { LITERARY_STYLES } from '../constants';
import { generateStoryWithGemini } from '../services/geminiService';
import CharacterPortraitsSection from './CharacterPortraitsSection';

interface ThoughtToStorySectionProps {
  currentThought: string;
  onThoughtChange: (thought: string) => void;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export const ThoughtToStorySection: React.FC<ThoughtToStorySectionProps> = ({ currentThought, onThoughtChange }) => {
  const [selectedStyle, setSelectedStyle] = useState<LiteraryStyle>(LITERARY_STYLES[0]);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              finalTranscript += result[0].transcript;
            }
          }

          onThoughtChange(finalTranscript);
        };

        recognition.onerror = (event: Event) => {
          console.error('Speech recognition error:', event);
          setError('Error with speech recognition');
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        console.error('Speech recognition not supported');
        setError('Speech recognition is not supported in your browser');
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error('Error stopping speech recognition:', e);
        }
      }
    };
  }, [onThoughtChange]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (e) {
        console.error("Error stopping speech recognition:", e);
        setError(e instanceof Error ? e.message : "Failed to stop voice input");
        setIsListening(false);
      }
    } else {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Your browser does not support media devices. Please use a modern browser.');
        return;
      }

      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          try {
            if (recognitionRef.current) {
              recognitionRef.current.start();
              setIsListening(true);
              setError(null);
            }
          } catch (e) {
            console.error("Error starting speech recognition:", e);
            setError(e instanceof Error ? e.message : "Failed to start voice input");
            setIsListening(false);
          }
        })
        .catch((err) => {
          console.error('Microphone access error:', err);
          setError('Please allow microphone access to use voice input.');
          setIsListening(false);
        });
    }
  }, [isListening]);

  const handleGenerate = useCallback(async () => {
    if (!currentThought.trim()) {
      setError('Please enter a thought first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedContent('');

    try {
      const story = await generateStoryWithGemini(currentThought, selectedStyle);
      setGeneratedContent(story);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate story');
    } finally {
      setIsLoading(false);
    }
  }, [currentThought, selectedStyle]);

  return (
    <div className="flex flex-col space-y-6 w-full max-w-3xl mx-auto p-6 bg-[#1a1b26] rounded-lg shadow-xl">
      <div>
        <label htmlFor="thoughtInput" className="block text-lg font-semibold text-purple-300 mb-2">
          Enter your thought, dream, or feeling:
        </label>
        <div className="relative">
          <textarea
            id="thoughtInput"
            value={currentThought}
            onChange={(e) => onThoughtChange(e.target.value)}
            placeholder="e.g., a silver tree on fire in the desert... time bending..."
            className="w-full p-4 pr-16 bg-[#24253a] border border-[#363759] rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-slate-100 min-h-[120px] resize-none"
            rows={4}
            disabled={isLoading || isListening}
          />
          <button
            onClick={toggleListening}
            title={isListening ? "Stop listening" : "Use voice input"}
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
            aria-pressed={isListening}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors
                      ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-purple-600 hover:bg-purple-700'} 
                      ${!recognitionRef.current ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!recognitionRef.current || isLoading}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="styleSelector" className="block text-lg font-semibold text-purple-300 mb-2">
          Choose a literary style:
        </label>
        <select
          id="styleSelector"
          value={selectedStyle}
          onChange={(e) => setSelectedStyle(e.target.value as LiteraryStyle)}
          className="w-full p-3 bg-[#24253a] border border-[#363759] rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-slate-100"
          disabled={isLoading}
        >
          {LITERARY_STYLES.map(style => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isLoading || !currentThought.trim()}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )}
        MindMeld into Story
      </button>

      {error && !isLoading && (generatedContent === '' || generatedContent === null) && (
        <div className="p-4 bg-yellow-800 bg-opacity-40 border border-yellow-600 rounded-lg text-yellow-200 text-sm" role="alert">
          <p>{error}</p>
        </div>
      )}

      {generatedContent && (
        <div className="mt-4 p-6 bg-[#24253a] border border-[#363759] rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-purple-300">Generated Narrative</h3>
          <p className="text-slate-100 whitespace-pre-wrap">{generatedContent}</p>
        </div>
      )}
      
      {/* Character Portraits Section - only show when there's a generated story */}
      {generatedContent && (
        <CharacterPortraitsSection storyText={generatedContent} />
      )}
    </div>
  );
};
