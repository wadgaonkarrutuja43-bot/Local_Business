import React, { useState, useRef, useEffect } from 'react';

export default function AiAssistant({ currentUser, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Namaste ${currentUser?.firstName || 'there'}! I'm Aria, your StyleHub AI Personal Stylist. How can I help you choose the perfect outfit or answer your questions today?`
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    '✨ Recommend a Wedding Lehenga',
    '🚚 How many days for delivery?',
    '🔄 What is the return policy?',
    '💎 Best jewellery for sarees'
  ];

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: messages
        })
      });

      const data = await response.json();

      if (data.success && data.reply) {
        setMessages(prev => [
          ...prev,
          { id: Date.now() + 1, sender: 'ai', text: data.reply }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          { id: Date.now() + 1, sender: 'ai', text: 'I encountered an issue connecting to the styling server. Please ask again.' }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: 'I am temporarily offline. Please reach out to customer care at +91 9284899881.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating AI Launcher Button */}
      <div className="ai-launcher-wrapper">
        {!isOpen && (
          <button 
            type="button" 
            className="btn-ai-floating shadow-lg"
            onClick={() => setIsOpen(true)}
            title="Ask StyleHub AI Stylist"
          >
            <div className="d-flex align-items-center gap-2">
              <span className="ai-sparkle-icon">✨</span>
              <span className="d-none d-md-inline fw-bold">Ask AI Stylist</span>
            </div>
          </button>
        )}
      </div>

      {/* Floating Chat Box Window */}
      {isOpen && (
        <div className="ai-chatbox-card shadow-2xl border rounded-3 bg-white">
          
          {/* Header */}
          <div className="p-3 bg-maroon text-white d-flex justify-content-between align-items-center rounded-top-3">
            <div className="d-flex align-items-center gap-2">
              <div className="ai-avatar-badge">✨</div>
              <div>
                <h6 className="m-0 fw-bold">Aria — AI Stylist</h6>
                <small className="text-warning-subtle" style={{ fontSize: '11px' }}>Online • StyleHub Assistant</small>
              </div>
            </div>
            <button 
              type="button" 
              className="btn-close-white" 
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="ai-chat-body p-3">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="ai-avatar-mini me-2">✨</div>
                )}
                <div 
                  className={`chat-bubble p-3 rounded-3 small ${
                    msg.sender === 'user' ? 'user-bubble' : 'ai-bubble shadow-2xs'
                  }`}
                  style={{ maxWidth: '82%', whiteSpace: 'pre-line' }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="d-flex align-items-center gap-2 text-muted small ps-2 my-2">
                <span className="spinner-grow spinner-grow-sm text-danger" role="status"></span>
                <span>Aria is styling your response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Strip */}
          <div className="p-2 border-top bg-light d-flex gap-1 overflow-x-auto">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                className="btn btn-outline-dark btn-xs text-nowrap rounded-pill bg-white"
                style={{ fontSize: '11px' }}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} 
            className="p-2 border-top bg-white d-flex gap-2 align-items-center rounded-bottom-3"
          >
            <input 
              type="text" 
              className="form-control form-control-sm rounded-pill px-3" 
              placeholder="Ask about dresses, sizing, pairing..." 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="btn btn-maroon btn-sm rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '36px', height: '36px' }}
              disabled={isLoading || !inputMessage.trim()}
            >
              ➔
            </button>
          </form>

        </div>
      )}

      <style>{`
        .ai-launcher-wrapper {
          position: fixed;
          bottom: 25px;
          right: 25px;
          z-index: 2100;
        }

        .btn-ai-floating {
          background: linear-gradient(135deg, #660018 0%, #8b1832 100%);
          color: #ffffff;
          border: 2px solid #ffd700;
          border-radius: 50px;
          padding: 12px 22px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          font-size: 14px;
        }

        .btn-ai-floating:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(102, 0, 24, 0.45) !important;
        }

        .ai-chatbox-card {
          position: fixed;
          bottom: 25px;
          right: 25px;
          width: 370px;
          max-width: calc(100vw - 40px);
          height: 520px;
          z-index: 2200;
          display: flex;
          flex-direction: column;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.22);
          animation: slideUpAi 0.25s ease-out;
        }

        @keyframes slideUpAi {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ai-chat-body {
          flex: 1;
          overflow-y: auto;
          background: #fdfaf7;
        }

        .bg-maroon {
          background-color: #660018 !important;
        }

        .btn-maroon {
          background-color: #660018 !important;
          color: #ffffff !important;
          border: none;
        }

        .user-bubble {
          background-color: #660018;
          color: #ffffff;
          border-bottom-right-radius: 2px !important;
        }

        .ai-bubble {
          background-color: #ffffff;
          color: #2b2b2b;
          border: 1px solid #e9ecef;
          border-bottom-left-radius: 2px !important;
        }

        .ai-avatar-badge {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .ai-avatar-mini {
          width: 24px;
          height: 24px;
          background: #660018;
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          flex-shrink: 0;
        }

        .btn-close-white {
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 16px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}