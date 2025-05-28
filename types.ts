
export enum LiteraryStyle {
  MURAKAMI = "Haruki Murakami",
  SHAKESPEAREAN = "Shakespearean",
  CYBERPUNK = "Cyberpunk",
  NOIR = "Noir",
  POETIC_MONOLOGUE = "Poetic Monologue",
  SCIFI_SCREENPLAY = "Sci-Fi Screenplay Scene",
  SURREALIST_SHORT_STORY = "Surreal Short Story",
  FAIRY_TALE = "Classic Fairy Tale",
  EPIC_POEM = "Epic Poem Snippet"
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
  REVERSE_STORY = "ReverseStory"
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web: GroundingChunkWeb;
}