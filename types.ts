
export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export enum QueryClassification {
  TRIVIAL = 'TRIVIAL',
  COMPLEX = 'COMPLEX',
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  classification?: QueryClassification;
}
