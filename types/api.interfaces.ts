export type AskQuestionResponse = {
  answer?: string;
  conversation_id?: string;
  conversationId?: string;
  sources?: unknown[];
  [key: string]: unknown;
};

export type ConversationResponse = {
  id: string;
  title?: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
};
