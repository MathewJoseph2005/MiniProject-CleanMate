import { StatCard } from "@/components/StatCard";
import { Users, ShieldCheck, Calendar, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Admin Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={24} icon={Users} variant="primary" />
        <StatCard title="Total Agents" value={8} icon={ShieldCheck} variant="success" />
        <StatCard title="Total Bookings" value={156} icon={Calendar} variant="accent" />
        <StatCard title="Pending Complaints" value={3} icon={AlertTriangle} variant="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6">
          <h3 className="font-display font-semibold mb-3">Revenue This Month</h3>
          <p className="text-3xl font-display font-bold text-primary">₹12,45,000</p>
          <p className="text-xs text-success mt-1">↑ 12% from last month</p>
        </div>
        <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6">
          <h3 className="font-display font-semibold mb-3">Active Services</h3>
          <p className="text-3xl font-display font-bold text-primary">7</p>
          <p className="text-xs text-muted-foreground mt-1">Across 5 agents</p>
        </div>
        <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6">
          <h3 className="font-display font-semibold mb-3">Customer Satisfaction</h3>
          <p className="text-3xl font-display font-bold text-primary">4.6/5</p>
          <p className="text-xs text-success mt-1">↑ 0.2 from last month</p>
        </div>
      </div>
    </div>
  );
}
