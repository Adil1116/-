import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AdPlaceholder from './components/AdPlaceholder';
import { useGeminiAPI } from './hooks/useGeminiAPI';
import './App.css';

interface Message {
  id: string;
  text: string;
  isAi: boolean;
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'مرحباً عادل! 👋 أنا الـ AI الخاص بك. اسألني أي شيء وسأساعدك! ',
      isAi: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const { sendMessage } = useGeminiAPI();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isAi: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const aiResponse = await sendMessage(input);
      if (aiResponse) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          isAi: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: language === 'ar' 
          ? 'عذراً، حدث خطأ. تأكد من API Key الخاص بك.'
          : 'Sorry, an error occurred. Please check your API Key.',
        isAi: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: '1',
        text: language === 'ar' 
          ? 'مرحباً! اسألني أي شيء وسأساعدك!'
          : 'Hello! Ask me anything and I will help!',
        isAi: true,
        timestamp: new Date(),
      },
    ]);
  };

  const translations = {
    ar: {
      title: 'Adil AI Chat',
      welcome: 'مرحباً بك في Adil AI',
      startChat: 'ابدأ محادثة جديدة واسأل أي شيء',
      placeholder: 'اكتب سؤالك هنا...',
      send: 'إرسال',
      newChat: 'محادثة جديدة',
      language: 'English',
    },
    en: {
      title: 'Adil AI Chat',
      welcome: 'Welcome to Adil AI',
      startChat: 'Start a new conversation and ask anything',
      placeholder: 'Type your question here...',
      send: 'Send',
      newChat: 'New Chat',
      language: 'العربية',
    },
  };

  const t = translations[language];

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}> 
      <Header
        title={t.title}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        language={language}
        onToggleLanguage={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="main-container">
        <Sidebar
          isOpen={sidebarOpen}
          onNewChat={handleNewChat}
          language={language}
        />

        <div className="chat-container">
          <div className="messages-area">
            {messages.length === 0 ? (
              <div className="welcome-section">
                <div className="welcome-emoji">🤖</div>
                <h2>{t.welcome}</h2>
                <p>{t.startChat}</p>
                <AdPlaceholder position="top" />
              </div>
            ) : (
              <div className="messages-list">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {loading && (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )} 
          </div>

          <div className="input-section">
            <AdPlaceholder position="bottom" />
            <ChatInput
              input={input}
              setInput={setInput}
              onSend={handleSend}
              isLoading={loading}
              placeholder={t.placeholder}
              sendButtonText={t.send}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;