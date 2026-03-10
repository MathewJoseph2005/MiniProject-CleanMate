import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Calendar, ToggleLeft, Image, FileText, RefreshCw } from "lucide-react";

// Availability page
export function AgentAvailability() {
  const [available, setAvailable] = useState(true);

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Availability</h2>
      <div className="max-w-md bg-card rounded-xl border border-border/60 shadow-soft p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display font-semibold">Toggle Availability</p>
            <p className="text-sm text-muted-foreground mt-1">
              You are currently <span className={available ? "text-success font-medium" : "text-destructive font-medium"}>{available ? "Available" : "Unavailable"}</span>
            </p>
          </div>
          <Switch checked={available} onCheckedChange={setAvailable} />
        </div>
      </div>
    </div>
  );
}

// Attendance page
export function AgentAttendance() {
  const { toast } = useToast();
  const [marked, setMarked] = useState(false);

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Attendance</h2>
      <div className="max-w-md bg-card rounded-xl border border-border/60 shadow-soft p-6 text-center">
        <Calendar className="h-10 w-10 text-primary mx-auto mb-3" />
        <p className="font-display font-semibold">Today's Attendance</p>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
        {marked ? (
          <p className="text-success font-medium">✅ Attendance Marked</p>
        ) : (
          <Button onClick={() => { setMarked(true); toast({ title: "✅ Attendance Marked" }); }}>Mark Attendance</Button>
        )}
      </div>
    </div>
  );
}

// Portfolio page
export function AgentPortfolio() {
  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Portfolio</h2>
      <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6">
        <p className="text-sm text-muted-foreground mb-4">Upload before & after images of your work</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
              <div className="text-center">
                <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Upload Image</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Documents page
export function AgentDocuments() {
  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Document Upload</h2>
      <div className="max-w-lg bg-card rounded-xl border border-border/60 shadow-soft p-6">
        <p className="text-sm text-muted-foreground mb-4">Upload verification documents</p>
        <div className="space-y-3">
          {["ID Proof", "Address Proof", "Background Check"].map((doc) => (
            <div key={doc} className="flex items-center justify-between p-3 rounded-lg border border-border/40">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{doc}</span>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <Upload className="h-3 w-3" /> Upload
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Update Status page
export function AgentUpdateStatus() {
  const { toast } = useToast();
  const [status, setStatus] = useState("");

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Update Service Status</h2>
      <div className="max-w-md bg-card rounded-xl border border-border/60 shadow-soft p-6 space-y-4">
        <div className="space-y-2">
          <Label>Current Job: Office Cleaning - Standard (#B002)</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue placeholder="Select new status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full" onClick={() => {
          if (status) toast({ title: "✅ Status Updated", description: `Job status changed to ${status}` });
        }}>
          <RefreshCw className="h-4 w-4 mr-2" /> Update Status
        </Button>
      </div>
    </div>
  );
}
