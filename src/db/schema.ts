export interface ChatHistory {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  content: string;
  type: 'user' | 'assistant';
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      chat_histories: {
        Row: ChatHistory;
        Insert: Omit<ChatHistory, 'id' | 'created_at'>;
        Update: Partial<Omit<ChatHistory, 'id' | 'created_at'>>;
      };
      chat_messages: {
        Row: ChatMessage;
        Insert: Omit<ChatMessage, 'id' | 'created_at'>;
        Update: Partial<Omit<ChatMessage, 'id' | 'created_at'>>;
      };
    };
  };
} 