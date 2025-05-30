export type LiteraryStyle = 
  | 'Modern Fiction'
  | 'Fantasy'
  | 'Science Fiction'
  | 'Historical Fiction'
  | 'Romance'
  | 'Mystery'
  | 'Horror'
  | 'Poetry'
  | 'Fairy Tale'
  | 'Dystopian';

export interface User {
  id: string;
  name: string;
  email: string;
}

export enum ActiveTab {
  THOUGHT_TO_STORY = 'thought-to-story',
  BRAINSTORM_PARTNER = 'brainstorm-partner',
  REVERSE_STORY = 'reverse-story',
  AUTH = 'auth',
}

// Character Portrait Types
export interface CharacterDescription {
  id: string;
  text: string;
  portraitUrl?: string;
}

export interface CharacterPortraitOptions {
  style: 'realistic' | 'anime' | 'cartoon' | 'fantasy';
  detailLevel: 'low' | 'medium' | 'high';
}
