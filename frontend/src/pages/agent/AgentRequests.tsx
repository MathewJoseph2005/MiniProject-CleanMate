import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, X, MessageSquare, MapPin } from "lucide-react";
import { agentAPI } from "@/lib/api";
import { ServiceRequest } from "@/types";

export default function AgentRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    agentAPI.getRequests().then((res) => setRequests(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleAction = async (id: string, action: "approved" | "rejected") => {
    try {
      await agentAPI.updateRequest(id, action);
      setRequests(requests.map((r) => (r.id || r._id) === id ? { ...r, status: action } : r));
      toast({ title: action === "approved" ? "✅ Request Approved" : "❌ Request Rejected" });
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to update", variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="page-container animate-fade-in flex items-center justify-center py-20">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>;
  }

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Service Requests</h2>
      <div className="space-y-4">
        {requests.length === 0 && <p className="text-muted-foreground text-sm">No service requests.</p>}
        {requests.map((r) => (
          <div key={r.id || r._id} className="bg-card rounded-xl border border-border/60 shadow-soft p-5">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <p className="font-medium">{r.customerName}</p>
                <p className="text-sm text-muted-foreground">{r.serviceType} · {r.variant}</p>
                <p className="text-xs text-muted-foreground mt-1">📍 {r.address} · 📅 {new Date(r.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                {r.status === "pending" ? (
                  <>
                    <Button size="sm" onClick={() => handleAction(r.id || r._id!, "approved")} className="gap-1">
                      <Check className="h-3 w-3" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleAction(r.id || r._id!, "rejected")} className="gap-1">
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
            {r.status === "approved" && (
                <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
                    <Button 
                        size="sm" 
                        variant="secondary" 
                        className="gap-2"
                        onClick={() => navigate(`/agent/messages/${r.id || r._id}`)}
                    >
                        <MessageSquare className="h-4 w-4" /> Chat with Customer
                    </Button>
                    <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => {
                            const query = encodeURIComponent(r.address);
                            window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                        }}
                    >
                        <MapPin className="h-4 w-4" /> View on Map
                    </Button>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
