import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "@/types";
import { authAPI } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (data: { fullName: string; email: string; username: string; password: string; role: UserRole; phone: string; address: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loginWithGoogle: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("cleanmate_token");
      if (token) {
        try {
          const response = await authAPI.getMe();
          const userData = response.data.user;
          setUser({
            id: userData._id,
            fullName: userData.fullName,
            email: userData.email,
            username: userData.username,
            role: userData.role,
            phone: userData.phone,
            address: userData.address,
            avatar: userData.avatar,
          });
        } catch {
          localStorage.removeItem("cleanmate_token");
          localStorage.removeItem("cleanmate_user");
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  // Handle Google OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token && window.location.pathname === "/auth/google/callback") {
      localStorage.setItem("cleanmate_token", token);
      authAPI.getMe().then((response) => {
        const userData = response.data.user;
        const user = {
          id: userData._id,
          fullName: userData.fullName,
          email: userData.email,
          username: userData.username,
          role: userData.role,
          phone: userData.phone,
          address: userData.address,
          avatar: userData.avatar,
        };
        setUser(user);
        localStorage.setItem("cleanmate_user", JSON.stringify(user));
        window.location.href = `/${userData.role}`;
      });
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authAPI.login(username, password);
      const { token, user: userData } = response.data;

      localStorage.setItem("cleanmate_token", token);
      const user = {
        id: userData._id,
        fullName: userData.fullName,
        email: userData.email,
        username: userData.username,
        role: userData.role,
        phone: userData.phone,
        address: userData.address,
        avatar: userData.avatar,
      };
      setUser(user);
      localStorage.setItem("cleanmate_user", JSON.stringify(user));
      return { success: true, message: "Login Successful" };
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed. Please try again.";
      return { success: false, message };
    }
  };

  const signup = async (data: { fullName: string; email: string; username: string; password: string; role: UserRole; phone: string; address: string }) => {
    try {
      await authAPI.signup(data);
      return { success: true, message: "Registration Successful" };
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      return { success: false, message };
    }
  };

  const loginWithGoogle = () => {
    window.location.href = authAPI.googleLoginUrl();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cleanmate_user");
    localStorage.removeItem("cleanmate_token");
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getMe();
      const userData = response.data.user;
      const newUser = {
        id: userData._id,
        fullName: userData.fullName,
        email: userData.email,
        username: userData.username,
        role: userData.role,
        phone: userData.phone,
        address: userData.address,
        avatar: userData.avatar,
      };
      setUser(newUser);
      localStorage.setItem("cleanmate_user", JSON.stringify(newUser));
    } catch {
      logout();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loginWithGoogle, refreshUser, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
