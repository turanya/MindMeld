
import React from 'react';
import { AlertTriangleIcon } from './icons';

interface ApiKeyDisplayProps {
  apiKeyPresent: boolean;
}

export const ApiKeyDisplay: React.FC<ApiKeyDisplayProps> = ({ apiKeyPresent }) => {
  if (apiKeyPresent) {
    return null; // Don't show anything if key is present
  }

  return (
    <div className="bg-red-800 bg-opacity-80 border border-red-600 text-red-100 px-4 py-3 rounded-lg relative shadow-lg" role="alert">
      <div className="flex items-center">
        <AlertTriangleIcon className="w-6 h-6 mr-3 text-red-300" />
        <div>
          <strong className="font-bold">API Key Missing!</strong>
          <span className="block sm:inline ml-1">Please ensure the <code>API_KEY</code> environment variable is set to use AI features.</span>
        </div>
      </div>
      <p className="text-sm mt-2 text-red-200">
        This application requires a valid Google Gemini API key. If you are running this locally, make sure to configure it in your environment. The key should be available as <code>process.env.API_KEY</code>.
      </p>
    </div>
  );
};