
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ApiKeyDisplay } from './components/ApiKeyDisplay';
import { TabNavigation } from './components/TabNavigation';
import { ThoughtToStorySection } from './components/ThoughtToStorySection';
import { BrainstormPartnerSection } from './components/BrainstormPartnerSection';
import { ReverseStorySection } from './components/ReverseStorySection';
import { ActiveTab } from './types';
import { APP_TITLE } from './constants';

const App: React.FC = () => {
  const [apiKeyPresent, setApiKeyPresent] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.THOUGHT_TO_STORY);
  const [currentThought, setCurrentThought] = useState<string>('');

  useEffect(() => {
    // process.env is not directly available in browser like this in typical CRA/Vite.
    // For this environment, we assume it's globally available or placeholder.
    const key = process.env.API_KEY;
    if (key && key.trim() !== '') {
      setApiKeyPresent(true);
    } else {
      setApiKeyPresent(false);
    }
  }, []);

  const handleThoughtChange = useCallback((thought: string) => {
    setCurrentThought(thought);
  }, []);

  const renderActiveTab = () => {
    if (!apiKeyPresent) {
      return <ApiKeyDisplay apiKeyPresent={apiKeyPresent} />;
    }
    switch (activeTab) {
      case ActiveTab.THOUGHT_TO_STORY:
        return <ThoughtToStorySection currentThought={currentThought} onThoughtChange={handleThoughtChange} />;
      case ActiveTab.BRAINSTORM_PARTNER:
        return <BrainstormPartnerSection initialThought={currentThought} />;
      case ActiveTab.REVERSE_STORY:
        return <ReverseStorySection />;
      default:
        return <ThoughtToStorySection currentThought={currentThought} onThoughtChange={handleThoughtChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-slate-100 flex flex-col items-center p-4 selection:bg-purple-500 selection:text-white">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        <Header title={APP_TITLE} />
        <ApiKeyDisplay apiKeyPresent={apiKeyPresent} />
        
        {apiKeyPresent && (
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        )}
        
        <main className="bg-slate-800 bg-opacity-70 shadow-2xl rounded-xl p-6 md:p-8 min-h-[60vh] backdrop-blur-md border border-slate-700">
          {renderActiveTab()}
        </main>

        <footer className="text-center text-sm text-slate-400 py-8">
          <p>&copy; {new Date().getFullYear()} {APP_TITLE}. Unleash your creative mind.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;