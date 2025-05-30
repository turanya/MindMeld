// This service handles character portrait generation using the Gemini API
// It converts character descriptions into image prompts and returns URLs for character portraits

// Anime/Ghibli style character portraits
const ANIME_PORTRAITS = [
  'https://i.imgur.com/8wEGYRZ.png', // Anime girl with blue hair
  'https://i.imgur.com/JWxMsaY.png', // Anime boy with dark hair
  'https://i.imgur.com/5xVS2VU.png', // Ghibli style girl with brown hair
  'https://i.imgur.com/N9JUVtk.png', // Anime character with red hair
  'https://i.imgur.com/qKPQhLF.png', // Ghibli style boy with blonde hair
  'https://i.imgur.com/3crnFDj.png', // Anime character with green hair
];

// Realistic style character portraits
const REALISTIC_PORTRAITS = [
  'https://i.imgur.com/YkFMUsQ.png', // Realistic woman with dark hair
  'https://i.imgur.com/JWVpWiK.png', // Realistic man with beard
  'https://i.imgur.com/pHlZJGU.png', // Realistic young woman with blonde hair
  'https://i.imgur.com/8vQGtHl.png', // Realistic man with glasses
  'https://i.imgur.com/Qh9LjuW.png', // Realistic woman with red hair
  'https://i.imgur.com/7bDGUCm.png', // Realistic older man with gray hair
];

export enum PortraitStyle {
  ANIME = 'anime',
  REALISTIC = 'realistic'
}

/**
 * Generate a character portrait based on a description
 * 
 * In a production app, this would connect to an image generation API
 * For this demo, we'll return curated images and simulate API calls
 */
export const generateCharacterPortrait = async (
  characterDescription: string, 
  style: PortraitStyle = PortraitStyle.ANIME
): Promise<string> => {
  try {
    // In a real implementation, this would call an image generation API
    // For now, we'll simulate the API call with a delay and return a curated image
    
    // Create an optimized prompt for image generation based on style
    const imagePrompt = optimizeDescriptionForImageGeneration(characterDescription, style);
    console.log(`Generated ${style} image prompt:`, imagePrompt);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Select portrait collection based on style
    const portraitCollection = style === PortraitStyle.ANIME ? ANIME_PORTRAITS : REALISTIC_PORTRAITS;
    
    // Choose the most appropriate portrait based on the description
    const portraitIndex = selectAppropriatePortrait(characterDescription, portraitCollection);
    return portraitCollection[portraitIndex];
  } catch (error) {
    console.error('Error generating character portrait:', error);
    throw new Error('Failed to generate character portrait');
  }
};

/**
 * Select the most appropriate portrait based on character description
 * This is a simple implementation that looks for key traits in the description
 */
const selectAppropriatePortrait = (description: string, portraits: string[]): number => {
  const lowerDesc = description.toLowerCase();
  
  // Check for specific traits and return the appropriate portrait index
  if (lowerDesc.includes('blue hair') || lowerDesc.includes('azure')) return 0;
  if (lowerDesc.includes('dark hair') || lowerDesc.includes('black hair')) return 1;
  if (lowerDesc.includes('brown hair') || lowerDesc.includes('brunette')) return 2;
  if (lowerDesc.includes('red hair') || lowerDesc.includes('ginger')) return 3;
  if (lowerDesc.includes('blonde') || lowerDesc.includes('yellow hair')) return 4;
  if (lowerDesc.includes('green hair') || lowerDesc.includes('teal')) return 5;
  
  // If no specific traits match, return a random portrait
  return Math.floor(Math.random() * portraits.length);
};

/**
 * Optimize a character description for image generation
 * This function takes a raw character description and formats it
 * into a prompt that would work well with image generation APIs
 */
const optimizeDescriptionForImageGeneration = (description: string, style: PortraitStyle): string => {
  // Clean up the description
  const cleanDescription = description.trim();
  
  // Format as an image generation prompt based on style
  if (style === PortraitStyle.ANIME) {
    return `Anime/Ghibli style portrait of a character: ${cleanDescription}, vibrant colors, expressive eyes, clean lines, Studio Ghibli inspired, high quality illustration`;
  } else {
    return `Realistic portrait of a character: ${cleanDescription}, photorealistic, detailed features, expressive face, studio lighting, high resolution`;
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
