/// <reference types="vite/client" />

// This service handles character portrait generation using the Stability AI API
// It converts character descriptions into image prompts and generates character portraits

import { apiKeyManager } from './apiKeyManager';

export enum PortraitStyle {
  ANIME = 'anime',
  REALISTIC = 'realistic'
}

interface StabilityResponse {
  artifacts: Array<{
    base64: string;
  }>;
}

// Stability AI API configuration
const STABILITY_API_URL = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';

// Fallback portraits in case API fails
const FALLBACK_PORTRAIT = 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png';

/**
 * Generate a character portrait based on a description using Stability AI API
 */
export const generateCharacterPortrait = async (
  characterDescription: string, 
  style: PortraitStyle = PortraitStyle.ANIME
): Promise<string> => {
  const apiKey = await apiKeyManager.getCurrentKey();
  
  if (!apiKey) {
    console.warn('No valid Stability AI API key found, using fallback portrait');
    return FALLBACK_PORTRAIT;
  }

  try {
    // Create an optimized prompt for image generation based on style
    const imagePrompt = optimizeDescriptionForImageGeneration(characterDescription, style);
    console.log(`Generated ${style} image prompt:`, imagePrompt);

    console.log('Making API request to:', STABILITY_API_URL);
    const requestBody = {
      text_prompts: [
        {
          text: imagePrompt,
          weight: 1
        }
      ],
      cfg_scale: 7,
      height: 1024,
      width: 1024,
      samples: 1,
      steps: 30,
      style_preset: style === PortraitStyle.ANIME ? 'anime' : 'photographic'
    };

    console.log('Request body:', requestBody);

    const response = await fetch(
      STABILITY_API_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('API Error:', response.status, response.statusText);
      console.error('Error details:', errorData);
      console.error('Request URL:', STABILITY_API_URL);
      console.error('Request headers:', {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer [HIDDEN]'
      });
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const responseData = await response.json() as StabilityResponse;
    
    if (responseData.artifacts && responseData.artifacts.length > 0) {
      const base64Image = responseData.artifacts[0].base64;
      return `data:image/png;base64,${base64Image}`;
    }

    throw new Error('No image generated');
  } catch (error) {
    console.error('Error generating character portrait:', error);
    return FALLBACK_PORTRAIT;
  }
};



/**
 * Optimize a character description for image generation
 * This function takes a raw character description and formats it
 * into a prompt that would work well with Stability AI API
 */
const optimizeDescriptionForImageGeneration = (description: string, style: PortraitStyle): string => {
  // Clean up the description
  const cleanDescription = description.trim();
  
  // Format as an image generation prompt based on style
  if (style === PortraitStyle.ANIME) {
    return `detailed portrait of ${cleanDescription}, anime style art, highly detailed, digital painting, concept art, smooth, sharp focus, illustration, by greg rutkowski makoto shinkai takashi takeuchi`;
  } else {
    return `detailed portrait of ${cleanDescription}, highly detailed, digital painting, artstation, concept art, smooth, sharp focus, illustration, realistic, art by artgerm and greg rutkowski and alphonse mucha`;
  }
};

/**
 * Extract character descriptions from story text
 * This function analyzes story text and identifies potential character descriptions
 */
export const extractCharacterDescriptions = (storyText: string): string[] => {
  if (!storyText || storyText.trim() === '') {
    return [];
  }
  
  const descriptions: string[] = [];
  const sentences = storyText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Look for sentences that likely describe characters
  // This is a simple implementation - a real one would use NLP
  for (const sentence of sentences) {
    const normalized = sentence.trim().toLowerCase();
    
    // Check if the sentence contains character description indicators
    if (
      (normalized.includes(' is ') || normalized.includes(' was ') || normalized.includes(' had ')) &&
      (
        normalized.includes(' hair') || 
        normalized.includes(' eyes') || 
        normalized.includes(' tall') || 
        normalized.includes(' short') || 
        normalized.includes(' wearing') ||
        normalized.includes(' face') ||
        normalized.includes(' looked') ||
        normalized.includes(' appearance')
      )
    ) {
      descriptions.push(sentence.trim());
    }
  }
  
  return descriptions;
};
