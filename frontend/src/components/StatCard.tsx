import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "primary" | "accent" | "success" | "warning";
}

const variantStyles = {
  default: "border-border/60",
  primary: "border-l-4 border-l-primary border-border/60",
  accent: "border-l-4 border-l-accent border-border/60",
  success: "border-l-4 border-l-success border-border/60",
  warning: "border-l-4 border-l-warning border-border/60",
};

const iconVariants = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/20 text-accent-foreground",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

export function StatCard({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) {
  return (
    <div className={`stat-card ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-display font-bold mt-1">{value}</p>
          {trend && <p className="text-xs text-success mt-1">{trend}</p>}
        </div>
        <div className={`p-3 rounded-lg ${iconVariants[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
