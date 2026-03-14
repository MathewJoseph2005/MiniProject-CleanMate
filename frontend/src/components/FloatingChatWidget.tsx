import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { io, Socket } from 'socket.io-client';
import { X, MessageSquare, Send, Paperclip, Smile, Loader2, Minimize2, Bot, Check, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  _id: string;
  text: string;
  isAiMessage: boolean;
  status: 'sent' | 'read';
  createdAt: string;
  senderId?: {
    _id: string;
    fullName: string;
    avatar?: string;
  };
}

export function FloatingChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const token = localStorage.getItem('cleanmate_token');
  const userId = user?.id || (user as any)?._id;
  const aiRoomId = userId ? `ai_${userId}` : '';

  useEffect(() => {
    if (!isOpen || !user || !token || !aiRoomId) return;

    const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log(`🔌 AI Socket connected! Joining room: ${aiRoomId}`);
      newSocket.emit('join_room', aiRoomId);
    });

    newSocket.on('chat_history', (history: Message[]) => {
      setMessages(history);
      scrollToBottom();
    });

    newSocket.on('new_message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
      if (msg.isAiMessage) setIsTyping(false);
      scrollToBottom();
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isOpen, user, token, aiRoomId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || !socket) return;

    socket.emit('send_message', {
      roomId: aiRoomId,
      text: inputValue,
    });

    setInputValue('');
    setIsTyping(true);
    scrollToBottom();
  };

  if (!user) return null;  if (!isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        className="fixed bottom-6 right-6 h-16 w-16 bg-[#1a2e1a] text-white rounded-full shadow-[0_8px_30px_-4px_rgba(26,46,26,0.4)] hover:shadow-[0_12px_40px_-4px_rgba(26,46,26,0.6)] transition-all flex items-center justify-center hover:scale-105 z-50 ring-4 ring-[#97BC62]/20 group"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#1a2e1a] to-[#2C5F2D] opacity-100 group-hover:opacity-90 transition-opacity"></div>
        <MessageSquare className="h-6 w-6 relative z-10" />
        <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#97BC62] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-[#97BC62] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#1a2e1a]">1</span>
        </span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-[380px] bg-white shadow-2xl rounded-[2.5rem] overflow-hidden transition-all duration-300 z-50 flex flex-col font-sans ${isMinimized ? 'h-[80px]' : 'h-[620px] max-h-[85vh]'} border border-slate-100`}>
      {/* Header - CleanMate Theme */}
      <div className="bg-[#1a2e1a] p-5 flex items-center justify-between shrink-0 relative overflow-hidden rounded-t-[2.5rem] shadow-lg z-20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#97BC62]/10 rounded-bl-full pointer-events-none" />
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="h-12 w-12 rounded-2xl border border-white/20 shadow-xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
            <Bot className="h-7 w-7 text-[#97BC62]" />
          </div>
          <div className="flex flex-col">
            <p className="font-black text-base leading-tight text-white tracking-tight">CleanMate AI</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#97BC62] shadow-[0_0_8px_rgba(151,188,98,0.8)] animate-pulse"></span>
              <span className="text-[10px] text-white/60 font-black uppercase tracking-widest">Active Assistant</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-2.5 text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all" title="Minimize">
            <Minimize2 className="h-4 w-4" />
          </button>
          <button onClick={() => setIsOpen(false)} className="p-2.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all" title="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat Area - Clean Background */}
          <div className="flex-1 bg-slate-50/50 p-6 overflow-y-auto overflow-x-hidden no-scrollbar relative" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-5 px-4">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl border border-slate-50 group hover:-rotate-6 transition-transform">
                  <Bot className="h-12 w-12 text-[#1a2e1a]" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-black text-[#1a2e1a] tracking-tight">
                    How can we help?
                    </h3>
                    <p className="text-[13px] text-[#1a2e1a]/40 font-bold uppercase tracking-wide leading-relaxed">
                    Ask us anything about our cleaning services or track your bookings.
                    </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Simulated timestamp */}
                <div className="flex justify-center my-2">
                  <span className="text-[9px] font-black bg-[#1a2e1a]/5 text-[#1a2e1a]/40 px-4 py-1.5 rounded-full tracking-[0.2em] uppercase">Today's Conversation</span>
                </div>
                
                {messages.map((msg, i) => {
                  const isMe = msg.senderId?._id === userId || (!msg.isAiMessage && !msg.senderId);
                  return (
                    <div key={msg._id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group animate-in slide-in-from-bottom-3 duration-500`}>
                      <div className={`max-w-[85%] px-5 py-4 text-sm shadow-xl relative leading-relaxed tracking-wide font-bold ${
                        isMe 
                          ? 'bg-[#1a2e1a] text-white rounded-[2rem] rounded-tr-none' 
                          : 'bg-white text-[#1a2e1a] rounded-[2rem] rounded-tl-none border border-slate-100'
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        <span className={`text-[9px] font-black uppercase tracking-tighter absolute -bottom-6 opacity-40 whitespace-nowrap flex items-center gap-1 ${isMe ? 'right-2' : 'left-2'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isMe && (
                            <span className="ml-1">
                              {msg.status === 'read' ? (
                                <CheckCheck className="h-3 w-3 text-[#97BC62]" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {isTyping && (
                <div className="flex justify-start mt-8 animate-in slide-in-from-left-2">
                    <div className="bg-[#97BC62]/10 rounded-2xl px-5 py-3 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[#97BC62] rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-[#97BC62] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-[#97BC62] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                </div>
            )}
          </div>

          <div className="p-5 bg-white border-t border-slate-100 relative z-20 pb-8">
             <form onSubmit={handleSend} className="relative flex items-center bg-slate-50 rounded-2xl p-1.5 transition-all focus-within:bg-white focus-within:shadow-xl focus-within:ring-2 focus-within:ring-[#97BC62]/20">
                <button type="button" className="p-3 text-[#1a2e1a]/20 hover:text-[#97BC62] transition-colors rounded-xl">
                   <Paperclip className="h-5 w-5" />
                </button>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Need help with something?"
                  className="flex-1 border-0 bg-transparent text-[#1a2e1a] placeholder:text-[#1a2e1a]/20 focus-visible:ring-0 shadow-none font-bold text-[14px] px-3 tracking-tight"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="h-11 w-11 bg-[#1a2e1a] text-white rounded-xl flex items-center justify-center hover:bg-[#2C5F2D] disabled:opacity-20 transition-all shadow-lg active:scale-95 ml-1 shrink-0"
                >
                  <Send className="h-5 w-5 text-[#97BC62]" />
                </button>
             </form>
          </div>
        </>
      )}
    </div>
  );
}
