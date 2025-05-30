
export enum LiteraryStyle {
  MURAKAMI = "Haruki Murakami",
  SHAKESPEAREAN = "Shakespearean",
  CYBERPUNK = "Cyberpunk",
  NOIR = "Noir",
  POETIC_MONOLOGUE = "Poetic Monologue",
  SCIFI_SCREENPLAY = "Sci-Fi Screenplay Scene",
  SURREALIST_SHORT_STORY = "Surreal Short Story",
  FAIRY_TALE = "Classic Fairy Tale",
  EPIC_POEM = "Epic Poem Snippet",
  HORROR = "Horror"
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
}

export enum ActiveTab {
  THOUGHT_TO_STORY = "ThoughtToStory",
  BRAINSTORM_PARTNER = "BrainstormPartner",
  REVERSE_STORY = "ReverseStory",
  AUTH = "Auth"
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web: GroundingChunkWeb;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export enum AuthMode {
  LOGIN = "Login",
  SIGNUP = "Signup"
}