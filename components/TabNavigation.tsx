
import React from 'react';
import { ActiveTab } from '../types';
import { LightbulbIcon, MessageSquareIcon, SearchIcon } from './icons';
import { StyledButton } from './StyledButton';

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
    <nav className="flex justify-center items-center p-2 bg-[#0d1321] rounded-full w-full max-w-xl mx-auto shadow-lg">
      {tabConfig.map(({ id, label, Icon }) => (
        <StyledButton
          key={id}
          isActive={activeTab === id}
          onClick={() => onTabChange(id)}
        >
          <Icon className="w-5 h-5 mr-1.5" />
          {label}
        </StyledButton>
      ))}
    </nav>
  );
};

export default TabNavigation;