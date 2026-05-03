"use client";

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState, FormEvent } from 'react';
import { MessageCircle, Send, Bot, MinusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { UIMessage } from 'ai';

// Safely extract text from a v5 UIMessage (parts-based)
function getTextContent(message: UIMessage): string {
  if (Array.isArray(message.parts)) {
    return message.parts
      .map((part) => (part.type === 'text' ? part.text : ''))
      .join('');
  }
  return '';
}

// Load persisted history from localStorage
function loadHistory(): UIMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('learnforge-chat-history');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // AI SDK v5: useChat uses sendMessage() — no input/handleSubmit returned
  const { messages, sendMessage, status } = useChat();

  const isLoading = status === 'streaming' || status === 'submitted';

  // Persist history on change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('learnforge-chat-history', JSON.stringify(messages));
      } catch {
        // localStorage quota exceeded — silently ignore
      }
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text || isLoading) return;
    sendMessage({ text });
    setInputValue('');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open LearnForge AI Chat"
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-primary text-primary-foreground shadow-2xl hover:scale-105 hover:shadow-primary/50 transition-all z-50 flex items-center justify-center ${
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        }`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[600px] max-h-[85vh] bg-background border border-border shadow-2xl rounded-2xl flex flex-col z-50 transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-muted/30 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">LearnForge AI</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
                Online
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            <MinusCircle className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto text-primary">
                <Bot className="w-8 h-8" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Welcome to LearnForge!</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-[250px] mx-auto">
                  I can help you find tutors, book sessions, and answer any questions.
                </p>
              </div>
            </div>
          )}

          {messages.map((m) => {
            const text = getTextContent(m);
            const html = text
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\n/g, '<br/>');
            return (
              <div
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm shadow-md shadow-primary/20'
                      : 'bg-muted text-foreground rounded-bl-sm border border-border/50'
                  }`}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            );
          })}

          {/* Typing indicator */}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground p-4 rounded-2xl rounded-bl-sm border border-border/50 flex items-center gap-1.5">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}ms` } as React.CSSProperties}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-background rounded-b-2xl">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              className="rounded-full bg-muted/50 border-border focus-visible:border-primary/50 focus-visible:ring-primary/20 h-11 px-4"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!inputValue.trim() || isLoading}
              className="h-11 w-11 rounded-full shrink-0 shadow-md"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </Button>
          </form>
          <div className="text-center mt-2">
            <p className="text-[10px] text-muted-foreground">
              AI can make mistakes. Verify important info.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
