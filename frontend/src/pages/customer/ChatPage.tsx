import { useState } from "react";
import { mockContacts, mockMessages } from "@/data/mockData";
import { Send, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const contact = mockContacts.find((c) => c.id === selectedContact);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), text: message, sender: "me", time: "Now" }]);
    setMessage("");
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex animate-fade-in">
      {/* Contacts */}
      <div className={`w-full md:w-80 border-r border-border bg-card flex flex-col ${selectedContact ? "hidden md:flex" : "flex"}`}>
        <div className="p-4 border-b border-border">
          <h3 className="font-display font-semibold">Messages</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockContacts.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedContact(c.id)}
              className={`w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors border-b border-border/30 ${selectedContact === c.id ? "bg-muted/50" : ""}`}
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                {c.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{c.name}</p>
                  <span className="text-xs text-muted-foreground">{c.time}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
              </div>
              {c.unread > 0 && (
                <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">{c.unread}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Panel */}
      <div className={`flex-1 flex flex-col bg-background ${selectedContact ? "flex" : "hidden md:flex"}`}>
        {selectedContact ? (
          <>
            <div className="p-4 border-b border-border bg-card flex items-center gap-3">
              <button className="md:hidden" onClick={() => setSelectedContact(null)}>
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {contact?.name.charAt(0)}
              </div>
              <p className="font-medium text-sm">{contact?.name}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                    m.sender === "me" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-card border border-border rounded-bl-md"
                  }`}>
                    <p>{m.text}</p>
                    <p className={`text-[10px] mt-1 ${m.sender === "me" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{m.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-border bg-card">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button size="icon" onClick={sendMessage}><Send className="h-4 w-4" /></Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
