
import React, { useState, useCallback } from 'react';
import { generateThoughtFromStoryWithGemini } from '../services/geminiService';
import { LoadingSpinner } from './common/LoadingSpinner';
import { OutputDisplay } from './common/OutputDisplay';
import { SendIcon, RotateCcwIcon } from './icons';


export const ReverseStorySection: React.FC = () => {
  const [storyInput, setStoryInput] = useState<string>('');
  const [reversedThought, setReversedThought] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!storyInput.trim()) {
      setError("Please paste a story to analyze.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setReversedThought('');
    try {
      const result = await generateThoughtFromStoryWithGemini(storyInput);
      setReversedThought(result);
    } catch (e) {
      console.error("Error generating reversed thought:", e);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsLoading(false);
    }
  }, [storyInput]);

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="storyInputReverse" className="block text-lg font-semibold text-purple-300 mb-2">
          Paste your story for narrative archaeology:
        </label>
        <textarea
          id="storyInputReverse"
          value={storyInput}
          onChange={(e) => setStoryInput(e.target.value)}
          placeholder="Paste a short story, poem, or script excerpt here..."
          className="w-full p-4 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-slate-100 min-h-[200px] resize-none"
          rows={8}
          disabled={isLoading}
        />
      </div>

      <button
        onClick={handleAnalyze}
        disabled={isLoading || !storyInput.trim()}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? <LoadingSpinner size="sm" /> : <RotateCcwIcon className="w-5 h-5" />}
        Uncover Original Thought
      </button>

      <OutputDisplay
        isLoading={isLoading}
        error={error}
        content={reversedThought}
        loadingMessage="Analyzing the narrative depths..."
        title="Inferred Original Spark"
      />
    </div>
  );
};