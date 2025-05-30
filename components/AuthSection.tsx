import React, { useState } from 'react';
import { AuthMode, User } from '../types';
import { SparklesIcon } from './icons';

interface AuthSectionProps {
  onLogin: (user: User) => void;
  onSignup: (user: User) => void;
}

export const AuthSection: React.FC<AuthSectionProps> = ({ onLogin, onSignup }) => {
  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.LOGIN);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validate form
      if (!email.trim()) {
        throw new Error('Email is required');
      }
      
      if (!password.trim() || password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      if (authMode === AuthMode.SIGNUP && !name.trim()) {
        throw new Error('Name is required for signup');
      }

      // In a real app, you would make API calls to your backend here
      // For this demo, we'll simulate a successful auth after a short delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create a mock user
      const mockUser: User = {
        id: `user-${Date.now()}`,
        email,
        name: authMode === AuthMode.SIGNUP ? name : email.split('@')[0]
      };

      // Call the appropriate callback
      if (authMode === AuthMode.LOGIN) {
        onLogin(mockUser);
      } else {
        onSignup(mockUser);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === AuthMode.LOGIN ? AuthMode.SIGNUP : AuthMode.LOGIN);
    setError(null);
  };

  return (
    <div className="flex flex-col space-y-6 w-full max-w-md mx-auto p-6 bg-[#1a1b26] rounded-lg shadow-xl">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <SparklesIcon className="w-8 h-8 text-purple-400" />
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
            {authMode === AuthMode.LOGIN ? 'Welcome Back' : 'Join MindMeld'}
          </h2>
          <SparklesIcon className="w-8 h-8 text-orange-400" />
        </div>
        <p className="text-slate-300">
          {authMode === AuthMode.LOGIN 
            ? 'Sign in to access your creative AI partner' 
            : 'Create an account to start your creative journey'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {authMode === AuthMode.SIGNUP && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-purple-300 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-[#24253a] border border-[#363759] rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-slate-100"
              placeholder="Your name"
              disabled={isLoading}
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-purple-300 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-[#24253a] border border-[#363759] rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-slate-100"
            placeholder="you@example.com"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-purple-300 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-[#24253a] border border-[#363759] rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-slate-100"
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-900 bg-opacity-40 border border-red-700 rounded-lg text-red-200 text-sm" role="alert">
            <p>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          ) : (
            <>{authMode === AuthMode.LOGIN ? 'Sign In' : 'Create Account'}</>
          )}
        </button>
      </form>

      <div className="text-center text-sm">
        <button
          type="button"
          onClick={toggleAuthMode}
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          {authMode === AuthMode.LOGIN
            ? "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
};
