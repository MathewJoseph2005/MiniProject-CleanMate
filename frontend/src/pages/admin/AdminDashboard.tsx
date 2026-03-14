import { useState, useEffect } from "react";
import { StatCard } from "@/components/StatCard";
import { Users, ShieldCheck, Calendar, AlertTriangle, Star } from "lucide-react";
import { adminAPI } from "@/lib/api";
import { AdminDashboardData } from "@/types";

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard().then((res) => setData(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <div className="page-container animate-fade-in flex items-center justify-center py-20">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>;
  }

  return (
    <div className="page-container animate-fade-in p-8 space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-display font-bold text-[#1a2e1a]">Admin Overview</h2>
        <p className="text-sm text-[#1a2e1a]/40 font-medium">Manage and monitor platform performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={data.stats.totalUsers} icon={Users} variant="primary" />
        <StatCard title="Total Agents" value={data.stats.totalAgents} icon={ShieldCheck} variant="accent" />
        <StatCard title="Total Bookings" value={data.stats.totalBookings} icon={Calendar} variant="success" />
        <StatCard title="Pending Complaints" value={data.stats.pendingComplaints} icon={AlertTriangle} variant="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 flex flex-col items-center text-center group hover:-translate-y-1 transition-all duration-300">
          <h3 className="text-[#1a2e1a]/60 text-sm font-bold uppercase tracking-widest mb-4">Revenue This Month</h3>
          <p className="text-4xl font-display font-black text-[#1a2e1a]">₹{data.revenue.toLocaleString("en-IN")}</p>
          <div className="mt-4 px-4 py-1.5 bg-[#97BC62]/20 text-[#1a2e1a] text-[10px] font-bold rounded-full uppercase tracking-tighter">
            Verified Earnings
          </div>
        </div>
        
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 flex flex-col items-center text-center group hover:-translate-y-1 transition-all duration-300">
          <h3 className="text-[#1a2e1a]/60 text-sm font-bold uppercase tracking-widest mb-4">Active Services</h3>
          <p className="text-4xl font-display font-black text-[#1a2e1a]">{data.activeServices}</p>
          <p className="text-xs text-[#1a2e1a]/40 mt-3 font-semibold">Across {data.activeAgents} registered agents</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 flex flex-col items-center text-center group hover:-translate-y-1 transition-all duration-300">
          <h3 className="text-[#1a2e1a]/60 text-sm font-bold uppercase tracking-widest mb-4">Platform Health</h3>
          <div className="flex items-center gap-2 mb-1">
             <Star className="h-6 w-6 text-[#97BC62] fill-[#97BC62]" />
             <p className="text-4xl font-display font-black text-[#1a2e1a]">{data.satisfaction}/5</p>
          </div>
          <p className="text-xs text-[#1a2e1a]/40 mt-2 font-semibold tracking-wide">Average Service Rating</p>
        </div>
      </div>
    </div>
  );
}
