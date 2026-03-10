import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { mockBookings, mockComplaints, mockAgents } from "@/data/mockData";
import { Check, X, ShieldCheck, Users, Calendar, AlertTriangle, BarChart3 } from "lucide-react";

// Manage Users
export function AdminUsers() {
  const users = [
    { id: "1", name: "John Customer", role: "Customer", status: "active", joined: "2026-01-15" },
    { id: "2", name: "Sarah Agent", role: "Agent", status: "active", joined: "2026-01-10" },
    { id: "4", name: "Alice Smith", role: "Customer", status: "active", joined: "2026-02-01" },
    { id: "5", name: "David Lee", role: "Agent", status: "pending", joined: "2026-02-18" },
    { id: "6", name: "Emma Wilson", role: "Agent", status: "active", joined: "2025-12-20" },
  ];

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Manage Users</h2>
      <div className="bg-card rounded-xl border border-border/60 shadow-soft overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell><span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{u.role}</span></TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.status === "active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{u.status}</span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{u.joined}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Verify Agents
export function AdminVerifyAgents() {
  const { toast } = useToast();
  const [agents, setAgents] = useState([
    { id: "a1", name: "David Lee", specialization: "Office Cleaning", status: "pending" },
    { id: "a2", name: "Robert Chen", specialization: "Emergency Cleaning", status: "pending" },
    { id: "a3", name: "Sarah Agent", specialization: "House Cleaning", status: "verified" },
  ]);

  const handleAction = (id: string, action: string) => {
    setAgents(agents.map((a) => a.id === id ? { ...a, status: action } : a));
    toast({ title: action === "verified" ? "✅ Agent Approved" : "❌ Agent Rejected" });
  };

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Verify Agents</h2>
      <div className="space-y-4">
        {agents.map((a) => (
          <div key={a.id} className="bg-card rounded-xl border border-border/60 shadow-soft p-5 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">{a.name.charAt(0)}</div>
              <div>
                <p className="font-medium">{a.name}</p>
                <p className="text-sm text-muted-foreground">{a.specialization}</p>
              </div>
            </div>
            {a.status === "pending" ? (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleAction(a.id, "verified")} className="gap-1"><Check className="h-3 w-3" /> Approve</Button>
                <Button size="sm" variant="outline" onClick={() => handleAction(a.id, "rejected")} className="gap-1"><X className="h-3 w-3" /> Reject</Button>
              </div>
            ) : (
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${a.status === "verified" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>{a.status}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// All Bookings
export function AdminBookings() {
  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">All Bookings</h2>
      <div className="bg-card rounded-xl border border-border/60 shadow-soft overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockBookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-mono text-xs">{b.id}</TableCell>
                <TableCell className="font-medium text-sm">{b.customerName}</TableCell>
                <TableCell className="text-sm">{b.serviceType}</TableCell>
                <TableCell className="text-sm">{b.date}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    b.status === "completed" ? "bg-success/10 text-success" :
                    b.status === "in-progress" ? "bg-info/10 text-info" :
                    b.status === "pending" ? "bg-warning/10 text-warning" :
                    "bg-primary/10 text-primary"
                  }`}>{b.status}</span>
                </TableCell>
                <TableCell className="text-right font-medium">₹{b.amount.toLocaleString("en-IN")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Complaints
export function AdminComplaints() {
  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Complaint Management</h2>
      <div className="space-y-4">
        {mockComplaints.map((c) => (
          <div key={c.id} className="bg-card rounded-xl border border-border/60 shadow-soft p-5">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <p className="font-medium">{c.subject}</p>
                <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
                <p className="text-xs text-muted-foreground mt-2">By {c.userName} · {c.date}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                c.status === "resolved" ? "bg-success/10 text-success" :
                c.status === "in-progress" ? "bg-info/10 text-info" :
                "bg-warning/10 text-warning"
              }`}>{c.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Analytics
export function AdminAnalytics() {
  const stats = [
    { label: "House Cleaning", value: 65, color: "bg-primary" },
    { label: "Office Cleaning", value: 45, color: "bg-info" },
    { label: "Commercial", value: 30, color: "bg-accent" },
    { label: "Emergency", value: 16, color: "bg-warning" },
  ];

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6">
          <h3 className="font-display font-semibold mb-4">Bookings by Category</h3>
          <div className="space-y-4">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{s.label}</span>
                  <span className="font-medium">{s.value}</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${(s.value / 65) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6">
          <h3 className="font-display font-semibold mb-4">Monthly Revenue</h3>
          <div className="space-y-3">
            {[
              { month: "February", amount: 1245000 },
              { month: "January", amount: 1110000 },
              { month: "December", amount: 980000 },
              { month: "November", amount: 1050000 },
            ].map((m) => (
              <div key={m.month} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">{m.month}</span>
                <span className="text-sm font-display font-bold">₹{m.amount.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
