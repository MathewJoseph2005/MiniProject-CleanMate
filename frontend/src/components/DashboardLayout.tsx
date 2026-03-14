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
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar - CleanMate Theme */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1a2e1a] text-white border-r border-white/10 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Logo Area */}
        <div className="flex items-center justify-center gap-3 pt-10 pb-8 border-b border-white/5">
          <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-lg overflow-hidden">
            <img src={logo} alt="CleanMate" className="h-8 w-8" />
          </div>
          <span className="text-2xl font-display font-bold tracking-tight text-white">
            CleanMate
          </span>
        </div>

        {/* User Profile Area */}
        <div className="px-6 py-8 flex flex-col items-center text-center border-b border-white/5">
          <div className="relative mb-4">
            <div className="h-20 w-20 rounded-full bg-white/5 border-2 border-white/20 shadow-2xl flex items-center justify-center text-xl font-bold text-white overflow-hidden p-1">
               <img src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.fullName || "U")}`} alt="Profile" className="h-full w-full object-cover rounded-full" />
            </div>
            <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-[#97BC62] border-4 border-[#1a2e1a]"></span>
          </div>
          <p className="text-md font-bold text-white truncate w-full">{user?.fullName}</p>
          <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mt-1">{user?.role}</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto no-scrollbar">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 group relative ${
                  isActive
                    ? "text-[#1a2e1a] bg-[#97BC62] shadow-lg shadow-[#97BC62]/20"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className={`${isActive ? "text-[#1a2e1a]" : "text-white/40 group-hover:text-white"} transition-colors`}>
                  {item.icon}
                </div>
                <span className="font-semibold">{item.label}</span>
                {isActive && (
                   <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#1a2e1a]" />
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Top Navbar */}
        <header className="h-[80px] bg-[#1a2e1a] border-b border-white/5 flex items-center justify-between px-8 shrink-0 relative z-10 shadow-xl">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-white/80 hover:text-white transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-display font-bold text-white tracking-wide">{title}</h1>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium hidden sm:block">Deep Cleaning Excellence</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="relative text-white/60 hover:text-white hover:bg-white/5 rounded-2xl h-11 w-11 transition-all">
              <Bell className="h-5 w-5" />
              <span className="absolute top-3 right-3 h-2 w-2 bg-[#97BC62] border-2 border-[#1a2e1a] rounded-full animate-pulse" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-3 pl-2 pr-5 h-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all shadow-inner">
                  <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 overflow-hidden shadow-lg">
                    <img src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.fullName || "U")}`} alt="Profile" className="h-full w-full object-cover" />
                  </div>
                  <div className="hidden sm:flex flex-col items-start gap-0">
                    <span className="text-sm font-bold leading-none">{user?.fullName?.split(' ')[0]}</span>
                    <span className="text-[9px] text-white/40 font-medium uppercase mt-0.5">Online</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-white/40" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 mt-3 rounded-2xl border-white/10 bg-[#1a2e1a] text-white shadow-2xl p-2">
                <div className="px-4 py-4 border-b border-white/5 mb-2">
                  <p className="text-sm font-bold truncate">{user?.fullName}</p>
                  <p className="text-xs text-white/40 truncate">{user?.email}</p>
                </div>
                <DropdownMenuItem className="gap-3 rounded-xl cursor-pointer hover:bg-white/5 focus:bg-white/5 focus:text-white p-3">
                  <User className="h-4 w-4 text-[#97BC62]" /> <span className="text-sm font-medium">Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5 my-2" />
                <DropdownMenuItem onClick={handleLogout} className="gap-3 rounded-xl cursor-pointer text-red-400 hover:bg-red-500/10 focus:bg-red-500/20 focus:text-red-400 p-3">
                  <LogOut className="h-4 w-4" /> <span className="text-sm font-medium">Log out Session</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar bg-slate-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}
