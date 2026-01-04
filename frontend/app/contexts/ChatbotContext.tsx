'use client';

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  isGeneratingImage?: boolean;
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  messages: Message[];
}

interface ChatbotContextType {
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  // Chat state
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  chatHistory: ChatHistoryItem[];
  setChatHistory: Dispatch<SetStateAction<ChatHistoryItem[]>>;
  currentChatId: string | null;
  setCurrentChatId: Dispatch<SetStateAction<string | null>>;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);
  const toggleChat = () => setIsChatOpen(prev => !prev);

  return (
    <ChatbotContext.Provider value={{ 
      isChatOpen, 
      openChat, 
      closeChat, 
      toggleChat,
      messages,
      setMessages,
      chatHistory,
      setChatHistory,
      currentChatId,
      setCurrentChatId
    }}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
}

