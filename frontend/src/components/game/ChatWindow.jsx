import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

export default function ChatWindow({ messages, isTyping }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div 
      ref={scrollRef}
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        border: '1px solid var(--border)',
      }}
    >
      {messages.map((msg, idx) => (
        <MessageBubble key={idx} message={msg} />
      ))}
      
      {isTyping && (
        <div style={{ display: 'flex', gap: '4px', padding: '12px 16px', background: '#f0f2f5', borderRadius: '16px', width: 'fit-content' }}>
          <div className="typing-dot" style={{ width: 6, height: 6, background: '#94a3b8', borderRadius: '50%' }}></div>
          <div className="typing-dot" style={{ width: 6, height: 6, background: '#94a3b8', borderRadius: '50%', animationDelay: '0.2s' }}></div>
          <div className="typing-dot" style={{ width: 6, height: 6, background: '#94a3b8', borderRadius: '50%', animationDelay: '0.4s' }}></div>
        </div>
      )}

      <style>{`
        .typing-dot {
          animation: typing 1.4s infinite ease-in-out;
        }
        @keyframes typing {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
