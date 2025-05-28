
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { startChatSessionWithGemini, sendMessageToChatWithGemini } from '../services/geminiService';
import { ChatMessage } from '../types';
import { LoadingSpinner } from './common/LoadingSpinner';
import { UserIcon, BotIcon, SendIcon } from './icons';

interface BrainstormPartnerSectionProps {
  initialThought?: string;
}

export const BrainstormPartnerSection: React.FC<BrainstormPartnerSectionProps> = ({ initialThought }) => {
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const initializeChat = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const systemPrompt = "You are MindMeld, a creative AI muse. Your goal is to help users explore and expand their fleeting thoughts, dreams, or feelings into richer concepts for stories, poems, or scripts. Engage in a thoughtful conversation, ask clarifying questions, offer evocative suggestions, and help them uncover deeper meanings or narrative possibilities in their ideas. Be encouraging and inspiring.";
      const chat = await startChatSessionWithGemini(systemPrompt);
      setChatSession(chat);
      
      const initialMessages: ChatMessage[] = [];
      if (initialThought && initialThought.trim() !== '') {
        initialMessages.push({ id: Date.now().toString() + 'system', role: 'system', text: `Let's brainstorm about this idea: "${initialThought}"`, timestamp: new Date() });
      } else {
        initialMessages.push({ id: Date.now().toString() + 'system', role: 'system', text: "Hello! I'm your AI Brainstorm Partner. What's on your mind?", timestamp: new Date() });
      }
      setMessages(initialMessages);

    } catch (e) {
      console.error("Error initializing chat session:", e);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsLoading(false);
    }
  }, [initialThought]);

  useEffect(() => {
    initializeChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialThought]); // Re-initialize if initialThought changes (e.g. user types in main tab then switches)

  const handleSendMessage = async () => {
    if (!userInput.trim() || !chatSession) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: userInput, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      const modelResponse = await sendMessageToChatWithGemini(chatSession, userMsg.text);
      const modelMsg: ChatMessage = { id: Date.now().toString() + 'model', role: 'model', text: modelResponse, timestamp: new Date() };
      setMessages(prev => [...prev, modelMsg]);
    } catch (e) {
      console.error("Error sending message:", e);
      setError(e instanceof Error ? e.message : String(e));
      const errorMsg: ChatMessage = { id: Date.now().toString() + 'error', role: 'system', text: `Error: ${e instanceof Error ? e.message : String(e)}`, timestamp: new Date() };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!chatSession && !isLoading && !error) {
     // This handles the case where initialThought might change and trigger re-init.
     // The initial loading state is handled by the spinner below.
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <LoadingSpinner />
        <p className="mt-4 text-slate-400">Initializing brainstorm session...</p>
      </div>
    );
  }


  return (
    <div className="flex flex-col h-[70vh]">
      <p className="text-lg font-semibold text-purple-300 mb-4 text-center">AI Brainstorm Partner</p>
      <div className="flex-grow overflow-y-auto bg-slate-700 bg-opacity-50 p-4 rounded-lg space-y-4 border border-slate-600 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-xl shadow ${
                msg.role === 'user' ? 'bg-purple-600 text-white' : 
                msg.role === 'model' ? 'bg-slate-600 text-slate-100' : 
                'bg-yellow-600 text-yellow-100 italic text-sm w-full text-center' // System messages
            }`}>
              {msg.role !== 'system' && (
                <div className="flex items-center mb-1">
                  {msg.role === 'user' ? <UserIcon className="w-4 h-4 mr-2" /> : <BotIcon className="w-4 h-4 mr-2" />}
                  <span className="font-semibold text-sm">{msg.role === 'user' ? 'You' : 'Muse AI'}</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              <p className="text-xs opacity-70 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {error && <p className="text-red-400 text-sm p-2 text-center">{error}</p>}
      
      {isLoading && messages.length > 0 && messages[messages.length-1].role === 'user' && (
        <div className="flex justify-start p-2">
          <div className="flex items-center gap-2 bg-slate-600 text-slate-100 px-4 py-3 rounded-xl shadow">
            <BotIcon className="w-4 h-4 mr-1" />
            <LoadingSpinner size="xs" />
            <span className="text-sm italic">Muse AI is thinking...</span>
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
          placeholder={isLoading ? "Muse AI is replying..." : "Chat with your AI muse..."}
          className="flex-grow p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-slate-100"
          disabled={isLoading || !chatSession}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !userInput.trim() || !chatSession}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};