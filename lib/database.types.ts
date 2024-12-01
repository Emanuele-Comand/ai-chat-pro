export type Database = {
  public: {
    Tables: {
      chat_messages: {
        Row: {
          id: string
          content: string
          type: 'user' | 'ai'
          chat_id: string
          created_at?: string
        }
        // ... altri dettagli della tabella
      }
      // ... altre tabelle
    }
  }
} 