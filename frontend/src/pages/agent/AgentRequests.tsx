import { useState } from "react";
import { mockServiceRequests } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";

export default function AgentRequests() {
  const [requests, setRequests] = useState(mockServiceRequests);
  const { toast } = useToast();

  const handleAction = (id: string, action: "approved" | "rejected") => {
    setRequests(requests.map((r) => r.id === id ? { ...r, status: action } : r));
    toast({ title: action === "approved" ? "✅ Request Approved" : "❌ Request Rejected" });
  };

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Service Requests</h2>
      <div className="space-y-4">
        {requests.map((r) => (
          <div key={r.id} className="bg-card rounded-xl border border-border/60 shadow-soft p-5">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <p className="font-medium">{r.customerName}</p>
                <p className="text-sm text-muted-foreground">{r.serviceType} · {r.variant}</p>
                <p className="text-xs text-muted-foreground mt-1">📍 {r.address} · 📅 {r.date}</p>
              </div>
              <div className="flex items-center gap-2">
                {r.status === "pending" ? (
                  <>
                    <Button size="sm" onClick={() => handleAction(r.id, "approved")} className="gap-1">
                      <Check className="h-3 w-3" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleAction(r.id, "rejected")} className="gap-1">
                      <X className="h-3 w-3" /> Reject
                    </Button>
                  </>
                ) : (
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    r.status === "approved" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  }`}>{r.status}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
