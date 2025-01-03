import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/db/schema';
import type { ChatHistory } from '@/db/schema';

export function useSupabaseChat() {
  const supabase = createClientComponentClient<Database>();
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);

  const createNewChat = async (title: string = 'Nuova Chat') => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('chat_histories')
      .insert({
        user_id: user.id,
        title: title,
      })
      .select()
      .single();

    if (error) {
      console.error('Errore nella creazione della chat:', error);
      return null;
    }

    setChatHistories(prev => [...prev, data]);
    return data;
  };

  const loadChatHistories = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('chat_histories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Errore nel caricamento delle chat:', error);
      return;
    }

    setChatHistories(data);
  };

  return {
    chatHistories,
    createNewChat,
    loadChatHistories,
  };
} 