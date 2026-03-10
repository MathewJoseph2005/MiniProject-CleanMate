import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { mockComplaints } from "@/data/mockData";

export default function Complaints() {
  const [text, setText] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "✅ Complaint Submitted", description: "We'll review it shortly." });
    setText("");
  };

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Complaints</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6">
          <h3 className="font-display font-semibold mb-4">Submit a Complaint</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="complaint">Describe your issue</Label>
              <Textarea id="complaint" placeholder="Tell us what went wrong..." rows={5} value={text} onChange={(e) => setText(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">Submit Complaint</Button>
          </form>
        </div>

        <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6">
          <h3 className="font-display font-semibold mb-4">Your Complaints</h3>
          <div className="space-y-3">
            {mockComplaints.filter((c) => c.userId === "1").map((c) => (
              <div key={c.id} className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">{c.subject}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    c.status === "resolved" ? "bg-success/10 text-success" :
                    c.status === "in-progress" ? "bg-info/10 text-info" :
                    "bg-warning/10 text-warning"
                  }`}>{c.status}</span>
                </div>
                <p className="text-xs text-muted-foreground">{c.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{c.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
