import { useState, useEffect } from "react";
import { StatCard } from "@/components/StatCard";
import { Calendar, CheckCircle, Clock, Wallet } from "lucide-react";
import { customerAPI } from "@/lib/api";
import { DashboardStats, Booking } from "@/types";

export default function CustomerDashboard() {
  const [stats, setStats] = useState<DashboardStats>({ active: 0, completed: 0, pending: 0, totalSpent: 0 });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    customerAPI.getDashboard().then((res) => {
      setStats(res.data.stats);
      setRecentBookings(res.data.recentBookings || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="page-container animate-fade-in flex items-center justify-center py-20">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>;
  }

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Welcome back! 👋</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Bookings" value={stats.active} icon={Calendar} variant="primary" />
        <StatCard title="Completed" value={stats.completed} icon={CheckCircle} variant="success" />
        <StatCard title="Pending" value={stats.pending} icon={Clock} variant="warning" />
        <StatCard title="Total Spent" value={`₹${stats.totalSpent.toLocaleString("en-IN")}`} icon={Wallet} variant="accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6">
          <h3 className="font-display font-semibold mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {recentBookings.length === 0 && <p className="text-sm text-muted-foreground">No bookings yet. Book your first service!</p>}
            {recentBookings.slice(0, 3).map((b: any) => (
              <div key={b._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium">{b.serviceType}</p>
                  <p className="text-xs text-muted-foreground">{new Date(b.date).toLocaleDateString()} · {b.variant}</p>
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
