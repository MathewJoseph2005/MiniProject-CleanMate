import { createContext, useContext, useState, ReactNode } from "react";
import { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => { success: boolean; message: string };
  signup: (data: Omit<User, "id"> & { password: string }) => { success: boolean; message: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const mockUsers: (User & { password: string })[] = [
  { id: "1", fullName: "John Customer", username: "customer", password: "password", role: "customer", phone: "555-0101", address: "123 Main St" },
  { id: "2", fullName: "Sarah Agent", username: "agent", password: "password", role: "agent", phone: "555-0202", address: "456 Oak Ave" },
  { id: "3", fullName: "Mike Admin", username: "admin", password: "password", role: "admin", phone: "555-0303", address: "789 Pine Rd" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("cleanmate_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (username: string, password: string) => {
    const found = mockUsers.find((u) => u.username === username && u.password === password);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem("cleanmate_user", JSON.stringify(userData));
      return { success: true, message: "Login Successful" };
    }
    return { success: false, message: "Invalid credentials. Try customer/password, agent/password, or admin/password" };
  };

  const signup = (data: Omit<User, "id"> & { password: string }) => {
    const exists = mockUsers.find((u) => u.username === data.username);
    if (exists) return { success: false, message: "Username already exists" };
    return { success: true, message: "Registration Successful" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cleanmate_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
