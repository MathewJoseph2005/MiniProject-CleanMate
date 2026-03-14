import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, User, Lock as LockIcon } from "lucide-react";
import logo from "@/assets/logo.svg";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await login(username, password);
      if (result.success) {
        toast({ title: "✅ Login Successful", description: "Welcome back to CleanMate!" });
        const user = JSON.parse(localStorage.getItem("cleanmate_user") || "{}");
        navigate(`/${user.role}`);
      } else {
        toast({ title: "Login Failed", description: result.message, variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#1a2e1a]">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#2C5F2D] rounded-full blur-[120px] opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#97BC62] rounded-full blur-[120px] opacity-30" />
      
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center gap-3 mb-3">
            <div className="h-20 w-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl mb-2 overflow-hidden">
              <img src={logo} alt="CleanMate" className="h-16 w-16" />
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-4xl font-display font-bold leading-tight text-white tracking-tight">CleanMate</h1>
              <p className="text-sm uppercase tracking-[0.3em] text-white/60 font-medium">
                Deep Cleaning Platform
              </p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/10 rounded-[2rem] shadow-2xl border border-white/20 p-8 md:p-10 relative overflow-hidden group">
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          
          <form onSubmit={handleSubmit} className="space-y-6 relative">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white/80 ml-1">Username or Email</Label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within/input:text-white transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <Input 
                  id="username" 
                  placeholder="Enter your username or email" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                  className="bg-black/20 border-white/10 text-white placeholder:text-white/30 h-12 pl-12 focus:bg-black/40 transition-all rounded-xl border-2 focus:border-white/30"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80 ml-1">Password</Label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within/input:text-white transition-colors">
                  <LockIcon className="h-5 w-5" />
                </div>
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="bg-black/20 border-white/10 text-white placeholder:text-white/30 h-12 pl-12 pr-12 focus:bg-black/40 transition-all rounded-xl border-2 focus:border-white/30"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-white/60 hover:text-white transition-colors">
                Forgot Password?
              </Link>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-white text-[#1a2e1a] hover:bg-white/90 font-bold rounded-xl shadow-lg transition-transform active:scale-95" 
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "LOG IN"}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-4 text-white/40 font-medium">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 gap-3 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-xl transition-all"
            onClick={loginWithGoogle}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </Button>

          <p className="mt-8 text-center text-sm text-white/50">
            Don't have an account?{" "}
            <Link to="/signup" className="text-white font-bold hover:underline">SIGN UP</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
