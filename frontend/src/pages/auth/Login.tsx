import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import logo from "@/assets/logo.svg";
import { useToast } from "@/hooks/use-toast";


export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(username, password);
    if (result.success) {
      toast({ title: "✅ Login Successful", description: "Welcome back to CleanMate!" });
      const user = JSON.parse(localStorage.getItem("cleanmate_user") || "{}");
      navigate(`/${user.role}`);
    } else {
      toast({ title: "Login Failed", description: result.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
              <img src={logo} alt="CleanMate" className="h-6 w-6" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-3xl font-display font-bold leading-tight text-primary">CleanMate</span>
              <span className="text-xs uppercase tracking-[0.24em] text-primary/70">
                Deep Cleaning Platform
              </span>
            </div>
          </div>
          <p className="text-muted-foreground">Sign in to manage and track all your cleaning services</p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg border border-border/60 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot Password?</Link>
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Demo: customer/password · agent/password · admin/password
        </p>
      </div>
    </div>
  );
}
