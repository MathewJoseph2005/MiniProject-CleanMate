import { StatCard } from "@/components/StatCard";
import { Clock, Briefcase, CheckCircle, Star } from "lucide-react";
import { mockServiceRequests, mockBookings } from "@/data/mockData";

export default function AgentDashboard() {
  const pending = mockServiceRequests.filter((r) => r.status === "pending").length;
  const active = mockBookings.filter((b) => b.status === "in-progress").length;
  const completed = mockBookings.filter((b) => b.status === "completed").length;

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Agent Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Requests" value={pending} icon={Clock} variant="warning" />
        <StatCard title="Active Jobs" value={active} icon={Briefcase} variant="primary" />
        <StatCard title="Completed Jobs" value={completed} icon={CheckCircle} variant="success" />
        <StatCard title="Rating" value="4.8" icon={Star} variant="accent" />
      </div>

      <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6">
        <h3 className="font-display font-semibold mb-4">Recent Requests</h3>
        <div className="space-y-3">
          {mockServiceRequests.map((r) => (
            <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium">{r.customerName}</p>
                <p className="text-xs text-muted-foreground">{r.serviceType} · {r.variant} · {r.date}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                r.status === "pending" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
              }`}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
