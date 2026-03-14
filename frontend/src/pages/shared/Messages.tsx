import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { customerAPI, agentAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Calendar, User, Send, Bot, ChevronLeft, Search, Clock, Check, CheckCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { io, Socket } from "socket.io-client";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export default function Messages() {
  const { user } = useAuth();
  const [activeChats, setActiveChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem("cleanmate_token");

  useEffect(() => {
    const fetchActiveChats = async () => {
      try {
        let response;
        if (user?.role === "customer") {
          response = await customerAPI.getBookings();
        } else if (user?.role === "agent") {
          response = await agentAPI.getRequests();
        }

        if (response) {
          const chats = response.data.filter((b: any) => 
            (user?.role === "customer" && b.agentId && ["approved", "in-progress"].includes(b.status)) ||
            (user?.role === "agent" && ["approved", "in-progress"].includes(b.status) && b.customerId)
          );
          setActiveChats(chats);
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to load active chats", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchActiveChats();
  }, [user]);

  useEffect(() => {
    if (!selectedChat || !token) return;

    const newSocket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      auth: { token },
      transports: ["websocket"],
    });

    const roomId = `booking_${selectedChat._id || selectedChat.id}`;

    newSocket.on("connect", () => {
      newSocket.emit("join_room", roomId);
    });

    newSocket.on("chat_history", (history: Message[]) => {
      setMessages(history);
      scrollToBottom();
    });

    newSocket.on("new_message", (msg: Message) => {
      setMessages(prev => [...prev, msg]);
      scrollToBottom();
    });

    newSocket.on("messages_read", ({ userId: readByUserId }: { userId: string }) => {
      // If someone else read the messages, update our 'sent' messages to 'read'
      if (readByUserId !== user?.id && (user as any)?._id !== readByUserId) {
        setMessages(prev => prev.map(m => m.status === 'sent' ? { ...m, status: 'read' } : m));
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [selectedChat, token]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || !socket || !selectedChat) return;

    socket.emit("send_message", {
      roomId: `booking_${selectedChat._id || selectedChat.id}`,
      text: inputValue,
    });

    setInputValue("");
    scrollToBottom();
  };

  const selectChat = (chat: any) => {
    setSelectedChat(chat);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-72px)] items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-80px)] bg-slate-50 overflow-hidden">
      {/* Sidebar - Green Theme */}
      <div className={`${isSidebarOpen ? 'w-full md:w-96' : 'hidden md:flex md:w-96'} flex-col border-r border-slate-100 bg-white z-20`}>
        <div className="p-6 border-b border-slate-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-[#1a2e1a] tracking-tight">Messages</h2>
            <div className="h-8 w-8 rounded-xl bg-[#97BC62]/10 flex items-center justify-center text-[#1a2e1a]">
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1a2e1a]/20" />
            <Input placeholder="Search conversations..." className="pl-11 rounded-2xl bg-slate-50 border-none h-12 text-sm font-bold placeholder:text-[#1a2e1a]/20 text-[#1a2e1a]" />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {activeChats.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-xs font-black uppercase tracking-widest text-[#1a2e1a]/20">No active chats</p>
              </div>
            ) : (
              activeChats.map((chat) => (
                <button
                  key={chat._id || chat.id}
                  onClick={() => selectChat(chat)}
                  className={`w-full p-4 rounded-3xl flex items-center gap-4 transition-all group ${
                    selectedChat?._id === chat._id || selectedChat?.id === chat.id
                      ? "bg-[#1a2e1a] text-white shadow-xl shadow-[#1a2e1a]/20"
                      : "hover:bg-[#97BC62]/5"
                  }`}
                >
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-colors ${
                    selectedChat?._id === chat._id || selectedChat?.id === chat.id
                      ? "bg-white/10 border-white/20"
                      : "bg-slate-50 border-slate-100 group-hover:border-[#97BC62]"
                  }`}>
                    <User className={`h-6 w-6 ${
                      selectedChat?._id === chat._id || selectedChat?.id === chat.id ? "text-white" : "text-[#1a2e1a]/40"
                    }`} />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className={`font-black tracking-tight truncate ${
                        selectedChat?._id === chat._id || selectedChat?.id === chat.id ? "text-white" : "text-[#1a2e1a]"
                      }`}>
                        {user?.role === "customer" ? chat.agentId.fullName : chat.customerName}
                      </p>
                      <span className={`text-[9px] shrink-0 mt-1 uppercase font-black tracking-tighter ${
                        selectedChat?._id === chat._id || selectedChat?.id === chat.id ? "text-white/40" : "text-[#1a2e1a]/30"
                      }`}>
                        {new Date(chat.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className={`text-[10px] uppercase font-black tracking-widest truncate ${
                      selectedChat?._id === chat._id || selectedChat?.id === chat.id ? "text-[#97BC62]" : "text-[#1a2e1a]/40"
                    }`}>{chat.serviceType}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Window */}
      <div className={`${!isSidebarOpen ? 'w-full' : 'hidden md:flex'} flex-1 flex-col bg-slate-50 relative`}>
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="h-20 flex items-center justify-between px-6 bg-white border-b border-slate-100 z-10">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="md:hidden rounded-xl" onClick={() => setIsSidebarOpen(true)}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="h-12 w-12 rounded-2xl bg-[#1a2e1a] flex items-center justify-center border-2 border-[#1a2e1a] shadow-lg">
                  <User className="h-6 w-6 text-[#97BC62]" />
                </div>
                <div>
                  <h3 className="font-black text-[#1a2e1a] text-lg tracking-tight">
                    {user?.role === "customer" ? selectedChat.agentId.fullName : selectedChat.customerName}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#97BC62] animate-pulse"></span>
                    <span className="text-[10px] text-[#1a2e1a]/40 font-black uppercase tracking-[0.2em]">Live Connection</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-8 overflow-y-auto no-scrollbar" ref={scrollRef}>
              <div className="space-y-8">
                <div className="flex justify-center mb-8">
                  <div className="px-4 py-1.5 rounded-full bg-[#1a2e1a]/5 text-[9px] font-black text-[#1a2e1a]/40 uppercase tracking-[0.3em]">
                    Conversation Established
                  </div>
                </div>

                {messages.length === 0 ? (
                  <div className="text-center py-20 flex flex-col items-center">
                    <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-xl border border-slate-50">
                      <MessageSquare className="h-10 w-10 text-[#97BC62]" />
                    </div>
                    <p className="text-sm font-black text-[#1a2e1a]/40 uppercase tracking-widest">No messages yet. Say hello!</p>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isMe = msg.senderId?._id === user?.id || (user as any)?._id || (!msg.isAiMessage && !msg.senderId);
                    return (
                      <div key={msg._id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-3`}>
                        <div className={`max-w-[75%] rounded-[2rem] px-6 py-4 text-sm shadow-xl relative ${
                          isMe 
                            ? 'bg-[#1a2e1a] text-white rounded-tr-none' 
                            : 'bg-white text-[#1a2e1a] rounded-tl-none border border-slate-50'
                        }`}>
                          <p className="font-bold tracking-tight">{msg.text}</p>
                          <div className={`text-[9px] mt-2 opacity-40 font-black uppercase tracking-tighter flex items-center gap-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                             <Clock className="h-2.5 w-2.5" />
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
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-slate-100 pb-10">
              <form onSubmit={handleSend} className="flex items-center gap-3 bg-slate-50 rounded-[2rem] p-2 transition-all focus-within:bg-white focus-within:shadow-2xl focus-within:ring-2 focus-within:ring-[#97BC62]/20 border border-slate-100">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 shadow-none font-bold text-[#1a2e1a] placeholder:text-[#1a2e1a]/20"
                />
                <Button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="rounded-2xl h-12 w-12 bg-[#1a2e1a] hover:bg-[#2C5F2D] flex items-center justify-center p-0 shrink-0 shadow-lg active:scale-95"
                >
                  <Send className="h-5 w-5 text-[#97BC62]" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="h-32 w-32 bg-white rounded-[3rem] flex items-center justify-center mb-10 shadow-2xl border border-slate-50 group hover:-rotate-12 transition-transform">
              <MessageSquare className="h-16 w-16 text-[#97BC62]" />
            </div>
            <h3 className="text-3xl font-black text-[#1a2e1a] mb-4 tracking-tight">Your Conversations</h3>
            <p className="max-w-xs text-[#1a2e1a]/40 font-bold uppercase tracking-widest text-[11px] leading-loose">
              Select a conversation from the sidebar to chat with your {user?.role === 'customer' ? 'service professional' : 'customer'}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
