import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { customerAPI } from "@/lib/api";

export default function Complaints() {
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    customerAPI.getComplaints().then((res) => setComplaints(res.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      toast({ title: "Error", description: "Please enter a subject", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await customerAPI.submitComplaint({ subject, description: text });
      toast({ title: "✅ Complaint Submitted", description: "We'll review it shortly." });
      setSubject("");
      setText("");
      setComplaints((prev) => [res.data.complaint, ...prev]);
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to submit", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Complaints</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6">
          <h3 className="font-display font-semibold mb-4">Submit a Complaint</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Brief subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="complaint">Description</Label>
              <Textarea id="complaint" placeholder="Tell us what went wrong..." rows={5} value={text} onChange={(e) => setText(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Complaint"}
            </Button>
          </form>
        </div>

        <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6">
          <h3 className="font-display font-semibold mb-4">Your Complaints</h3>
          <div className="space-y-3">
            {complaints.length === 0 && <p className="text-sm text-muted-foreground">No complaints filed.</p>}
            {complaints.map((c) => (
              <div key={c._id} className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">{c.subject}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    c.status === "resolved" ? "bg-success/10 text-success" :
                    c.status === "in-progress" ? "bg-info/10 text-info" :
                    "bg-warning/10 text-warning"
                  }`}>{c.status}</span>
                </div>
                <p className="text-xs text-muted-foreground">{c.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(c.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
