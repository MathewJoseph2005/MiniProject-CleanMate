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
    <div className="page-container animate-fade-in p-8 space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-display font-bold text-[#1a2e1a]">Agent Hub</h2>
        <p className="text-sm text-[#1a2e1a]/40 font-medium">Manage your schedule and service requests</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Pending Requests" value={stats.pendingRequests} icon={Clock} variant="warning" />
        <StatCard title="Active Jobs" value={stats.activeJobs} icon={Briefcase} variant="primary" />
        <StatCard title="Completed Jobs" value={stats.completedJobs} icon={CheckCircle} variant="success" />
        <StatCard title="Avg Rating" value={stats.rating || "5.0"} icon={Star} variant="accent" />
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 group transition-all duration-300">
        <h3 className="text-[#1a2e1a] font-display font-bold text-lg mb-6 flex items-center gap-2">
           <span className="w-1.5 h-6 bg-[#97BC62] rounded-full" />
           New Service Requests
        </h3>
        <div className="space-y-4">
          {recentRequests.length === 0 && <p className="text-sm text-[#1a2e1a]/40 font-medium italic">All caught up! No pending requests for now.</p>}
          {recentRequests.map((r: any) => (
            <div key={r._id} className="flex items-center justify-between p-5 rounded-2xl bg-[#97BC62]/5 border border-[#97BC62]/10 hover:bg-[#97BC62]/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#1a2e1a] flex items-center justify-center text-white shadow-lg">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#1a2e1a]">{(r.customerId as any)?.fullName || "Premium Customer"}</p>
                  <p className="text-[10px] text-[#1a2e1a]/40 font-bold uppercase tracking-wider">{r.serviceType} · {r.variant} · {new Date(r.date).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tighter ${
                r.status === "pending" ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600"
              }`}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
