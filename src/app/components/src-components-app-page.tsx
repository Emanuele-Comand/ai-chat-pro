"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { MessageSquare, Image as ImageIcon, Music, Settings, Send, Zap, Sparkles, Palette, SplitSquareVertical, User, Video, MoreVertical, Copy, Share, Flag, Trash2, LogOut } from "lucide-react"
import Link from "next/link"
import { VideoGenerationSection } from './video-generation';
import { WelcomeSection } from './welcome-section';
import { getChatResponse } from '@/lib/mistralApi';
import { useSupabaseChat } from '@/hooks/useSupabaseChat';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "../../../lib/database.types"
import { useRouter } from 'next/navigation'
import { ConfirmDialog } from "./ui/confirm-dialog"

interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'ai';
  chat_id: string;
}

export function AppPageComponent() {
  const [message, setMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [activeTab, setActiveTab] = useState("chat")
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { 
    chatHistories, 
    createNewChat, 
    loadChatHistories,
    deleteChat
  } = useSupabaseChat();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [chatToDelete, setChatToDelete] = useState<string | null>(null)

  useEffect(() => {
    loadChatHistories();
  }, [loadChatHistories]);

  useEffect(() => {
    const fetchUsername = async () => {
      const supabase = createClientComponentClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.username) {
        setUsername(user.user_metadata.username);
      }
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    console.log("🔄 chatHistories aggiornato:", 
      chatHistories.map(ch => ({ id: ch.id, title: ch.title }))
    );
  }, [chatHistories]);

  const handleNewChat = async () => {
    const newChat = await createNewChat();
    if (newChat) {
      setSelectedChatId(newChat.id);
      setChatMessages([]); // Pulisce i messaggi quando si crea una nuova chat
    }
  };

  const scrollToBottom = () => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  const handleCopyMessage = (content: string): void => {
    navigator.clipboard.writeText(content)
      .then(() => {
        console.log('Testo copiato negli appunti');
      })
      .catch((err) => {
        console.error('Errore durante la copia del testo:', err);
      });
  }

  const handleShareMessage = (content: string): void => {
    if (navigator.share) {
      navigator.share({
        title: 'Shared Message',
        text: content,
      }).catch((err) => {
        console.error('Sharing failed', err);
      });
    } else {
      console.log("Sharing not supported");
    }
  }

  const handleReportMessage = (id: string): void => {
    console.log("Segnalazione del messaggio:", id)
  }

  const handleDeleteMessage = (id: string): void => {
    setChatMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
  }

  const handleSendMessage = async (): Promise<void> => {
    if (!message.trim()) return;

    const supabase = createClientComponentClient<Database>();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('Utente non autenticato');
      return;
    }

    if (!selectedChatId) {
      const newChat = await createNewChat();
      if (newChat) {
        setSelectedChatId(newChat.id);
      }
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      type: 'user',
      chat_id: selectedChatId || ''
    };

    const { data, error } = await supabase
      .from('chat_messages')
      .insert([{
        content: message,
        type: 'user',
        chat_id: selectedChatId
      }])
      .select();

      console.log("🚀 supabase request",supabase);
      console.log("🚀 supabase data", data);
      console.error("🚀 supabase error", error);

    setChatMessages([...chatMessages, newMessage]);
    setMessage(""); 
    scrollToBottom();

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: "",
      type: 'ai',
      chat_id: selectedChatId || ''
    };
    setChatMessages(prevMessages => [...prevMessages, aiMessage]);
    setIsWaitingResponse(true);

    try {
      const aiResponse = await getChatResponse(message);
      setIsWaitingResponse(false);
      
      let currentText = "";
      let index = 0;

      const startTypingEffect = () => {
        setIsTyping(true);
        console.log("Stato isTyping:", true);
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
          if (index < aiResponse.length) {
            currentText += aiResponse[index];
            setChatMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.id === aiMessage.id
                  ? { ...msg, content: currentText }
                  : msg
              )
            );
            index++;
          } else {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              setIsTyping(false);
              console.log("Stato isTyping:", false);
            }
          }
        }, 20);
      };

      startTypingEffect();

    } catch (error) {
      setIsWaitingResponse(false);
      console.error('Errore nella risposta:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Mi dispiace, si è verificato un errore nella comunicazione.",
        type: 'ai',
        chat_id: selectedChatId || ''
      };
      setChatMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };

  const loadChatMessages = async (chatId: string) => {
    const supabase = createClientComponentClient();
    
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Errore nel caricamento dei messaggi:', error);
      return;
    }

    setChatMessages(messages || []);
  };

  const handleChatSelect = async (chatId: string) => {
    setSelectedChatId(chatId);
    await loadChatMessages(chatId);
  };

  const handleLogout = async () => {
    const supabase = createClientComponentClient();
    try {
      await supabase.auth.signOut();
      // Reset degli stati
      setUsername(null);
      setIsDropdownOpen(false);
      setChatMessages([]);
      setSelectedChatId(null);
      // Reindirizza alla landing page
      router.push('/');
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  const handleDeleteChat = async (chatId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setChatToDelete(chatId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!chatToDelete) return;
    
    console.log("🚀 Avvio eliminazione chat:", {
      chatToDelete,
      totalChats: chatHistories.length,
      chats: chatHistories.map(ch => ({ id: ch.id, title: ch.title }))
    });

    try {
      const success = await deleteChat(chatToDelete);
      
      if (success) {
        console.log("✅ Eliminazione completata con successo");
        
        if (selectedChatId === chatToDelete) {
          setSelectedChatId(null);
          setChatMessages([]);
          console.log("🔄 Reset chat selezionata");
        }
        
        // Verifica immediata dello stato
        console.log("📊 Stato chatHistories dopo eliminazione:", {
          totalChats: chatHistories.length,
          chats: chatHistories.map(ch => ({ id: ch.id, title: ch.title }))
        });
      } else {
        console.error("❌ Eliminazione fallita");
      }
    } catch (error) {
      console.error("❌ Errore durante l'eliminazione:", error);
    } finally {
      setDeleteDialogOpen(false);
      setChatToDelete(null);
    }
  };

  const ChatSection = (): JSX.Element => (
    <div 
      ref={chatContainerRef}
      className={`h-[calc(100vh-8rem)] overflow-y-auto ${isTyping ? 'typing' : ''}`}
    >
      <div className="p-4 pb-20">
        {chatMessages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} mb-4 relative`}>
            <div className={`w-3/4 p-3 rounded-lg ${msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-100'}`}>
              <div className="flex items-center mb-2">
                {msg.type === 'user' ? <User className="w-5 h-5 mr-2" /> : <MessageSquare className="w-5 h-5 mr-2" />}
                <span className="font-semibold">{msg.type === 'user' ? 'You' : 'AI'}</span>
              </div>
              {msg.type === 'ai' && isWaitingResponse && msg.id === chatMessages[chatMessages.length - 1].id ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
            {msg.type === 'ai' && (
              <div className="absolute top-0 right-0 mt-1 mr-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto"
                  onClick={() => setOpenMenuId(openMenuId === msg.id ? null : msg.id)}
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </Button>
                {openMenuId === msg.id && (
                  <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <button
                        onClick={() => handleCopyMessage(msg.content)}
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left"
                        role="menuitem"
                      >
                        <Copy className="mr-3 h-4 w-4" /> Copy
                      </button>
                      <button
                        onClick={() => handleShareMessage(msg.content)}
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left"
                        role="menuitem"
                      >
                        <Share className="mr-3 h-4 w-4" /> Share
                      </button>
                      <button
                        onClick={() => handleReportMessage(msg.id)}
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left"
                        role="menuitem"
                      >
                        <Flag className="mr-3 h-4 w-4" /> Report
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left"
                        role="menuitem"
                      >
                        <Trash2 className="mr-3 h-4 w-4" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const handleUseCaseClick = (useCase: string) => {
    // Implementa la logica per gestire il click sul caso d'uso
    console.log(`Caso d'uso selezionato: ${useCase}`);
  };

  return (
    <div className="flex h-screen overflow-x-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="w-64 bg-gray-800 p-4 flex flex-col border-r border-gray-700">
        <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-8">
          AI Chat Pro
        </Link>
        <Button 
          onClick={handleNewChat}
          className="mb-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white"
        >
          New Chat
        </Button>
        <div className="flex-grow overflow-auto">
          {chatHistories.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatSelect(chat.id)}
              className={`p-2 mb-2 rounded cursor-pointer hover:bg-gray-700 transition-colors ${
                selectedChatId === chat.id ? 'bg-gray-700' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-grow overflow-hidden">
                  <MessageSquare className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{chat.title}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteChat(chat.id, e)}
                  className="p-1 hover:bg-gray-600 rounded-full transition-colors ml-2"
                  title="Elimina chat"
                >
                  <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-4 border-gray-600 text-gray-800 hover:bg-gray-800 hover:text-gray-100 group">
          <Settings className="mr-2 h-4 w-4 group-hover:text-gray-100" />
          <span className="group-hover:text-gray-100">Settings</span>
        </Button>
      </div>

      <div className="flex-1 flex flex-col relative">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="flex justify-between items-center border-b border-gray-700 h-16 px-4">
            <TabsList className="bg-transparent items-stretch rounded-lg">
              <TabsTrigger value="chat" className="px-6 h-full text-gray-300 data-[state=active]:bg-gradient-to-r from-purple-500 to-blue-500 data-[state=active]:text-white rounded-lg">
                <div className="flex items-center overflow-hidden">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat
                </div>
              </TabsTrigger>
              <TabsTrigger value="image" className="px-6 h-full text-gray-300 data-[state=active]:bg-gradient-to-r from-purple-500 to-blue-500 data-[state=active]:text-white rounded-lg">
                <div className="flex items-center">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Image
                </div>
              </TabsTrigger>
              <TabsTrigger value="audio" className="px-6 h-full text-gray-300 data-[state=active]:bg-gradient-to-r from-purple-500 to-blue-500 data-[state=active]:text-white rounded-lg">
                <div className="flex items-center">
                  <Music className="mr-2 h-4 w-4" />
                  Audio
                </div>
              </TabsTrigger>
              <TabsTrigger value="video" className="px-6 h-full text-gray-300 data-[state=active]:bg-gradient-to-r from-purple-500 to-blue-500 data-[state=active]:text-white rounded-lg">
                <div className="flex items-center">
                  <Video className="mr-2 h-4 w-4" />
                  Video
                </div>
              </TabsTrigger>
            </TabsList>

            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-gray-300 hover:bg-gray-700"
              >
                <User className="w-5 h-5" />
                <span>{username || 'Utente'}</span>
              </Button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      role="menuitem"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <TabsContent value="chat" className="flex-1 relative">
            {chatMessages.length === 0 ? (
              <WelcomeSection
                title="AI Chat Pro"
                description="How can I assist you today?"
                useCases={[
                  {
                    icon: <Zap className="w-6 h-6 text-white" />,
                    title: "Quick Answers",
                    description: "Get instant responses to your questions on any topic.",
                  },
                  {
                    icon: <Sparkles className="w-6 h-6 text-white" />,
                    title: "Creative Writing",
                    description: "Generate ideas, outlines, and content for your writing projects."
                  },
                  {
                    icon: <MessageSquare className="w-6 h-6 text-white" />,
                    title: "Language Translation",
                    description: "Translate text between multiple languages with ease."
                  }
                ]}
                onUseCaseClick={handleUseCaseClick}
              />
            ) : (
              <ChatSection />
            )}
            <div className="absolute bottom-0 left-0 right-0 h-16 p-4 border-t border-gray-700 bg-gray-900">
              <form onSubmit={(e) => { 
                e.preventDefault(); 
                handleSendMessage(); 
              }} className="flex space-x-2">
                <Input 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message here..."
                  className="flex-grow bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                />
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </div>
          </TabsContent>
          <TabsContent value="image" className="flex-1 p-4 overflow-auto">
            <WelcomeSection
              title="Image Generation"
              description="What would you like to create today?"
              useCases={[
                {
                  icon: <Palette className="w-6 h-6 text-white" />,
                  title: "Digital Art",
                  description: "Create unique digital artwork based on your descriptions."
                },
                {
                  icon: <ImageIcon className="w-6 h-6 text-white" />,
                  title: "Photo Editing",
                  description: "Enhance and modify existing photos with AI-powered tools."
                },
                {
                  icon: <Sparkles className="w-6 h-6 text-white" />,
                  title: "Concept Visualization",
                  description: "Bring your ideas to life with AI-generated concept images."
                }
              ]}
              onUseCaseClick={handleUseCaseClick}
            />
          </TabsContent>
          <TabsContent value="audio" className="flex-1 p-4 overflow-auto">
            <WelcomeSection
              title="Audio Generation"
              description="What audio would you like to create or manipulate?"
              useCases={[
                {
                  icon: <SplitSquareVertical className="w-6 h-6 text-white" />,
                  title: "Audio Split",
                  description: "Split audio tracks into separate stems for vocals, instruments, and more."
                },
                {
                  icon: <MessageSquare className="w-6 h-6 text-white" />,
                  title: "Text-to-Speech",
                  description: "Convert written text into natural-sounding speech."
                },
                {
                  icon: <Zap className="w-6 h-6 text-white" />,
                  title: "Sound Effects",
                  description: "Generate custom sound effects for your projects."
                }
              ]}
              onUseCaseClick={handleUseCaseClick}
            />
          </TabsContent>
          <TabsContent value="video" className="flex-1 overflow-auto">
            <VideoGenerationSection />
          </TabsContent>
        </Tabs>
      </div>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Elimina Chat"
        message="Sei sicuro di voler eliminare questa chat? Questa azione non può essere annullata."
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false)
          setChatToDelete(null)
        }}
      />
    </div>
  )
}