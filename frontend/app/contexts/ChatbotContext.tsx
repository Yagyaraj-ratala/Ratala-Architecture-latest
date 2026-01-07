'use client';

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';

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
  timestamp?: number;
}

interface ChatbotContextType {
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  // Chat state
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;

  // Separate Histories
  chatbotHistory: ChatHistoryItem[];
  setChatbotHistory: Dispatch<SetStateAction<ChatHistoryItem[]>>;
  designerHistory: ChatHistoryItem[];
  setDesignerHistory: Dispatch<SetStateAction<ChatHistoryItem[]>>;

  currentChatId: string | null;
  setCurrentChatId: Dispatch<SetStateAction<string | null>>;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // Separate histories
  const [chatbotHistory, setChatbotHistory] = useState<ChatHistoryItem[]>([]);
  const [designerHistory, setDesignerHistory] = useState<ChatHistoryItem[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedChatbotHistory = localStorage.getItem('ratala_chatbot_history');
    const savedDesignerHistory = localStorage.getItem('ratala_designer_history');

    if (savedChatbotHistory) {
      try {
        setChatbotHistory(JSON.parse(savedChatbotHistory));
      } catch (e) {
        console.error("Failed to parse chatbot history", e);
      }
    }

    if (savedDesignerHistory) {
      try {
        setDesignerHistory(JSON.parse(savedDesignerHistory));
      } catch (e) {
        console.error("Failed to parse designer history", e);
      }
    }
  }, []);

  // Save chatbot history to localStorage
  useEffect(() => {
    if (chatbotHistory.length > 0) {
      localStorage.setItem('ratala_chatbot_history', JSON.stringify(chatbotHistory));
    }
  }, [chatbotHistory]);

  // Save designer history to localStorage
  useEffect(() => {
    if (designerHistory.length > 0) {
      localStorage.setItem('ratala_designer_history', JSON.stringify(designerHistory));
    }
  }, [designerHistory]);

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
      chatbotHistory,
      setChatbotHistory,
      designerHistory,
      setDesignerHistory,
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

