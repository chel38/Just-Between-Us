export type RelationshipKey =
  | 'trust'
  | 'attraction'
  | 'suspicion'
  | 'irritation'
  | 'curiosity'
  | 'respect';

export type DialogueId = string;
export type TranscriptSourceType = 'script-message' | 'player-choice' | 'system' | 'runtime';

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
  | 'photo'
  | 'attachment';

export type StoryAttachmentType = 'photo' | 'chat_screenshot' | 'document' | 'forwarded_message';

export interface StoryAttachmentEntry {
  id: string;
  author: string;
  text: string;
  timestamp?: string;
}

export interface StoryAttachmentField {
  label: string;
  value: string;
  emphasis?: boolean;
}

export interface StoryAttachment {
  id: string;
  type: StoryAttachmentType;
  title: string;
  subtitle?: string;
  source: string;
  sourceTimestamp?: string;
  asset?: string;
  alt?: string;
  entries?: StoryAttachmentEntry[];
  fields?: StoryAttachmentField[];
  actionLabel?: string;
  storyPurpose: string;
  promoAllowed: false;
  adultCharacters: boolean;
}

export interface ScriptMessage {
  id: string;
  sender: 'player' | 'character' | 'system';
  text?: string;
  kind?: MessageKind;
  delayMs?: number;
  typing?: boolean;
  typingInterrupted?: boolean;
  reaction?: string;
  quote?: string;
  quoteSourceId?: string;
  image?: string;
  alt?: string;
  attachment?: StoryAttachment;
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

export interface SceneContext {
  time: string;
  playerLocation: string;
  characterLocation: string;
  markLocation?: string;
  sceneGoal: string;
  knownFacts: string[];
  immediateRisk: 'low' | 'medium' | 'high' | 'resolved';
}

export interface DialogueNode {
  id: string;
  chapter: number;
  messages: ScriptMessage[];
  choices?: DialogueChoice[];
  endingId?: string;
  onEnter?: Effects;
  adBreak?: boolean;
  hint?: string;
  promoSafe?: boolean;
  /** Development-only continuity metadata. It is never rendered to the player. */
  sceneContext?: SceneContext;
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
  doubleMessageFrequency: 'none' | 'low' | 'medium' | 'high';
  punctuationStyle: 'casual' | 'precise' | 'minimal';
  averageMessageLength: 'short' | 'mixed' | 'long';
  typoFrequency: 'none' | 'rare' | 'occasional';
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
  contentRating: '18+';
  startNodeId: string;
  character: Character;
  nodes: DialogueNode[];
  endings: Ending[];
}

export interface TranscriptMessage {
  id: string;
  sourceType?: TranscriptSourceType;
  sourceId?: string;
  fallbackText?: string;
  /** @deprecated Kept only while migrating v1 saves. */
  scriptMessageId?: string;
  sender: 'player' | 'character' | 'system';
  /** @deprecated Runtime rendering resolves sourceId; legacy saves may still contain text. */
  text?: string;
  kind: MessageKind;
  timestamp: number;
  status?: 'sent' | 'delivered' | 'read';
  reaction?: string;
  quoteSourceId?: string;
  quoteFallbackText?: string;
  /** @deprecated Legacy quote fallback. */
  quote?: string;
  image?: string;
  alt?: string;
  attachment?: StoryAttachment;
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
  revealedHints: Record<string, boolean>;
  startedAt: number | null;
  updatedAt: number;
  endingId?: string;
  unread: number;
  characterStatus?: string;
  characterStatusSourceId?: string;
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
