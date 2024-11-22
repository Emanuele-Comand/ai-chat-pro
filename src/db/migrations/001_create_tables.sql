-- Create chat histories table
create table chat_histories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users,
  title text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create chat messages table
create table chat_messages (
  id uuid default uuid_generate_v4() primary key,
  chat_id uuid references chat_histories,
  content text,
  type text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Add indexes for better performance
create index idx_chat_messages_chat_id on chat_messages(chat_id);
create index idx_chat_histories_user_id on chat_histories(user_id); 