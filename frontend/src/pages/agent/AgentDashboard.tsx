import { useState, useEffect } from "react";
import { StatCard } from "@/components/StatCard";
import { Clock, Briefcase, CheckCircle, Star } from "lucide-react";
import { agentAPI } from "@/lib/api";
import { AgentDashboardStats } from "@/types";

export default function AgentDashboard() {
  const [stats, setStats] = useState<AgentDashboardStats>({ pendingRequests: 0, activeJobs: 0, completedJobs: 0, rating: 0 });
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agentAPI.getDashboard().then((res) => {
      setStats(res.data.stats);
      setRecentRequests(res.data.recentRequests || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="page-container animate-fade-in flex items-center justify-center py-20">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>;
  }

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Agent Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Requests" value={stats.pendingRequests} icon={Clock} variant="warning" />
        <StatCard title="Active Jobs" value={stats.activeJobs} icon={Briefcase} variant="primary" />
        <StatCard title="Completed Jobs" value={stats.completedJobs} icon={CheckCircle} variant="success" />
        <StatCard title="Rating" value={stats.rating || "N/A"} icon={Star} variant="accent" />
      </div>

      <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6">
        <h3 className="font-display font-semibold mb-4">Recent Requests</h3>
        <div className="space-y-3">
          {recentRequests.length === 0 && <p className="text-sm text-muted-foreground">No pending requests.</p>}
          {recentRequests.map((r: any) => (
            <div key={r._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium">{(r.customerId as any)?.fullName || "Customer"}</p>
                <p className="text-xs text-muted-foreground">{r.serviceType} · {r.variant} · {new Date(r.date).toLocaleDateString()}</p>
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
