'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChatbot, ChatHistoryItem } from '@/app/contexts/ChatbotContext';

export default function HomeAI() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    isChatOpen,
    closeChat,
    messages,
    setMessages,
    chatbotHistory,
    setChatbotHistory,
    currentChatId,
    setCurrentChatId
  } = useChatbot();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    const chatId = currentChatId || Date.now().toString();
    if (!currentChatId) setCurrentChatId(chatId);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          model: "qwen2.5-coder:0.5b",
          conversation_id: chatId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      const assistantMessage: { role: 'assistant', content: string } = {
        role: 'assistant' as const,
        content: data.content
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      saveToHistory(finalMessages, userMessage);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please make sure the backend server is running."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to save chat to history
  const saveToHistory = (finalMessages: any[], userMessage: { role: 'user'; content: string }) => {
    if (currentChatId) {
      setChatbotHistory((prev: ChatHistoryItem[]) => prev.map((chat: ChatHistoryItem) =>
        chat.id === currentChatId
          ? { ...chat, messages: finalMessages, timestamp: Date.now() }
          : chat
      ));
    } else {
      const newChatId = Date.now().toString();
      const title = userMessage.content.slice(0, 30) + (userMessage.content.length > 30 ? '...' : '');
      setChatbotHistory((prev: ChatHistoryItem[]) => [...prev, {
        id: newChatId,
        title,
        messages: finalMessages,
        timestamp: Date.now()
      }]);
      setCurrentChatId(newChatId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setIsSidebarOpen(false);
  };

  const loadChat = (chatId: string) => {
    const chat = chatbotHistory.find((c: ChatHistoryItem) => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
      setIsSidebarOpen(false);
    }
  };

  const deleteChat = (chatId: string) => {
    setChatbotHistory((prev: ChatHistoryItem[]) => prev.filter((chat: ChatHistoryItem) => chat.id !== chatId));
    if (currentChatId === chatId) {
      startNewChat();
    }
  };

  if (!isChatOpen) return null;

  return (
    <>
      {/* Backdrop with 70% opacity */}
      <div
        className="fixed inset-0 bg-black/70 z-40"
        onClick={closeChat}
      />

      {/* Chat Interface - Floating widget in bottom-right corner */}
      <div className="fixed bottom-0 right-0 z-50 flex w-full h-screen sm:h-[65vh] sm:w-[90%] md:w-[50%] lg:w-[32.5%] sm:rounded-tl-2xl overflow-hidden" style={{
        maxWidth: '550px'
      }}>
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} absolute left-0 top-0 h-full w-full sm:w-64 bg-gradient-to-br from-cyan-50 to-blue-50 border-r border-cyan-200 transition-transform duration-300 z-50 flex flex-col shadow-lg`}>
          <div className="p-3 sm:p-4 border-b border-cyan-200">
            <button
              onClick={startNewChat}
              className="w-full px-4 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 active:from-cyan-700 active:to-blue-800 transition-all duration-300 text-sm font-semibold shadow-md touch-manipulation"
            >
              + New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            <h3 className="text-xs font-medium text-cyan-600 uppercase mb-2 sm:mb-3">Chat History</h3>
            <div className="space-y-2">
              {chatbotHistory.map((chat: ChatHistoryItem) => (
                <div key={chat.id} className="group relative">
                  <button
                    onClick={() => loadChat(chat.id)}
                    className={`w-full text-left px-3 py-2.5 sm:py-2 rounded-lg text-sm transition-colors touch-manipulation ${currentChatId === chat.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-white hover:text-cyan-600 active:bg-cyan-50'
                      }`}
                  >
                    {chat.title}
                  </button>
                  <button
                    onClick={() => deleteChat(chat.id)}
                    className="absolute right-2 top-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 sm:p-1 hover:bg-cyan-100 active:bg-cyan-200 rounded transition-opacity touch-manipulation"
                    aria-label="Delete chat"
                  >
                    <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex flex-col w-full bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-cyan-200 bg-gradient-to-r from-cyan-500 to-blue-600">
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Burger Menu */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSidebarOpen(prev => !prev);
                }}
                className="p-2 hover:bg-white/20 active:bg-white/30 rounded-lg transition-colors touch-manipulation"
                type="button"
                aria-label="Toggle chat history"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h2 className="text-base sm:text-lg font-semibold text-white">Ratala AI</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push('/ai-designer');
                  closeChat();
                }}
                className="p-2 hover:bg-white/20 active:bg-white/30 rounded-lg transition-colors touch-manipulation"
                aria-label="Open AI Designer"
                title="Open AI Designer"
              >
                <p className='text-white text-sm font-semibold italic'>AIDesigner</p>
              </button>
              <button
                onClick={closeChat}
                className="p-2 hover:bg-white/20 active:bg-white/30 rounded-lg transition-colors touch-manipulation"
                aria-label="Close chat"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-8 bg-gradient-to-b from-white to-cyan-50/30">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
                  <span className="text-2xl sm:text-3xl">💬</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2 sm:mb-3">
                  How can I help you today?
                </h3>
                <p className="text-sm sm:text-base text-gray-500 font-light max-w-md">
                  Ask me anything about Ratala Architecture and Interiors
                </p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {messages.map((m, i) => (
                  <div key={i} className={`flex gap-2 sm:gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.role === 'assistant' && (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 overflow-hidden">
                        <img src="/ai.png" alt="AI" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div className={`max-w-[85%] sm:max-w-[75%] ${m.role === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                      : 'bg-gradient-to-br from-cyan-50 to-blue-50 text-gray-800 border border-cyan-200'
                      } px-3 py-2 sm:px-5 sm:py-3 rounded-2xl`}>
                      <p className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap font-light">
                        {m.content}
                      </p>
                    </div>
                    {m.role === 'user' && (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 border border-cyan-200">
                        <span className="text-[10px] sm:text-xs font-medium text-cyan-600">You</span>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-2 sm:gap-4 justify-start">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 overflow-hidden">
                      <img src="/ai.png" alt="AI" className="w-full h-full object-contain" />
                    </div>
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 px-3 py-2 sm:px-5 sm:py-3 rounded-2xl border border-cyan-200">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                        <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-cyan-200 px-3 sm:px-6 py-3 sm:py-4 bg-white">
            <div className="w-full">
              <div className="relative flex items-end gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl sm:rounded-2xl border border-cyan-200 focus-within:border-cyan-400 focus-within:shadow-md transition-all">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  placeholder="Message Ratala AI..."
                  className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none resize-none font-light text-sm sm:text-[15px]"
                  style={{ maxHeight: '120px', minHeight: '24px' }}
                  rows={1}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`flex-shrink-0 p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all touch-manipulation ${input.trim() && !isLoading
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 active:from-cyan-700 active:to-blue-800 shadow-md'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  aria-label="Send message"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              <p className="text-[10px] sm:text-xs text-cyan-600 text-center mt-2 sm:mt-3 font-light">
                Powered by Ratala Architecture and Interiors
              </p>
            </div>
          </div>
        </div>

        {/* Overlay for sidebar */}
        {isSidebarOpen && (
          <div
            className="absolute inset-0 bg-black/20 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </>
  );
}