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
    <div className="flex h-[calc(100vh-72px)] bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-full md:w-80' : 'hidden md:flex md:w-80'} flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-20`}>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search chats..." className="pl-9 rounded-full bg-slate-50 dark:bg-slate-800 border-none h-10 text-sm" />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {activeChats.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-500">No active chats found</p>
              </div>
            ) : (
              activeChats.map((chat) => (
                <button
                  key={chat._id || chat.id}
                  onClick={() => selectChat(chat)}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${
                    selectedChat?._id === chat._id || selectedChat?.id === chat.id
                      ? "bg-primary/10 border-primary/20"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                    <User className="h-6 w-6 text-slate-500" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className="font-semibold text-slate-900 dark:text-white truncate h-5">
                        {user?.role === "customer" ? chat.agentId.fullName : chat.customerName}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0 mt-1 uppercase font-bold tracking-tighter">
                        {new Date(chat.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate font-medium">{chat.serviceType}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Window */}
      <div className={`${!isSidebarOpen ? 'w-full' : 'hidden md:flex'} flex-1 flex-col bg-slate-50 dark:bg-slate-950 relative`}>
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {user?.role === "customer" ? selectedChat.agentId.fullName : selectedChat.customerName}
                  </h3>
                  <div className="flex items-center gap-1.5 opacity-80">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto no-scrollbar" ref={scrollRef}>
              <div className="space-y-6">
                <div className="flex justify-center mb-8">
                  <div className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest shadow-sm">
                    Conversation Started
                  </div>
                </div>

                {messages.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="h-16 w-16 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                      <MessageSquare className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-slate-500">No messages yet. Send a greeting!</p>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isMe = msg.senderId?._id === user?.id || (user as any)?._id || (!msg.isAiMessage && !msg.senderId);
                    return (
                      <div key={msg._id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm relative ${
                          isMe 
                            ? 'bg-primary text-white rounded-br-none' 
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-100 dark:border-slate-700'
                        }`}>
                          <p className="font-medium">{msg.text}</p>
                          <div className={`text-[9px] mt-1 opacity-70 font-bold flex items-center gap-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                             <Clock className="h-2.5 w-2.5" />
                             {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             {isMe && (
                               <span className="ml-1">
                                 {msg.status === 'read' ? (
                                   <CheckCheck className="h-3 w-3 text-blue-300" />
                                 ) : (
                                   <Check className="h-3 w-3 text-white/60" />
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
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-8">
              <form onSubmit={handleSend} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-2xl p-1.5 pl-4 border border-slate-200 dark:border-slate-700">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0 shadow-none font-medium"
                />
                <Button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="rounded-xl h-10 w-10 flex items-center justify-center p-0 shrink-0"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-40">
            <div className="h-24 w-24 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your Conversations</h3>
            <p className="max-w-xs text-slate-500 font-medium leading-relaxed">
              Select a chat from the sidebar to start communicating with your {user?.role === 'customer' ? 'agent' : 'customer'}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
