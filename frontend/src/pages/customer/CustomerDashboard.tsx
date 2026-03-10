import { StatCard } from "@/components/StatCard";
import { Calendar, CheckCircle, Clock, Wallet } from "lucide-react";
import { mockBookings } from "@/data/mockData";

export default function CustomerDashboard() {
  const active = mockBookings.filter((b) => b.status === "in-progress" || b.status === "approved").length;
  const completed = mockBookings.filter((b) => b.status === "completed").length;
  const pending = mockBookings.filter((b) => b.status === "pending").length;
  const totalSpent = mockBookings.filter((b) => b.status === "completed").reduce((s, b) => s + b.amount, 0);

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Welcome back! 👋</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Bookings" value={active} icon={Calendar} variant="primary" />
        <StatCard title="Completed" value={completed} icon={CheckCircle} variant="success" />
        <StatCard title="Pending" value={pending} icon={Clock} variant="warning" />
        <StatCard title="Total Spent" value={`₹${totalSpent.toLocaleString("en-IN")}`} icon={Wallet} variant="accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6">
          <h3 className="font-display font-semibold mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {mockBookings.slice(0, 3).map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium">{b.serviceType}</p>
                  <p className="text-xs text-muted-foreground">{b.date} · {b.variant}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  b.status === "completed" ? "bg-success/10 text-success" :
                  b.status === "in-progress" ? "bg-info/10 text-info" :
                  b.status === "pending" ? "bg-warning/10 text-warning" :
                  "bg-primary/10 text-primary"
                }`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6">
          <h3 className="font-display font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Book Service", desc: "Schedule a new cleaning" },
              { label: "Track Service", desc: "View ongoing service" },
              { label: "View History", desc: "Past service records" },
              { label: "Get Estimate", desc: "Calculate costs" },
            ].map((a) => (
              <div key={a.label} className="p-4 rounded-lg border border-border/40 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer">
                <p className="text-sm font-medium mt-2">{a.label}</p>
                <p className="text-xs text-muted-foreground">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
