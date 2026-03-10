import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";
import { adminAPI } from "@/lib/api";

// Manage Users
export function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getUsers().then((res) => setUsers(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-container animate-fade-in flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Manage Users</h2>
      <div className="bg-card rounded-2xl border border-border/60 shadow-soft overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="py-4">User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-12">No users found</TableCell></TableRow>}
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' :
                    u.role === 'agent' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                  }`}>
                    {u.role}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                    u.status === "active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${u.status === "active" ? "bg-success" : "bg-warning"}`}></span>
                    {u.status}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground font-medium">
                  {new Date(u.joined).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </TableCell>
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
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAgentsPending().then((res) => setAgents(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleAction = async (id: string, action: string) => {
    try {
      await adminAPI.verifyAgent(id, action as any);
      setAgents(agents.map((a) => a.id === id ? { ...a, status: action } : a));
      toast({ title: action === "verified" ? "✅ Agent Approved" : "❌ Agent Rejected" });
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed", variant: "destructive" });
    }
  };

  if (loading) return <div className="page-container animate-fade-in flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Verify Agents</h2>
      <div className="space-y-4">
        {agents.length === 0 && <p className="text-muted-foreground text-sm">No agents to verify.</p>}
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
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getBookings().then((res) => setBookings(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-container animate-fade-in flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

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
            {bookings.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No bookings found</TableCell></TableRow>}
            {bookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-mono text-xs">{b.id?.toString().slice(-6)}</TableCell>
                <TableCell className="font-medium text-sm">{b.customerName}</TableCell>
                <TableCell className="text-sm">{b.serviceType}</TableCell>
                <TableCell className="text-sm">{new Date(b.date).toLocaleDateString()}</TableCell>
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
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getComplaints().then((res) => setComplaints(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-container animate-fade-in flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Complaint Management</h2>
      <div className="space-y-4">
        {complaints.length === 0 && <p className="text-muted-foreground text-sm">No complaints.</p>}
        {complaints.map((c) => (
          <div key={c.id} className="bg-card rounded-xl border border-border/60 shadow-soft p-5">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <p className="font-medium">{c.subject}</p>
                <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
                <p className="text-xs text-muted-foreground mt-2">By {c.userName} · {new Date(c.date).toLocaleDateString()}</p>
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
  const [data, setData] = useState<{ categories: any[]; revenue: any[] }>({ categories: [], revenue: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAnalytics().then((res) => setData(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-container animate-fade-in flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  const maxCategory = Math.max(...data.categories.map((c) => c.value), 1);

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6">
          <h3 className="font-display font-semibold mb-4">Bookings by Category</h3>
          <div className="space-y-4">
            {data.categories.length === 0 && <p className="text-sm text-muted-foreground">No data yet.</p>}
            {data.categories.map((s, i) => {
              const colors = ["bg-primary", "bg-info", "bg-accent", "bg-warning"];
              return (
                <div key={s.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{s.label}</span>
                    <span className="font-medium">{s.value}</span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${colors[i % colors.length]}`} style={{ width: `${(s.value / maxCategory) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6">
          <h3 className="font-display font-semibold mb-4">Monthly Revenue</h3>
          <div className="space-y-3">
            {data.revenue.length === 0 && <p className="text-sm text-muted-foreground">No revenue data yet.</p>}
            {data.revenue.map((m) => (
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
