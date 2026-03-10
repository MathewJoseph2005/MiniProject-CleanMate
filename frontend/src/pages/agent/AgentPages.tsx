import { useState, useEffect, useRef } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Calendar, RefreshCw, FileText } from "lucide-react";
import { agentAPI } from "@/lib/api";

// Availability page
export function AgentAvailability() {
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agentAPI.getAvailability().then((res) => setAvailable(res.data.available)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const toggle = async (value: boolean) => {
    try {
      await agentAPI.setAvailability(value);
      setAvailable(value);
    } catch {}
  };

  if (loading) return <div className="page-container animate-fade-in flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

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
          <Switch checked={available} onCheckedChange={toggle} />
        </div>
      </div>
    </div>
  );
}

// Attendance page
export function AgentAttendance() {
  const { toast } = useToast();
  const [marked, setMarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agentAPI.getAttendance().then((res) => setMarked(res.data.markedToday)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const markAttendance = async () => {
    try {
      await agentAPI.markAttendance();
      setMarked(true);
      toast({ title: "✅ Attendance Marked" });
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed", variant: "destructive" });
    }
  };

  if (loading) return <div className="page-container animate-fade-in flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

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
          <Button onClick={markAttendance}>Mark Attendance</Button>
        )}
      </div>
    </div>
  );
}

// Portfolio page
export function AgentPortfolio() {
  const [images, setImages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    agentAPI.getPortfolio().then((res) => setImages(res.data.images || [])).catch(() => {});
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("images", f));
    try {
      const res = await agentAPI.uploadPortfolio(formData);
      setImages(res.data.images);
      toast({ title: "✅ Images Uploaded" });
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Upload failed", variant: "destructive" });
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Portfolio</h2>
      <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6">
        <p className="text-sm text-muted-foreground mb-4">Upload before & after images of your work</p>
        <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div key={i} className="aspect-square rounded-lg border border-border overflow-hidden">
              <img src={img} alt={`Portfolio ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
          <div
            onClick={() => fileRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            <div className="text-center">
              <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Upload Image</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Documents page
export function AgentDocuments() {
  const [documents, setDocuments] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    agentAPI.getDocuments().then((res) => setDocuments(res.data.documents || [])).catch(() => {});
  }, []);

  const handleUpload = async (docType: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,application/pdf";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("document", file);
      formData.append("documentType", docType);
      try {
        const res = await agentAPI.uploadDocument(formData);
        setDocuments(res.data.documents);
        toast({ title: "✅ Document Uploaded" });
      } catch (error: any) {
        toast({ title: "Error", description: error.response?.data?.message || "Upload failed", variant: "destructive" });
      }
    };
    input.click();
  };

  const docTypes = ["ID Proof", "Address Proof", "Background Check"];

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Document Upload</h2>
      <div className="max-w-lg bg-card rounded-xl border border-border/60 shadow-soft p-6">
        <p className="text-sm text-muted-foreground mb-4">Upload verification documents</p>
        <div className="space-y-3">
          {docTypes.map((doc) => {
            const uploaded = documents.find((d: any) => d.type === doc);
            return (
              <div key={doc} className="flex items-center justify-between p-3 rounded-lg border border-border/40">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm font-medium">{doc}</span>
                    {uploaded && (
                      <p className={`text-xs ${uploaded.status === "approved" ? "text-success" : uploaded.status === "rejected" ? "text-destructive" : "text-warning"}`}>
                        {uploaded.status}
                      </p>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-1" onClick={() => handleUpload(doc)}>
                  <Upload className="h-3 w-3" /> {uploaded ? "Re-upload" : "Upload"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Update Status page
export function AgentUpdateStatus() {
  const { toast } = useToast();
  const [status, setStatus] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agentAPI.getRequests().then((res) => {
      const active = res.data.filter((r: any) => r.status === "approved" || r.status === "in-progress");
      setBookings(active);
      if (active.length > 0) setSelectedBooking(active[0].id);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const updateStatus = async () => {
    if (!status || !selectedBooking) return;
    try {
      await agentAPI.updateBookingStatus(selectedBooking, status);
      toast({ title: "✅ Status Updated", description: `Job status changed to ${status}` });
      setBookings(bookings.map((b) => b.id === selectedBooking ? { ...b, status } : b));
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed", variant: "destructive" });
    }
  };

  if (loading) return <div className="page-container animate-fade-in flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Update Service Status</h2>
      <div className="max-w-md bg-card rounded-xl border border-border/60 shadow-soft p-6 space-y-4">
        {bookings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active bookings to update.</p>
        ) : (
          <>
            <div className="space-y-2">
              <Label>Select Booking</Label>
              <Select value={selectedBooking} onValueChange={setSelectedBooking}>
                <SelectTrigger><SelectValue placeholder="Select a booking" /></SelectTrigger>
                <SelectContent>
                  {bookings.map((b: any) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.serviceType} - {b.variant} ({b.customerName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue placeholder="Select new status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={updateStatus}>
              <RefreshCw className="h-4 w-4 mr-2" /> Update Status
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
