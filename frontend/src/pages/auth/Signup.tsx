import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import logo from "@/assets/logo.svg";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/types";

export default function Signup() {
  const [form, setForm] = useState({ fullName: "", address: "", phone: "", role: "" as UserRole, username: "", password: "" });
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const passwordStrength = (p: string) => {
    if (p.length === 0) return { label: "", color: "" };
    if (p.length < 4) return { label: "Weak", color: "bg-destructive" };
    if (p.length < 8) return { label: "Medium", color: "bg-warning" };
    return { label: "Strong", color: "bg-success" };
  };

  const strength = passwordStrength(form.password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.role) { toast({ title: "Error", description: "Please select a role", variant: "destructive" }); return; }
    const result = signup({ ...form, role: form.role });
    if (result.success) {
      toast({ title: "✅ Registration Successful", description: "Please login with your credentials" });
      navigate("/login");
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <img src={logo} alt="CleanMate" className="h-7 w-7" />
            <span className="text-2xl font-display font-bold text-primary">CleanMate</span>
          </div>
          <p className="text-sm text-muted-foreground">Create your account</p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg border border-border/60 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" placeholder="John Doe" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" placeholder="Your address" rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="555-0100" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as UserRole })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="Choose a username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Create a password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              {form.password && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${strength.color}`} style={{ width: form.password.length < 4 ? "33%" : form.password.length < 8 ? "66%" : "100%" }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{strength.label}</span>
                </div>
              )}
            </div>
            <Button type="submit" className="w-full">Register</Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
