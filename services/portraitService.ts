// This service handles character portrait generation using the Gemini API
// It converts character descriptions into image prompts and returns placeholder URLs

const DEFAULT_PORTRAITS = [
  'https://storage.googleapis.com/pai-images/ae74b3002bfe4b538493ca7aedb6a300.jpeg',
  'https://storage.googleapis.com/pai-images/8a4be5d5e67b4d7a870cf6b8b2c56ad1.jpeg',
  'https://storage.googleapis.com/pai-images/0394e4a6b5f74552a7f6e1b57e871ca2.jpeg',
  'https://storage.googleapis.com/pai-images/2d2ad91c1a0e4bdab392d8d5e50d1270.jpeg',
  'https://storage.googleapis.com/pai-images/f1c3f9d3e86e4db3a8208a65c855d742.jpeg',
  'https://storage.googleapis.com/pai-images/ddf0e8b5c0c14c9f94f596ef6728c6d3.jpeg',
];

/**
 * Generate a character portrait based on a description
 * 
 * In a production app, this would connect to an image generation API
 * For this demo, we'll return placeholder images and simulate API calls
 */
export const generateCharacterPortrait = async (characterDescription: string): Promise<string> => {
  try {
    // In a real implementation, this would call an image generation API
    // For now, we'll simulate the API call with a delay and return a placeholder
    
    // Create an optimized prompt for image generation
    const imagePrompt = optimizeDescriptionForImageGeneration(characterDescription);
    console.log('Generated image prompt:', imagePrompt);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return a random placeholder from our collection
    // In a real implementation, this would be the URL returned by the image generation API
    const randomIndex = Math.floor(Math.random() * DEFAULT_PORTRAITS.length);
    return DEFAULT_PORTRAITS[randomIndex];
  } catch (error) {
    console.error('Error generating character portrait:', error);
    throw new Error('Failed to generate character portrait');
  }
};

/**
 * Optimize a character description for image generation
 * This function takes a raw character description and formats it
 * into a prompt that would work well with image generation APIs
 */
const optimizeDescriptionForImageGeneration = (description: string): string => {
  // Extract key visual elements from the description
  const cleanDescription = description.trim();
  
  // Add style and quality prompts that would help an image generation API
  return `Portrait of a character: ${cleanDescription}, digital art, highly detailed, fantasy style, vibrant colors, 4k, professional character concept art`;
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
