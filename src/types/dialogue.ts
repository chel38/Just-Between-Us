export type RelationshipKey =
  | 'trust'
  | 'attraction'
  | 'suspicion'
  | 'irritation'
  | 'curiosity'
  | 'respect';

export type Relationship = Record<RelationshipKey, number>;

export type DialogueStatus =
  | 'locked'
  | 'available'
  | 'started'
  | 'active'
  | 'completed_good'
  | 'completed_neutral'
  | 'completed_bad'
  | 'blocked';

export interface Conditions {
  requiresFlags?: string[];
  forbiddenFlags?: string[];
  minRelationship?: Partial<Relationship>;
  maxRelationship?: Partial<Relationship>;
  requiresChoices?: string[];
}

export interface Effects extends Partial<Relationship> {
  setFlags?: string[];
  clearFlags?: string[];
}

export type MessageKind =
  | 'message'
  | 'system'
  | 'deleted'
  | 'status'
  | 'statusChanged'
  | 'avatarChanged'
  | 'delay'
  | 'photo';

export interface ScriptMessage {
  id: string;
  sender: 'character' | 'system';
  text?: string;
  kind?: MessageKind;
  delayMs?: number;
  typing?: boolean;
  typingInterrupted?: boolean;
  reaction?: string;
  quote?: string;
  image?: string;
  alt?: string;
  conditions?: Conditions;
}

export interface DialogueChoice {
  id: string;
  text: string;
  next: string;
  effects?: Effects;
  conditions?: Conditions;
  tone?: 'warm' | 'bold' | 'careful' | 'witty' | 'risky';
}

export interface DialogueNode {
  id: string;
  chapter: number;
  messages: ScriptMessage[];
  choices?: DialogueChoice[];
  endingId?: string;
  onEnter?: Effects;
  adBreak?: boolean;
}

export interface Ending {
  id: string;
  title: string;
  description: string;
  type: 'good' | 'neutral' | 'bad' | 'secret';
  number: number;
  blocked?: boolean;
}

export interface WritingProfile {
  capitalization: 'standard' | 'mixed' | 'lowercase';
  emojiFrequency: 'none' | 'low' | 'medium';
  messageLength: 'short' | 'mixed' | 'long';
  punctuation: 'casual' | 'precise' | 'minimal';
  doubleMessages: boolean;
  typoChance: number;
}

export interface Character {
  id: string;
  name: string;
  age: number;
  role: string;
  status: string;
  accent: string;
  avatar: string;
  avatarLarge: string;
  summary: string;
  writingProfile: WritingProfile;
}

export interface DialogueDefinition {
  id: string;
  title: string;
  startNodeId: string;
  character: Character;
  nodes: DialogueNode[];
  endings: Ending[];
}

export interface TranscriptMessage {
  id: string;
  scriptMessageId?: string;
  sender: 'player' | 'character' | 'system';
  text: string;
  kind: MessageKind;
  timestamp: number;
  status?: 'sent' | 'delivered' | 'read';
  reaction?: string;
  quote?: string;
  image?: string;
  alt?: string;
}

export interface DialogueProgress {
  dialogueId: string;
  status: DialogueStatus;
  currentNodeId: string;
  history: TranscriptMessage[];
  relationship: Relationship;
  flags: string[];
  choiceHistory: string[];
  seenNodes: string[];
  endingsUnlocked: string[];
  awaitingChoice: boolean;
  processedMessageIds: string[];
  startedAt: number | null;
  updatedAt: number;
  endingId?: string;
  unread: number;
  characterStatus?: string;
  characterAvatar?: string;
}

export const EMPTY_RELATIONSHIP: Relationship = {
  trust: 0,
  attraction: 0,
  suspicion: 0,
  irritation: 0,
  curiosity: 0,
  respect: 0,
};
