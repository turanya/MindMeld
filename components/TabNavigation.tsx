
import React from 'react';
import { ActiveTab } from '../types';
import { LightbulbIcon, MessageSquareIcon, SearchIcon } from './icons';

interface TabNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const tabConfig = [
  { id: ActiveTab.THOUGHT_TO_STORY, label: "Thought to Story", Icon: LightbulbIcon },
  { id: ActiveTab.BRAINSTORM_PARTNER, label: "AI Brainstorm", Icon: MessageSquareIcon },
  { id: ActiveTab.REVERSE_STORY, label: "Reverse Story", Icon: SearchIcon },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="flex justify-center space-x-2 sm:space-x-4 p-2 bg-slate-800 rounded-xl shadow-md border border-slate-700">
      {tabConfig.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`
            flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 py-3 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75
            ${activeTab === id 
              ? 'bg-purple-600 text-white shadow-lg transform scale-105' 
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
            }
          `}
        >
          <Icon className={`w-5 h-5 ${activeTab === id ? 'text-white' : 'text-slate-400'}`} />
          {label}
        </button>
      ))}
    </nav>
  );
};