
import React from 'react';
import { SparklesIcon } from './icons'; // Assuming icons.tsx is created

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="text-center py-6">
      <div className="flex items-center justify-center gap-3">
        <SparklesIcon className="w-10 h-10 text-purple-400" />
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
          {title}
        </h1>
        <SparklesIcon className="w-10 h-10 text-orange-400" />
      </div>
      <p className="mt-3 text-lg text-slate-300">AI-Powered Thought-to-Story Generator</p>
    </header>
  );
};