import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ApiKeyDisplay } from './components/ApiKeyDisplay';
import { TabNavigation } from './components/TabNavigation';
import { ThoughtToStorySection } from './components/ThoughtToStorySection';
import { BrainstormPartnerSection } from './components/BrainstormPartnerSection';
import { ReverseStorySection } from './components/ReverseStorySection';
import { AuthSection } from './components/AuthSection';
import { LogoutButton } from './components/LogoutButton';
import { ActiveTab, User } from './types';
import { APP_TITLE } from './constants';
import SpaceBackground from './components/SpaceBackground';

const App: React.FC = () => {
  const [apiKeyPresent, setApiKeyPresent] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.AUTH);
  const [currentThought, setCurrentThought] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // We still need to track the user state for authentication flow
  const [, setCurrentUser] = useState<User | null>(null);

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

  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setActiveTab(ActiveTab.THOUGHT_TO_STORY);
  }, []);

  const handleSignup = useCallback((user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setActiveTab(ActiveTab.THOUGHT_TO_STORY);
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActiveTab(ActiveTab.AUTH);
  }, []);

  const renderActiveTab = () => {
    if (!apiKeyPresent) {
      return <ApiKeyDisplay apiKeyPresent={apiKeyPresent} />;
    }
    
    if (!isAuthenticated && activeTab === ActiveTab.AUTH) {
      return <AuthSection onLogin={handleLogin} onSignup={handleSignup} />;
    }
    
    if (!isAuthenticated) {
      setActiveTab(ActiveTab.AUTH);
      return <AuthSection onLogin={handleLogin} onSignup={handleSignup} />;
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
    <div className="min-h-screen text-white relative">
      {/* Space-themed background */}
      <SpaceBackground />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        <Header title={APP_TITLE} />
        
        {apiKeyPresent && isAuthenticated && (
          <div className="absolute top-4 right-4">
            <LogoutButton onClick={handleLogout} />
          </div>
        )}
        
        <div className="w-full max-w-4xl flex flex-col gap-6 mx-auto">
          <ApiKeyDisplay apiKeyPresent={apiKeyPresent} />
          
          {apiKeyPresent && isAuthenticated && (
            <div className="flex justify-center items-center">
              <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          )}
          
          <main className="bg-opacity-70 shadow-2xl rounded-xl p-6 md:p-8 min-h-[60vh] backdrop-blur-md border border-slate-700">
            {renderActiveTab()}
          </main>

          <footer className="text-center text-sm text-slate-400 py-8">
            <p>&copy; {new Date().getFullYear()} {APP_TITLE}. Unleash your creative mind.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default App;