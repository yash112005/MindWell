import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Brain, X, Send, User, Maximize2 } from 'lucide-react';
import axios from 'axios';

const FloatingChat = () => {
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  
  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Initial Auto-Greeting
  useEffect(() => {
    if (user && !hasGreeted) {
      const timer = setTimeout(() => {
        setHasGreeted(true);
        setIsOpen(true);
        
        // Typewriter effect for greeting
        const greeting = `Hi there 👋 I'm MindWell, your personal mental wellness companion. How are you feeling today, ${user.name?.split(' ')[0] || 'friend'}?`;
        let i = 0;
        setMessages([{ role: 'ai', content: '', isTyping: true }]);
        
        const typeInterval = setInterval(() => {
          if (i < greeting.length) {
            setMessages((prev) => [
              { role: 'ai', content: greeting.substring(0, i + 1), isTyping: true }
            ]);
            i++;
          } else {
            clearInterval(typeInterval);
            setMessages((prev) => [
              { role: 'ai', content: greeting, isTyping: false }
            ]);
          }
        }, 30); // typing speed
        
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [user, hasGreeted]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMsg = inputMessage;
    setInputMessage('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.post('http://localhost:5000/api/chat', { message: userMsg }, config);
      
      // The API returns the full chat object with a messages array
      const chatMessages = res.data.messages || [];
      const lastAiMsg = [...chatMessages].reverse().find(m => m.sender === 'ai');
      const aiReply = lastAiMsg?.content || "I'm here for you, but I couldn't process that. Please try again.";
      
      setMessages((prev) => [...prev, { role: 'ai', content: aiReply }]);
      
      if (!isOpen) {
        setHasUnread(true);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev, 
        { role: 'ai', content: 'Sorry, I am having trouble connecting right now. Please try again later.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      
      {/* Chat Window */}
      <div 
        className={`bg-white dark:bg-dark-surface w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-500 origin-bottom-right mb-4 ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'
        }`}
        style={{ height: '500px', maxHeight: 'calc(100vh - 120px)' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">MindWell AI</h3>
              <p className="text-[10px] text-white/80">Always here to listen</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => navigate('/chat')}
              className="text-white/80 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
              title="Open full screen chat"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button 
              onClick={toggleChat}
              className="text-white/80 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-dark-bg/50 custom-scrollbar flex flex-col gap-4" style={{ height: 'calc(100% - 130px)' }}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className="flex-shrink-0 mt-auto">
                {msg.role === 'ai' ? (
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600">
                    <Brain className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-primary-600 text-white rounded-br-sm' 
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-sm'
              }`}>
                {msg.content}
                {msg.isTyping && <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-primary-400 animate-pulse"></span>}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%]">
               <div className="flex-shrink-0 mt-auto">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600">
                    <Brain className="w-4 h-4" />
                  </div>
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-bl-sm">
                <div className="flex space-x-1 items-center h-5">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white dark:bg-dark-surface border-t border-gray-100 dark:border-gray-800">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-100 dark:bg-gray-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 dark:text-white transition-all"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={!inputMessage.trim() || isLoading}
              className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl p-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className={`relative w-14 h-14 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 z-50 ${
          !isOpen && 'animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Brain className="w-6 h-6" />
        )}
        
        {/* Notification Dot */}
        {!isOpen && hasUnread && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white dark:border-dark-bg rounded-full"></span>
        )}
      </button>

    </div>
  );
};

export default FloatingChat;
