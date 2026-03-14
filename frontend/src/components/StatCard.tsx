import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "primary" | "accent" | "success" | "warning";
}

const bgGradients = {
  default: "from-white to-slate-50 text-[#1a2e1a]",
  primary: "from-[#1a2e1a] to-[#2C5F2D] text-white",
  accent: "from-[#97BC62] to-[#88ac54] text-[#1a2e1a]",
  success: "from-emerald-600 to-teal-500 text-white",
  warning: "from-amber-500 to-orange-400 text-white",
};

const topBorders = {
  default: "border-slate-100",
  primary: "border-[#1a2e1a]",
  accent: "border-[#97BC62]",
  success: "border-emerald-500",
  warning: "border-amber-400",
};

export function StatCard({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none overflow-hidden relative group transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1`}>
      {/* Top Accent Line */}
      <div className={`absolute top-0 left-0 right-0 border-t-4 ${topBorders[variant]} opacity-70 group-hover:opacity-100 transition-opacity`}></div>
      
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
            <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
            {trend && <p className="text-sm font-medium text-emerald-500 mt-2 flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> {trend}</p>}
          </div>
          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${bgGradients[variant]} shadow-lg shadow-${variant}/20 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
             <Icon className="h-6 w-6 relative z-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
