import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Circle, Clock, Loader2, MessageSquare } from "lucide-react";
import { customerAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrackingStep } from "@/types";

export default function ServiceTracking() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<string>("");
  const [tracking, setTracking] = useState<{ booking: any; steps: TrackingStep[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    customerAPI.getBookings().then((res) => {
      const activeBookings = res.data.filter((b: any) =>
        ['pending', 'approved', 'in-progress'].includes(b.status)
      );
      setBookings(activeBookings);
      if (activeBookings.length > 0) {
        setSelectedBooking(activeBookings[0]._id);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedBooking) {
      customerAPI.getBookingTracking(selectedBooking).then((res) => {
        setTracking(res.data);
      }).catch(() => {});
    }
  }, [selectedBooking]);

  if (loading) {
    return <div className="page-container animate-fade-in flex items-center justify-center py-20">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>;
  }

  const steps = tracking?.steps || [];
  const booking = tracking?.booking;

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Service Tracking</h2>

      {bookings.length === 0 ? (
        <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6 max-w-2xl text-center text-muted-foreground">
          No active bookings to track.
        </div>
      ) : (
        <>
          <div className="max-w-2xl mb-4">
            <Select value={selectedBooking} onValueChange={setSelectedBooking}>
              <SelectTrigger><SelectValue placeholder="Select a booking" /></SelectTrigger>
              <SelectContent>
                {bookings.map((b: any) => (
                  <SelectItem key={b._id} value={b._id}>
                    {b.serviceType} - {b.variant} ({new Date(b.date).toLocaleDateString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {booking && (
            <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6 max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="font-display font-semibold">{booking.serviceType} - {booking.variant}</p>
                  <p className="text-sm text-muted-foreground">Booking #{booking._id?.slice(-6)}</p>
                </div>
                <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                  booking.status === "in-progress" ? "bg-info/10 text-info" :
                  booking.status === "approved" ? "bg-primary/10 text-primary" :
                  "bg-warning/10 text-warning"
                }`}>{booking.status}</span>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between">
                  {steps.map((step: TrackingStep) => (
                    <div key={step.label} className="flex flex-col items-center relative z-10" style={{ width: `${100 / steps.length}%` }}>
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        step.status === "done" ? "bg-success text-success-foreground" :
                        step.status === "current" ? "bg-primary text-primary-foreground" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {step.status === "done" ? <CheckCircle className="h-5 w-5" /> :
                         step.status === "current" ? <Loader2 className="h-5 w-5 animate-spin" /> :
                         <Circle className="h-5 w-5" />}
                      </div>
                      <p className={`text-xs mt-2 text-center font-medium ${
                        step.status === "upcoming" ? "text-muted-foreground" : "text-foreground"
                      }`}>{step.label}</p>
                    </div>
                  ))}
                </div>
                <div className="absolute top-5 left-[12.5%] right-[12.5%] h-0.5 bg-muted -translate-y-1/2">
                  <div className="h-full bg-success" style={{ width: `${(steps.filter((s: TrackingStep) => s.status === "done").length / (steps.length - 1)) * 100}%` }} />
                </div>
              </div>

              <div className="mt-8 p-4 rounded-lg bg-muted/50 flex items-center justify-between flex-wrap gap-4">
                <div>
                    <p className="text-sm font-medium">Agent: {booking.agentId?.fullName || "Pending assignment"}</p>
                    <p className="text-xs text-muted-foreground mt-1">Amount: ₹{booking.amount?.toLocaleString("en-IN")}</p>
                </div>
                {booking.agentId && (
                    <Button 
                        size="sm" 
                        className="gap-2"
                        onClick={() => navigate(`/customer/messages/${booking._id}`)}
                    >
                        <MessageSquare className="h-4 w-4" /> Chat with Agent
                    </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
