import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CharacterPortrait from './CharacterPortrait';
import { extractCharacterDescriptions, generateCharacterPortrait } from '../services/portraitService';

interface CharacterPortraitsSectionProps {
  storyText: string;
}

const CharacterPortraitsSection: React.FC<CharacterPortraitsSectionProps> = ({ storyText }) => {
  const [characterDescriptions, setCharacterDescriptions] = useState<string[]>([]);
  const [selectedDescription, setSelectedDescription] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Extract character descriptions when story text changes
    if (storyText) {
      const descriptions = extractCharacterDescriptions(storyText);
      setCharacterDescriptions(descriptions);
      
      // Select the first description by default if available
      if (descriptions.length > 0 && !selectedDescription) {
        setSelectedDescription(descriptions[0]);
      }
    }
  }, [storyText]);

  const handleGeneratePortrait = async (description: string) => {
    return await generateCharacterPortrait(description);
  };

  const handleDescriptionSelect = (description: string) => {
    setSelectedDescription(description);
  };

  const handleCustomDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSelectedDescription(e.target.value);
  };

  if (!storyText) {
    return null;
  }

  return (
    <SectionContainer>
      <SectionHeader onClick={() => setIsExpanded(!isExpanded)}>
        <h2>Character Portraits</h2>
        <ExpandButton>{isExpanded ? '▼' : '▶'}</ExpandButton>
      </SectionHeader>
      
      {isExpanded && (
        <SectionContent>
          <p>Generate visual representations of characters from your story.</p>
          
          {characterDescriptions.length > 0 ? (
            <DescriptionsContainer>
              <h3>Detected Character Descriptions</h3>
              <DescriptionsList>
                {characterDescriptions.map((description, index) => (
                  <DescriptionItem 
                    key={index}
                    isSelected={description === selectedDescription}
                    onClick={() => handleDescriptionSelect(description)}
                  >
                    {description}
                  </DescriptionItem>
                ))}
              </DescriptionsList>
            </DescriptionsContainer>
          ) : (
            <NoDescriptionsMessage>
              No character descriptions detected. Add more details about your characters' appearance in your story, or use the custom description below.
            </NoDescriptionsMessage>
          )}
          
          <CustomDescriptionContainer>
            <h3>Custom Character Description</h3>
            <CustomDescriptionTextarea 
              value={selectedDescription}
              onChange={handleCustomDescriptionChange}
              placeholder="Describe your character's appearance (e.g., A young woman with long red hair, green eyes, and freckles, wearing a medieval dress)"
            />
          </CustomDescriptionContainer>
          
          <CharacterPortrait 
            characterDescription={selectedDescription}
            onGenerate={handleGeneratePortrait}
          />
        </SectionContent>
      )}
    </SectionContainer>
  );
};

const SectionContainer = styled.section`
  background: rgba(20, 20, 30, 0.5);
  border-radius: 12px;
  margin: 2rem 0;
  overflow: hidden;
  border: 1px solid rgba(178, 89, 255, 0.2);
  transition: all 0.3s ease;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(178, 89, 255, 0.1);
  cursor: pointer;
  
  h2 {
    margin: 0;
    color: #b259ff;
    font-size: 1.5rem;
  }
  
  &:hover {
    background: rgba(178, 89, 255, 0.2);
  }
`;

const ExpandButton = styled.span`
  color: #b259ff;
  font-size: 1.2rem;
`;

const SectionContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  p {
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 1.5rem;
    text-align: center;
  }
`;

const DescriptionsContainer = styled.div`
  width: 100%;
  margin-bottom: 1.5rem;
  
  h3 {
    color: #b259ff;
    font-size: 1.2rem;
    margin-bottom: 0.75rem;
  }
`;

const DescriptionsList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 0.5rem;
`;

const DescriptionItem = styled.div<{ isSelected: boolean }>`
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  background: ${props => props.isSelected ? 'rgba(178, 89, 255, 0.2)' : 'transparent'};
  border: 1px solid ${props => props.isSelected ? 'rgba(178, 89, 255, 0.5)' : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(178, 89, 255, 0.1);
  }
`;

const NoDescriptionsMessage = styled.div`
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
  text-align: center;
  font-style: italic;
`;

const CustomDescriptionContainer = styled.div`
  width: 100%;
  margin-bottom: 1.5rem;
  
  h3 {
    color: #b259ff;
    font-size: 1.2rem;
    margin-bottom: 0.75rem;
  }
`;

const CustomDescriptionTextarea = styled.textarea`
  width: 100%;
  height: 100px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-family: inherit;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: rgba(178, 89, 255, 0.5);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

export default CharacterPortraitsSection;
