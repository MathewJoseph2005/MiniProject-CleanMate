import { useState, useEffect } from "react";
import { StatCard } from "@/components/StatCard";
import { Users, ShieldCheck, Calendar, AlertTriangle } from "lucide-react";
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
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Admin Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={data.stats.totalUsers} icon={Users} variant="primary" />
        <StatCard title="Total Agents" value={data.stats.totalAgents} icon={ShieldCheck} variant="success" />
        <StatCard title="Total Bookings" value={data.stats.totalBookings} icon={Calendar} variant="accent" />
        <StatCard title="Pending Complaints" value={data.stats.pendingComplaints} icon={AlertTriangle} variant="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6">
          <h3 className="font-display font-semibold mb-3">Revenue This Month</h3>
          <p className="text-3xl font-display font-bold text-primary">₹{data.revenue.toLocaleString("en-IN")}</p>
          <p className="text-xs text-success mt-1">From completed bookings</p>
        </div>
        <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6">
          <h3 className="font-display font-semibold mb-3">Active Services</h3>
          <p className="text-3xl font-display font-bold text-primary">{data.activeServices}</p>
          <p className="text-xs text-muted-foreground mt-1">Across {data.activeAgents} agents</p>
        </div>
        <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6">
          <h3 className="font-display font-semibold mb-3">Customer Satisfaction</h3>
          <p className="text-3xl font-display font-bold text-primary">{data.satisfaction}/5</p>
          <p className="text-xs text-success mt-1">Average rating</p>
        </div>
      </div>
    </div>
  );
}
