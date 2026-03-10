import { ReactNode, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Bell, ChevronDown, LogOut, User } from "lucide-react";
import logo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarItem {
  label: string;
  icon: ReactNode;
  path: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  sidebarItems: SidebarItem[];
  title: string;
}

export function DashboardLayout({ children, sidebarItems, title }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar - Matching Image 1 Light Theme */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Logo Area */}
        <div className="flex items-center justify-center gap-3 pt-8 pb-6 border-b border-slate-100 dark:border-slate-800">
          <img src={logo} alt="CleanMate" className="h-8 w-8" />
          <span className="text-2xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
            CleanMate
          </span>
        </div>

        {/* User Profile Area - Matching Image 1 Sidebar top */}
        <div className="px-6 py-6 flex flex-col items-center text-center border-b border-slate-100 dark:border-slate-800">
          <div className="relative mb-3">
            <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white shadow-md flex items-center justify-center text-xl font-bold text-slate-700 dark:text-slate-300 overflow-hidden">
               <img src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.fullName || "U")}`} alt="Profile" className="h-full w-full object-cover" />
            </div>
            <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></span>
          </div>
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate w-full">{user?.fullName}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 capitalize font-medium">{user?.role}</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                  isActive
                    ? "text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-500 dark:bg-cyan-400 rounded-r-md"></div>
                )}
                <div className={`${isActive ? "text-blue-500 dark:text-cyan-400" : "text-slate-400 group-hover:text-slate-600"}`}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#0f172a]">
        {/* Top Navbar - Matching Image 1 Dark Header */}
        <header className="h-[72px] bg-[#0c1527] border-b border-[#1e293b] flex items-center justify-between px-6 shrink-0 relative z-10 shadow-md">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-300 hover:text-white transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-display font-semibold text-white tracking-wide">{title}</h1>
          </div>

          <div className="flex items-center gap-4">

            <Button variant="ghost" size="icon" className="relative text-slate-300 hover:text-white hover:bg-white/10 rounded-full h-10 w-10">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-pink-500 border-2 border-[#0c1527] rounded-full" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 pl-2 pr-4 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors">
                  <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center border border-white/20 overflow-hidden">
                    <img src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.fullName || "U")}`} alt="Profile" className="h-full w-full object-cover" />
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{user?.fullName?.split(' ')[0]}</span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="px-4 py-3 border-b border-border/50">
                  <p className="text-sm font-medium leading-none mb-1">{user?.fullName}</p>
                  <p className="text-xs text-muted-foreground leading-none">{user?.email}</p>
                </div>
                <div className="p-1">
                  <DropdownMenuItem className="gap-2 rounded-lg cursor-pointer">
                    <User className="h-4 w-4" /> Profile Details
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <div className="p-1">
                  <DropdownMenuItem onClick={handleLogout} className="gap-2 rounded-lg cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50">
                    <LogOut className="h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
