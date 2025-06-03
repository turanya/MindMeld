import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { PortraitStyle, extractCharacterDescriptions } from '../services/portraitService';

interface CharacterPortraitProps {
  characterDescription: string;
  storyText?: string;
  onGenerate: (description: string, style: PortraitStyle) => Promise<string>;
  onSelectDescription?: (description: string) => void;
}

const CharacterPortrait: React.FC<CharacterPortraitProps> = ({ 
  characterDescription, 
  storyText,
  onGenerate,
  onSelectDescription
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [portraitUrl, setPortraitUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<PortraitStyle>(PortraitStyle.ANIME);
  const [detectedDescriptions, setDetectedDescriptions] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState(characterDescription);
  const [useCustomPrompt, setUseCustomPrompt] = useState(false);

  useEffect(() => {
    if (storyText) {
      const descriptions = extractCharacterDescriptions(storyText);
      setDetectedDescriptions(descriptions);
    }
  }, [storyText]);

  useEffect(() => {
    setCustomPrompt(characterDescription);
  }, [characterDescription]);

  const generatePortrait = async () => {
    const promptToUse = useCustomPrompt ? customPrompt : characterDescription;
    if (!promptToUse.trim()) {
      setError("Please provide a character description first");
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      const imageUrl = await onGenerate(useCustomPrompt ? customPrompt : characterDescription, selectedStyle);
      setPortraitUrl(imageUrl);
    } catch (err) {
      setError("Failed to generate portrait. Please try again.");
      console.error("Portrait generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <PortraitContainer>
      <h3>Character Portrait</h3>
      
      {portraitUrl ? (
        <PortraitImage src={portraitUrl} alt="Generated character portrait" />
      ) : (
        <PortraitPlaceholder>
          {isGenerating ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Creating your character...</p>
            </div>
          ) : (
            <p>Character portrait will appear here</p>
          )}
        </PortraitPlaceholder>
      )}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <StyleSelector>
        <h4>Portrait Style:</h4>
        <StyleOptions>
          <StyleOption 
            isSelected={selectedStyle === PortraitStyle.ANIME}
            onClick={() => setSelectedStyle(PortraitStyle.ANIME)}
          >
            <StyleIcon>🎨</StyleIcon>
            <span>Anime/Ghibli</span>
          </StyleOption>
          <StyleOption 
            isSelected={selectedStyle === PortraitStyle.REALISTIC}
            onClick={() => setSelectedStyle(PortraitStyle.REALISTIC)}
          >
            <StyleIcon>📷</StyleIcon>
            <span>Realistic</span>
          </StyleOption>
        </StyleOptions>
      </StyleSelector>
      
      <GenerateButton 
        onClick={generatePortrait} 
        disabled={isGenerating || !characterDescription.trim()}
      >
        {isGenerating ? 'Generating...' : 'Generate Portrait'}
      </GenerateButton>
      
      <DescriptionBox>
        <h4>Character Description:</h4>
        {detectedDescriptions.length > 0 && (
          <div className="detected-descriptions">
            <h5>Detected Characters:</h5>
            {detectedDescriptions.map((desc, index) => (
              <DescriptionOption 
                key={index} 
                isSelected={!useCustomPrompt && characterDescription === desc}
                onClick={() => {
                  setUseCustomPrompt(false);
                  onSelectDescription?.(desc);
                }}
              >
                {desc}
              </DescriptionOption>
            ))}
          </div>
        )}
        <div className="custom-prompt">
          <h5>Custom Prompt:</h5>
          <CustomPromptInput
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Enter your custom character description"
          />
          <CustomPromptToggle
            isSelected={useCustomPrompt}
            onClick={() => setUseCustomPrompt(!useCustomPrompt)}
          >
            {useCustomPrompt ? '✓ Using Custom Prompt' : '○ Use Custom Prompt'}
          </CustomPromptToggle>
        </div>
      </DescriptionBox>
    </PortraitContainer>
  );
};

const PortraitContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: rgba(30, 30, 40, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin: 1rem 0;
  width: 100%;
  max-width: 500px;
  backdrop-filter: blur(10px);
  
  h3 {
    color: #b259ff;
    margin-top: 0;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const PortraitPlaceholder = styled.div`
  width: 256px;
  height: 256px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  padding: 1rem;
  
  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: #b259ff;
      animation: spin 1s ease-in-out infinite;
      margin-bottom: 1rem;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  }
`;

const PortraitImage = styled.img`
  width: 256px;
  height: 256px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`;

const GenerateButton = styled.button`
  background: #b259ff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin: 1rem 0;
  transition: all 0.2s ease;
  
  &:hover {
    background: #9c41e6;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(178, 89, 255, 0.3);
  }
  
  &:disabled {
    background: #666;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  color: #ff5555;
  margin: 0.5rem 0;
  font-size: 0.9rem;
`;

const DescriptionBox = styled.div`
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  
  h4 {
    margin-top: 0;
    color: #b259ff;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.8);
  }
`;

const StyleSelector = styled.div`
  width: 100%;
  margin: 1rem 0;

  h4 {
    margin-top: 0;
    color: #b259ff;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    text-align: center;
  }
`;

const StyleOptions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  width: 100%;
`;

interface StyleOptionProps {
  isSelected: boolean;
}

const StyleOption = styled.div<StyleOptionProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.isSelected ? 'rgba(178, 89, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  border: 1px solid ${props => props.isSelected ? '#b259ff' : 'rgba(255, 255, 255, 0.1)'};
  flex: 1;
  max-width: 120px;

  &:hover {
    background: rgba(178, 89, 255, 0.15);
    transform: translateY(-2px);
  }

  span {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: ${props => props.isSelected ? '#b259ff' : 'rgba(255, 255, 255, 0.8)'};
  }
`;

const StyleIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
`;

const DescriptionOption = styled.div<StyleOptionProps>`
  padding: 0.5rem;
  margin: 0.25rem 0;
  border-radius: 6px;
  cursor: pointer;
  background: ${props => props.isSelected ? 'rgba(178, 89, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  border: 1px solid ${props => props.isSelected ? '#b259ff' : 'rgba(255, 255, 255, 0.1)'};
  transition: all 0.2s ease;

  &:hover {
    background: rgba(178, 89, 255, 0.15);
    transform: translateX(2px);
  }
`;

const CustomPromptInput = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  resize: vertical;
  margin: 0.5rem 0;

  &:focus {
    outline: none;
    border-color: #b259ff;
  }
`;

const CustomPromptToggle = styled.button<StyleOptionProps>`
  background: ${props => props.isSelected ? 'rgba(178, 89, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  border: 1px solid ${props => props.isSelected ? '#b259ff' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.isSelected ? '#b259ff' : 'rgba(255, 255, 255, 0.8)'};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(178, 89, 255, 0.15);
  }
`;

export default CharacterPortrait;
