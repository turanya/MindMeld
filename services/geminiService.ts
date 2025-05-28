
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_TEXT } from '../constants';
import { LiteraryStyle } from '../types';

// Initialize the GoogleGenAI client instance
// The API key MUST be available as process.env.API_KEY in the execution environment.
let ai: GoogleGenAI | null = null;

try {
  if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable is not set. Gemini API features will be unavailable.");
    // We don't throw here, App.tsx will handle UI based on key presence.
  } else {
     ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (error) {
  console.error("Failed to initialize GoogleGenAI:", error);
  // ai remains null, App.tsx should reflect this.
}


const checkAiInstance = () => {
  if (!ai) {
    throw new Error("Gemini AI Service not initialized. API_KEY might be missing or invalid.");
  }
  return ai;
}

export const generateStoryWithGemini = async (thought: string, style: LiteraryStyle): Promise<string> => {
  const currentAi = checkAiInstance();
  const prompt = `You are an expert storyteller with a deep understanding of various literary styles. Generate a creative piece in the style of ${style} based on the following thought, dream, or feeling. Expand on it, be imaginative, and capture the essence of the chosen style. Avoid any introductory or concluding remarks like "Here is a story..." or "I hope you liked it.". Just provide the creative piece directly.

Thought/Dream/Feeling: "${thought}"

Style: ${style}

Generated Piece:`;

  try {
    const response: GenerateContentResponse = await currentAi.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error('Gemini API Error (generateStory):', error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate story: ${error.message}`);
    }
    throw new Error('Failed to generate story due to an unknown error.');
  }
};

export const startChatSessionWithGemini = async (systemInstruction: string): Promise<Chat> => {
  const currentAi = checkAiInstance();
  try {
    const chat: Chat = currentAi.chats.create({
      model: GEMINI_MODEL_TEXT,
      config: {
        systemInstruction: systemInstruction,
        // For a brainstorm partner, higher creativity might be desired, so default temperature is fine.
        // If lower latency is critical, add: thinkingConfig: { thinkingBudget: 0 }
      },
    });
    return chat;
  } catch (error) {
    console.error('Gemini API Error (startChat):', error);
     if (error instanceof Error) {
        throw new Error(`Failed to start chat session: ${error.message}`);
    }
    throw new Error('Failed to start chat session due to an unknown error.');
  }
};

export const sendMessageToChatWithGemini = async (chat: Chat, message: string): Promise<string> => {
  // checkAiInstance() is not needed here as chat object implies AI is initialized.
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text.trim();
  } catch (error) {
    console.error('Gemini API Error (sendMessage):', error);
    if (error instanceof Error) {
        throw new Error(`Failed to send message: ${error.message}`);
    }
    throw new Error('Failed to send message due to an unknown error.');
  }
};

export const generateThoughtFromStoryWithGemini = async (storyText: string): Promise<string> => {
  const currentAi = checkAiInstance();
  const prompt = `This is a piece of creative writing. Please analyze it and try to describe the core, concise thought, feeling, or dream fragment that might have inspired it. Focus on the essence of the original inspiration. Provide only the inferred thought, feeling, or dream fragment, without any extra phrases like "The original thought might have been...".

Story:
"""
${storyText}
"""

Inferred original inspiring thought/feeling/dream fragment:`;

  try {
    const response: GenerateContentResponse = await currentAi.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error('Gemini API Error (generateThoughtFromStory):', error);
    if (error instanceof Error) {
        throw new Error(`Failed to analyze story: ${error.message}`);
    }
    throw new Error('Failed to analyze story due to an unknown error.');
  }
};