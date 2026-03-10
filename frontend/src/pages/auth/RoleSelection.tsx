import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types";
import { authAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { UserCheck, Wrench, Shield } from "lucide-react";
import logo from "@/assets/logo.svg";

export default function RoleSelection() {
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshUser } = useAuth();

  const roles = [
    {
      value: "customer" as UserRole,
      title: "Customer",
      desc: "Book cleaning services, track orders, and leave reviews",
      icon: UserCheck,
      color: "from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:border-blue-500/60",
      iconColor: "text-blue-500",
    },
    {
      value: "agent" as UserRole,
      title: "Cleaning Agent",
      desc: "Accept service requests, manage your schedule, and grow your career",
      icon: Wrench,
      color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 hover:border-emerald-500/60",
      iconColor: "text-emerald-500",
    },
    {
      value: "admin" as UserRole,
      title: "Platform Admin",
      desc: "Manage users, monitor analytics, and oversee operations",
      icon: Shield,
      color: "from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:border-purple-500/60",
      iconColor: "text-purple-500",
    },
  ];

  const handleContinue = async () => {
    if (!selected) {
      toast({ title: "Please select a role", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await authAPI.updateRole(selected);
      await refreshUser();
      toast({ title: "✅ Welcome to CleanMate!", description: `You're now set up as a ${selected}.` });
      navigate(`/${selected}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to set role",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/40 to-background">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <img src={logo} alt="CleanMate" className="h-8 w-8" />
            <span className="text-3xl font-display font-bold text-primary">CleanMate</span>
          </div>
          <h2 className="text-xl font-display font-semibold mt-2">Choose Your Role</h2>
          <p className="text-sm text-muted-foreground mt-1">
            How would you like to use CleanMate?
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {roles.map((role) => (
            <button
              key={role.value}
              onClick={() => setSelected(role.value)}
              className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 bg-gradient-to-br transition-all duration-200 text-left ${role.color} ${
                selected === role.value
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.02]"
                  : "opacity-75 hover:opacity-100"
              }`}
            >
              <div className={`h-12 w-12 rounded-xl bg-card/80 flex items-center justify-center shrink-0 ${role.iconColor}`}>
                <role.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display font-semibold text-lg">{role.title}</p>
                <p className="text-sm text-muted-foreground">{role.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selected || isLoading}
          className="w-full text-base py-6"
          size="lg"
        >
          {isLoading ? "Setting up..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}
