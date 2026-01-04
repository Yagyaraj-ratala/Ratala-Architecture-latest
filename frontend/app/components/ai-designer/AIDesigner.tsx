'use client';

import { useState, useRef, useEffect } from 'react';
import { useChatbot } from '@/app/contexts/ChatbotContext';
import DesignForm from './DesignForm';

interface FormData {
  plot: {
    length: number;
    breadth: number;
    height: number;
    facing: string;
    vastu: string;
  };
  designFor: string;
  roomPlacement: {
    kitchenLocation: string;
    masterBedroomLocation: string;
    toiletDirection: string;
  };
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
  const [generatingImage, setGeneratingImage] = useState(false);
  const [showForm, setShowForm] = useState(true); // Form is default
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { 
    messages, 
    setMessages, 
    chatHistory, 
    setChatHistory, 
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

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          model: "qwen2.5-coder:0.5b"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      const assistantMessage: { role: 'assistant', content: string, imageUrl?: string, isGeneratingImage?: boolean } = { 
        role: 'assistant' as const, 
        content: data.content 
      };
      
      // Check if image generation is needed
      if (data.should_generate_image) {
        assistantMessage.isGeneratingImage = true;
        const finalMessages = [...updatedMessages, assistantMessage];
        setMessages(finalMessages);
        
        // Generate image using Evolink Z Image Turbo
        setGeneratingImage(true);
        try {
          const imageResponse = await fetch('http://localhost:8000/api/generate-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt: data.content, // Use the Ollama-generated prompt for better image generation
              size: "1:1" // Default aspect ratio
            }),
          });

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            
            // If task is completed immediately, use the image URL
            if (imageData.success && imageData.image_url) {
              assistantMessage.imageUrl = imageData.image_url;
              assistantMessage.isGeneratingImage = false;
              const finalMessagesWithImage = [...updatedMessages, assistantMessage];
              setMessages(finalMessagesWithImage);
              
              // Update history with image
              if (currentChatId) {
                setChatHistory(prev => prev.map(chat => 
                  chat.id === currentChatId 
                    ? { ...chat, messages: finalMessagesWithImage }
                    : chat
                ));
              } else {
                const newChatId = Date.now().toString();
                const title = userMessage.content.slice(0, 30) + (userMessage.content.length > 30 ? '...' : '');
                setChatHistory(prev => [...prev, { id: newChatId, title, messages: finalMessagesWithImage }]);
                setCurrentChatId(newChatId);
              }
            } else if (imageData.task_id) {
              // Poll task status until completed
              const pollTaskStatus = async (taskId: string) => {
                const maxAttempts = 60;
                let attempts = 0;
                
                while (attempts < maxAttempts) {
                  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
                  
                  try {
                    const statusResponse = await fetch(`http://localhost:8000/api/task-status/${taskId}`);
                    if (statusResponse.ok) {
                      const statusData = await statusResponse.json();
                      
                      if (statusData.status === "completed" && statusData.result?.image_url) {
                        assistantMessage.imageUrl = statusData.result.image_url;
                        assistantMessage.isGeneratingImage = false;
                        const finalMessagesWithImage = [...updatedMessages, assistantMessage];
                        setMessages(finalMessagesWithImage);
                        
                        // Update history with image
                        if (currentChatId) {
                          setChatHistory(prev => prev.map(chat => 
                            chat.id === currentChatId 
                              ? { ...chat, messages: finalMessagesWithImage }
                              : chat
                          ));
                        } else {
                          const newChatId = Date.now().toString();
                          const title = userMessage.content.slice(0, 30) + (userMessage.content.length > 30 ? '...' : '');
                          setChatHistory(prev => [...prev, { id: newChatId, title, messages: finalMessagesWithImage }]);
                          setCurrentChatId(newChatId);
                        }
                        return;
                      } else if (statusData.status === "failed") {
                        throw new Error(statusData.error?.message || "Image generation failed");
                      }
                      // Continue polling if status is "pending" or "processing"
                    }
                  } catch (pollError) {
                    console.error('Polling error:', pollError);
                  }
                  
                  attempts++;
                }
                
                // Timeout
                assistantMessage.isGeneratingImage = false;
                assistantMessage.content += "\n\n[Image generation timed out. Please try again.]";
                const finalMessages = [...updatedMessages, assistantMessage];
                setMessages(finalMessages);
              };
              
              await pollTaskStatus(imageData.task_id);
            } else {
              throw new Error("No task ID or image URL returned");
            }
          } else {
            const errorData = await imageResponse.json().catch(() => ({ detail: "Unknown error" }));
            throw new Error(errorData.detail || "Image generation failed");
          }
        } catch (imageError) {
          console.error('Image generation error:', imageError);
          assistantMessage.isGeneratingImage = false;
          assistantMessage.content += `\n\n[Image generation failed: ${imageError instanceof Error ? imageError.message : 'Please try again.'}]`;
          const finalMessages = [...updatedMessages, assistantMessage];
          setMessages(finalMessages);
        } finally {
          setGeneratingImage(false);
        }
      } else {
        const finalMessages = [...updatedMessages, assistantMessage];
        setMessages(finalMessages);
        
        // Save to history
        if (currentChatId) {
          setChatHistory(prev => prev.map(chat => 
            chat.id === currentChatId 
              ? { ...chat, messages: finalMessages }
              : chat
          ));
        } else {
          const newChatId = Date.now().toString();
          const title = userMessage.content.slice(0, 30) + (userMessage.content.length > 30 ? '...' : '');
          setChatHistory(prev => [...prev, { id: newChatId, title, messages: finalMessages }]);
          setCurrentChatId(newChatId);
        }
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
    // Sidebar persists - don't change its state
  };

  const loadChat = (chatId: string) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
    }
  };

  const deleteChat = (chatId: string) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      startNewChat();
    }
  };

  const handleFormSubmit = async (formData: FormData, prompt: string) => {
    setFormSubmitted(true);
    setShowForm(false);
    // Sidebar persists - no need to change its state
    
    // Only send the prompt, exclude JSON
    const userMessage = { role: 'user' as const, content: prompt };
    setMessages([userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          model: "qwen2.5-coder:0.5b"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      const assistantMessage: { role: 'assistant', content: string, imageUrl?: string, isGeneratingImage?: boolean } = { 
        role: 'assistant' as const, 
        content: data.content 
      };
      
      // Use prompt-only message (not JSON) for final messages
      const promptOnlyMessage = { role: 'user' as const, content: prompt };
      
      // Check if image generation is needed
      if (data.should_generate_image) {
        assistantMessage.isGeneratingImage = true;
        const finalMessages = [promptOnlyMessage, assistantMessage];
        setMessages(finalMessages);
        
        // Generate image using Evolink Z Image Turbo
        setGeneratingImage(true);
        try {
          const imageResponse = await fetch('http://localhost:8000/api/generate-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt: prompt, // Use the generated prompt from form or Ollama
              size: "1:1" // Default aspect ratio
            }),
          });

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            
            // If task is completed immediately, use the image URL
            if (imageData.success && imageData.image_url) {
              assistantMessage.imageUrl = imageData.image_url;
              assistantMessage.isGeneratingImage = false;
              const finalMessagesWithImage = [promptOnlyMessage, assistantMessage];
              setMessages(finalMessagesWithImage);
              
              // Save to history with image
              const newChatId = Date.now().toString();
              const title = `Design: ${formData.designFor} - ${formData.interior.designStyle}`;
              setChatHistory(prev => [...prev, { id: newChatId, title, messages: finalMessagesWithImage }]);
              setCurrentChatId(newChatId);
            } else if (imageData.task_id) {
              // Poll task status until completed
              const pollTaskStatus = async (taskId: string) => {
                const maxAttempts = 60;
                let attempts = 0;
                
                while (attempts < maxAttempts) {
                  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
                  
                  try {
                    const statusResponse = await fetch(`http://localhost:8000/api/task-status/${taskId}`);
                    if (statusResponse.ok) {
                      const statusData = await statusResponse.json();
                      
                      if (statusData.status === "completed" && statusData.result?.image_url) {
                        assistantMessage.imageUrl = statusData.result.image_url;
                        assistantMessage.isGeneratingImage = false;
                        const finalMessagesWithImage = [promptOnlyMessage, assistantMessage];
                        setMessages(finalMessagesWithImage);
                        
                        // Save to history with image
                        const newChatId = Date.now().toString();
                        const title = `Design: ${formData.designFor} - ${formData.interior.designStyle}`;
                        setChatHistory(prev => [...prev, { id: newChatId, title, messages: finalMessagesWithImage }]);
                        setCurrentChatId(newChatId);
                        return;
                      } else if (statusData.status === "failed") {
                        throw new Error(statusData.error?.message || "Image generation failed");
                      }
                      // Continue polling if status is "pending" or "processing"
                    }
                  } catch (pollError) {
                    console.error('Polling error:', pollError);
                  }
                  
                  attempts++;
                }
                
                // Timeout
                assistantMessage.isGeneratingImage = false;
                assistantMessage.content += "\n\n[Image generation timed out. Please try again.]";
                const finalMessages = [promptOnlyMessage, assistantMessage];
                setMessages(finalMessages);
              };
              
              await pollTaskStatus(imageData.task_id);
            } else {
              throw new Error("No task ID or image URL returned");
            }
          } else {
            const errorData = await imageResponse.json().catch(() => ({ detail: "Unknown error" }));
            throw new Error(errorData.detail || "Image generation failed");
          }
        } catch (imageError) {
          console.error('Image generation error:', imageError);
          assistantMessage.isGeneratingImage = false;
          assistantMessage.content += `\n\n[Image generation failed: ${imageError instanceof Error ? imageError.message : 'Please try again.'}]`;
          const finalMessages = [promptOnlyMessage, assistantMessage];
          setMessages(finalMessages);
        } finally {
          setGeneratingImage(false);
        }
      } else {
        const finalMessages = [promptOnlyMessage, assistantMessage];
        setMessages(finalMessages);
        
        // Save to history
        const newChatId = Date.now().toString();
        const title = `Design: ${formData.designFor} - ${formData.interior.designStyle}`;
        setChatHistory(prev => [...prev, { id: newChatId, title, messages: finalMessages }]);
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

  return (
    <div className="w-full h-full bg-white flex" style={{ 
      paddingTop: '0px',
      paddingBottom: '0px',
      marginTop: '0px',
      marginBottom: '0px'
    }}>
      <div className="w-full h-full flex max-w-[1800px] mx-auto pt-24 md:pt-32 lg:pt-36">
        {/* Sidebar - History Panel - Always visible */}
        <div className={`${
          isSidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 ease-in-out overflow-hidden border-r border-gray-200 bg-gray-50 flex flex-col`}>
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
                // Sidebar persists - don't change its state
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
              {chatHistory.map((chat) => (
                <div key={chat.id} className="group relative">
                  <button
                    onClick={() => loadChat(chat.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      currentChatId === chat.id 
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

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col relative bg-white">
          {/* Hamburger Menu Button - Always visible */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute top-4 left-4 z-20 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Show Form or Messages Area */}
          {showForm ? (
            <div className="flex-1 overflow-y-auto bg-gray-50">
              <DesignForm onSubmit={handleFormSubmit} />
            </div>
          ) : (
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 relative" 
              style={{ 
                scrollBehavior: 'smooth',
                overscrollBehavior: 'contain',
                willChange: 'scroll-position'
              }}
            >
            {/* Center Watermark */}
            {messages.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <h1 className="text-6xl sm:text-8xl md:text-9xl font-black italic bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent opacity-10 select-none" style={{
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
              <div className="flex flex-col items-center justify-end h-full text-center px-4 relative z-10">
                <p className="text-xl text-gray-300 font-semibold max-w-md ">
                  Design with AI Designer
                </p>
              </div>
            ) : (
              <div className="space-y-6 max-w-3xl mx-auto relative z-10">
                {messages.map((m, i) => (
                  <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.role === 'assistant' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs font-medium">AI</span>
                      </div>
                    )}
                    <div className={`max-w-[80%] ${
                      m.role === 'user' 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'bg-gray-50 text-gray-800'
                    } px-4 py-3 rounded-2xl`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {m.content}
                      </p>
                      {/* Image Generation Area */}
                      {m.isGeneratingImage && (
                        <div className="mt-4 relative w-full min-h-[400px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-600 mx-auto mb-4"></div>
                              <p className="text-gray-700 font-semibold text-xl">Generating the image</p>
                            </div>
                          </div>
                          {/* Watermark */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                            <p className="text-8xl font-black italic text-gray-400 transform -rotate-12">Generating the image</p>
                          </div>
                        </div>
                      )}
                      {/* Generated Image */}
                      {m.imageUrl && !m.isGeneratingImage && (
                        <div className="mt-4 w-full">
                          <img 
                            src={m.imageUrl} 
                            alt="Generated design" 
                            className="w-full rounded-xl shadow-lg"
                            onError={(e) => {
                              console.error('Image load error');
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                    {m.role === 'user' && (
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-medium text-gray-600">You</span>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-4 justify-start">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs font-medium">AI</span>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 rounded-2xl">
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

          {/* Input Area - Fixed at Bottom - Hide when form is shown */}
          {!showForm && (
            <div className="border-t border-gray-200 bg-white px-4 sm:px-6 py-3 flex-shrink-0">
            <div className="max-w-3xl mx-auto">
              <div className="relative flex items-end gap-2 p-2 bg-white border border-gray-300 rounded-xl focus-within:border-cyan-500 focus-within:shadow-md transition-all">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    // Prevent scroll when typing
                    e.stopPropagation();
                  }}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  placeholder="Message AI Designer..."
                  className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none resize-none text-xs sm:text-sm"
                  style={{ maxHeight: '96px', minHeight: '20px' }}
                  rows={1}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`flex-shrink-0 p-1.5 rounded-lg transition-all ${
                    input.trim() && !isLoading 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  aria-label="Send message"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
