import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { io, Socket } from 'socket.io-client';
import { X, MessageSquare, Send, Paperclip, Smile, Loader2, Minimize2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  _id: string;
  text: string;
  isAiMessage: boolean;
  createdAt: string;
  senderId?: {
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
  
  const token = localStorage.getItem('token');
  const userId = user?.id || (user as any)?._id;
  const roomId = userId ? `ai_${userId}` : '';

  useEffect(() => {
    if (!isOpen || !user || !token) return;

    const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      newSocket.emit('join_room', roomId);
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
  }, [isOpen, user, token, roomId]);

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
      roomId,
      text: inputValue,
    });

    setInputValue('');
    setIsTyping(true);
    scrollToBottom();
  };

  if (!user) return null;

  if (!isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        className="fixed bottom-6 right-6 h-14 w-14 bg-gradient-to-tr from-[#2a457a] to-[#4068b5] text-white rounded-full shadow-[0_8px_30px_-4px_rgba(42,69,122,0.4)] hover:shadow-[0_12px_40px_-4px_rgba(42,69,122,0.6)] transition-all flex items-center justify-center hover:scale-105 z-50 ring-4 ring-[#2a457a]/20"
      >
        <MessageSquare className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-[360px] bg-gradient-to-b from-[#5c7ebc] to-[#4261a3] shadow-2xl rounded-3xl overflow-hidden transition-all duration-300 z-50 flex flex-col font-sans ${isMinimized ? 'h-[80px]' : 'h-[600px] max-h-[85vh]'} border border-white/20 backdrop-blur-xl`}>
      {/* Header matching the attached figure's style */}
      <div className="bg-gradient-to-r from-[#1b2b4d]/80 via-[#273d6b]/80 to-[#1b2b4d]/80 backdrop-blur-md p-4 flex items-center justify-between shrink-0 relative overflow-hidden rounded-t-3xl border-b border-white/10 shadow-sm z-20">
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="h-12 w-12 rounded-full border-2 border-white/30 shadow-md bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center shrink-0">
            <Bot className="h-7 w-7 text-white" />
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-base leading-tight text-white tracking-wide">CleanMate Bot</p>
            <div className="flex items-center gap-1.5 mt-0.5 opacity-80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
              <span className="text-xs text-blue-100 font-medium tracking-wide">Online</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 relative z-10 text-white/80">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Minimize">
            <Minimize2 className="h-4 w-4" />
          </button>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat Area */}
          <div className="flex-1 bg-gradient-to-b from-[#5c7ebc] to-[#4261a3] p-5 overflow-y-auto overflow-x-hidden no-scrollbar relative" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-90">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-2 backdrop-blur-md border border-white/20 shadow-xl">
                  <MessageSquare className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-wide">Welcome!</h3>
                <p className="text-sm text-blue-100 font-medium px-6 leading-relaxed">I am your CleanMate Assistant. How can I help you today?</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Simulated timestamp */}
                <div className="flex justify-center my-4">
                  <span className="text-[11px] font-semibold bg-white/20 text-white backdrop-blur-sm px-3 py-1 rounded-full shadow-sm tracking-wider uppercase">Today</span>
                </div>
                
                {messages.map((msg, i) => {
                  const isMe = !msg.isAiMessage;
                  return (
                    <div key={msg._id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group animate-in slide-in-from-bottom-2`}>
                      <div className={`max-w-[85%] rounded-[22px] px-5 py-3.5 text-sm shadow-md relative leading-relaxed tracking-wide font-medium ${
                        isMe 
                          ? 'bg-[#1e3466] text-white rounded-br-sm border border-white/5' 
                          : 'bg-white text-slate-800 rounded-bl-sm border border-black/5 hover:shadow-lg transition-shadow'
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        <span className={`text-[10px] font-bold absolute -bottom-5 opacity-70 whitespace-nowrap ${isMe ? 'right-2 text-white/70' : 'left-2 text-white/80'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-4 bg-gradient-to-t from-[#36518a] to-[#4261a3] relative z-20 pb-6 rounded-b-3xl">
             <form onSubmit={handleSend} className="relative flex items-center bg-[#294273] rounded-full p-1.5 pl-4 shadow-inner border border-white/10">
                <button type="button" className="p-2 text-blue-200 hover:text-white transition-colors bg-white/5 rounded-full hover:bg-white/20">
                   <Paperclip className="h-5 w-5" />
                </button>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter your message..."
                  className="flex-1 border-0 bg-transparent text-white placeholder:text-blue-200/70 focus-visible:ring-0 shadow-none font-medium text-[15px] px-3 tracking-wide"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="h-10 w-10 bg-gradient-to-br from-blue-400 to-cyan-400 text-white rounded-full flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-all shadow-md ml-1 shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                </button>
             </form>
          </div>
        </>
      )}
    </div>
  );
}
