'use client';

import { useState, useRef, useEffect } from 'react';
import { useChatbot, ChatHistoryItem } from '@/app/contexts/ChatbotContext';
import DesignForm from './DesignForm';

interface FormData {
  plot: {
    length: number;
    breadth: number;
    height: number;
    vastu: string;
  };
  designFor: string;
  interior: {
    designStyle: string;
    colorPreference: string;
    flooringType: string;
    ceilingDesign: string;
    lightingPreference: string;
  };
  budget: string;
  outputType: string[];
}

export default function AIDesigner() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true); // Form is default
  const [formSubmitted, setFormSubmitted] = useState(false);
  const {
    messages,
    setMessages,
    designerHistory,
    setDesignerHistory,
    currentChatId,
    setCurrentChatId
  } = useChatbot();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Check if opened from chatbot (has messages) or directly (no messages)
  useEffect(() => {
    // If opened from chatbot (has messages), show chat directly
    if (messages.length > 0) {
      // Opened from chatbot - show chat
      setShowForm(false);
    }
    // Otherwise, form is default (already set to true in initial state)
    // Sidebar always persists - don't change its state
  }, [messages.length]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Only scroll when new messages are added, not on every render
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages.length, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120); // Reduced max height
      textareaRef.current.style.height = newHeight + 'px';
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

      // Save to history
      if (currentChatId) {
        setDesignerHistory((prev: ChatHistoryItem[]) => prev.map((chat: ChatHistoryItem) =>
          chat.id === currentChatId
            ? { ...chat, messages: finalMessages, timestamp: Date.now() }
            : chat
        ));
      } else {
        const newChatId = Date.now().toString();
        const title = userMessage.content.slice(0, 30) + (userMessage.content.length > 30 ? '...' : '');
        setDesignerHistory((prev: ChatHistoryItem[]) => [...prev, { id: newChatId, title, messages: finalMessages, timestamp: Date.now() }]);
        setCurrentChatId(newChatId);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please make sure the backend server and Ollama are running."
      }]);
    } finally {
      setIsLoading(false);
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
    setShowForm(false); // Open chat interface
    setFormSubmitted(false);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const loadChat = (chatId: string) => {
    const chat = designerHistory.find((c: ChatHistoryItem) => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
      if (window.innerWidth < 768) setIsSidebarOpen(false);
    }
  };

  const deleteChat = (chatId: string) => {
    setDesignerHistory((prev: ChatHistoryItem[]) => prev.filter((chat: ChatHistoryItem) => chat.id !== chatId));
    if (currentChatId === chatId) {
      startNewChat();
    }
  };

  const handleFormSubmit = async (formData: FormData, prompt: string) => {
    setFormSubmitted(true);
    setShowForm(false);
    if (window.innerWidth < 768) setIsSidebarOpen(false);

    // Only send the prompt, exclude JSON
    const userMessage = { role: 'user' as const, content: prompt };
    setMessages([userMessage]);
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
          messages: [{ role: 'user', content: prompt }],
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

      // Use prompt-only message (not JSON) for final messages
      const promptOnlyMessage = { role: 'user' as const, content: prompt };
      const finalMessages = [promptOnlyMessage, assistantMessage];
      setMessages(finalMessages);

      // Save to history
      const newChatId = Date.now().toString();
      const title = `Design: ${formData.designFor} - ${formData.interior.designStyle}`;
      setDesignerHistory((prev: ChatHistoryItem[]) => [...prev, { id: newChatId, title, messages: finalMessages, timestamp: Date.now() }]);
      setCurrentChatId(newChatId);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please make sure the backend server and Ollama are running."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-white flex flex-col overflow-hidden">
      <div className="w-full flex-1 flex max-w-[1920px] mx-auto pt-24 md:pt-24 lg:pt-28 relative overflow-hidden">

        {/* Mobile Sidebar Backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar - History Panel - Overlay on mobile, persistent on desktop */}
        <div className={`
          ${isSidebarOpen ? 'translate-x-0 w-60' : '-translate-x-full w-0 md:w-0'} 
          fixed md:relative left-0 top-24 md:top-auto h-full md:h-auto 
          transition-all duration-300 ease-in-out overflow-hidden 
          border-r border-gray-200 bg-gray-50 flex flex-col z-40
        `}>
          <div className="flex items-center justify-between p-3 border-b border-gray-200 md:hidden">
            <span className="font-bold text-gray-800">History</span>
            <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-gray-200 rounded">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-3 border-b border-gray-200 space-y-2">
            <button
              onClick={startNewChat}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 text-sm font-semibold shadow-sm flex items-center gap-2 justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>
            <button
              onClick={() => {
                setShowForm(true);
                if (window.innerWidth < 768) setIsSidebarOpen(false);
              }}
              className="w-full px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 text-sm font-semibold flex items-center gap-2 justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Design Form
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-1">
              {designerHistory.map((chat: ChatHistoryItem) => (
                <div key={chat.id} className="group relative">
                  <button
                    onClick={() => loadChat(chat.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${currentChatId === chat.id
                      ? 'bg-gray-200 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <span className="truncate block">{chat.title}</span>
                  </button>
                  <button
                    onClick={() => deleteChat(chat.id)}
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
                    aria-label="Delete chat"
                  >
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Area */}
        <div className="flex-1 flex flex-col relative bg-white border-l border-gray-100 overflow-hidden">

          {/* Mobile Sidebar Toggle */}
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="absolute top-4 left-4 z-20 p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-gray-100 transition-colors shadow-sm"
              aria-label="Open sidebar"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {showForm ? (
            <div className="flex-1 overflow-y-auto bg-gray-50">
              <DesignForm onSubmit={handleFormSubmit} />
            </div>
          ) : (
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto px-4 md:px-8 py-8 relative scroll-smooth bg-white"
            >
              {/* Center Watermark */}
              {messages.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black italic bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent opacity-10 select-none text-center px-4" style={{
                    fontFamily: 'serif',
                    letterSpacing: '0.05em',
                    fontStyle: 'italic',
                    transform: 'rotate(-2deg)'
                  }}>
                    AI Designer
                  </h1>
                </div>
              )}

              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4 relative z-10">
                  <p className="text-2xl text-gray-300 font-medium max-w-lg mb-4">
                    Transform your vision into reality with AI Designer
                  </p>
                  <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-20"></div>
                </div>
              ) : (
                <div className="space-y-8 max-w-5xl mx-auto relative z-10">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {m.role === 'assistant' && (
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 overflow-hidden">
                          <img src="/ai.png" alt="AI" className="w-full h-full object-contain" />
                        </div>
                      )}
                      <div className={`
                        max-w-[90%] md:max-w-[80%] px-4 py-3 rounded-2xl shadow-sm border border-gray-100
                        ${m.role === 'user'
                          ? 'bg-gray-100 text-gray-900 ml-auto'
                          : 'bg-gray-50 text-gray-800'}
                      `}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {m.content}
                        </p>
                      </div>
                      {m.role === 'user' && (
                        <div className="w-8 h-8 bg-gray-200 rounded-lg hidden sm:flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-xs font-medium text-gray-600">You</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-4 justify-start">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 overflow-hidden">
                        <img src="/ai.png" alt="AI" className="w-full h-full object-contain" />
                      </div>
                      <div className="bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          )}

          {/* Input Area */}
          {!showForm && (
            <div className="border-t border-gray-100 bg-white px-4 md:px-12 py-4 md:py-6 flex-shrink-0 shadow-[0_-1px_3px_rgba(0,0,0,0.02)]">
              <div className="max-w-5xl mx-auto">
                <div className="relative flex items-end gap-2 p-2 bg-gray-50 border border-gray-200 rounded-xl focus-within:bg-white focus-within:border-cyan-500 focus-within:shadow-md transition-all">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      e.stopPropagation();
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    placeholder="Describe your design needs..."
                    className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none resize-none text-sm py-1"
                    style={{ maxHeight: '96px', minHeight: '24px' }}
                    rows={1}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className={`flex-shrink-0 p-2 rounded-lg transition-all ${input.trim() && !isLoading
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-md'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
