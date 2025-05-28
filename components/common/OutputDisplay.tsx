
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { AlertTriangleIcon, CheckCircleIcon } from '../icons'; // Assuming icons.tsx

interface OutputDisplayProps {
  isLoading: boolean;
  error: string | null;
  content: string | null;
  loadingMessage?: string;
  title?: string;
  emptyMessage?: string;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({
  isLoading,
  error,
  content,
  loadingMessage = "Loading...",
  title = "Output",
  emptyMessage = "Nothing to display yet. Generate some content!",
}) => {
  if (isLoading) {
    return (
      <div className="p-6 bg-slate-700 bg-opacity-50 rounded-lg border border-slate-600 text-center">
        <LoadingSpinner />
        <p className="mt-3 text-slate-300 italic">{loadingMessage}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-800 bg-opacity-30 border border-red-600 rounded-lg text-red-300">
        <div className="flex items-center mb-2">
          <AlertTriangleIcon className="w-6 h-6 mr-2 text-red-400" />
          <h3 className="text-lg font-semibold text-red-200">An Error Occurred</h3>
        </div>
        <p className="whitespace-pre-wrap text-sm">{error}</p>
      </div>
    );
  }

  if (!content || content.trim() === "") {
    return (
      <div className="p-6 bg-slate-700 bg-opacity-50 rounded-lg border border-slate-600 text-center">
        <p className="text-slate-400 italic">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-700 bg-opacity-70 rounded-lg border border-slate-600 shadow-inner">
      <div className="flex items-center mb-3">
        <CheckCircleIcon className="w-6 h-6 mr-2 text-green-400" />
        <h3 className="text-xl font-semibold text-purple-300">{title}</h3>
      </div>
      <div className="prose prose-sm sm:prose prose-invert max-w-none text-slate-200 whitespace-pre-wrap leading-relaxed">
        {content}
      </div>
    </div>
  );
};