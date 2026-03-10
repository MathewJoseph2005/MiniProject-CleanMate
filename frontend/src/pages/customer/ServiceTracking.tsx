import { CheckCircle, Circle, Clock, Loader2 } from "lucide-react";

const steps = [
  { label: "Requested", status: "done" as const },
  { label: "Approved", status: "done" as const },
  { label: "In Progress", status: "current" as const },
  { label: "Completed", status: "upcoming" as const },
];

export default function ServiceTracking() {
  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Service Tracking</h2>

      <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-display font-semibold">Office Cleaning - Standard</p>
            <p className="text-sm text-muted-foreground">Booking #B002</p>
          </div>
          <span className="text-xs px-3 py-1.5 rounded-full bg-info/10 text-info font-medium">In Progress</span>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between">
            {steps.map((step, i) => (
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
          {/* Progress line */}
          <div className="absolute top-5 left-[12.5%] right-[12.5%] h-0.5 bg-muted -translate-y-1/2">
            <div className="h-full bg-success" style={{ width: "66%" }} />
          </div>
        </div>

        <div className="mt-8 p-4 rounded-lg bg-muted/50">
          <p className="text-sm font-medium">Agent: Sarah Agent</p>
          <p className="text-xs text-muted-foreground mt-1">Estimated completion: Today, 4:00 PM</p>
        </div>
      </div>
    </div>
  );
}
