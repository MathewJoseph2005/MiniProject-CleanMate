export type UserRole = "customer" | "agent" | "admin";

export interface User {
  id: string;
  fullName: string;
  username: string;
  role: UserRole;
  phone: string;
  address: string;
  avatar?: string;
}

export interface Booking {
  id: string;
  serviceType: string;
  variant: string;
  date: string;
  status: "pending" | "approved" | "in-progress" | "completed" | "rejected";
  amount: number;
  customerId: string;
  agentId?: string;
  customerName?: string;
  agentName?: string;
}

export interface Agent {
  id: string;
  name: string;
  rating: number;
  available: boolean;
  specialization: string;
  completedJobs: number;
  avatar?: string;
}

export interface ChatContact {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
}

export interface Complaint {
  id: string;
  subject: string;
  description: string;
  status: "pending" | "in-progress" | "resolved";
  date: string;
  userId: string;
  userName?: string;
}

export interface ServiceRequest {
  id: string;
  customerName: string;
  serviceType: string;
  variant: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  address: string;
}
