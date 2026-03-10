import { Booking, Agent, ChatContact, ChatMessage, Complaint, ServiceRequest } from "@/types";

export const mockBookings: Booking[] = [
  { id: "B001", serviceType: "House Cleaning", variant: "Deep Cleaning", date: "2026-02-20", status: "completed", amount: 250, customerId: "1", agentId: "2", customerName: "John Customer", agentName: "Sarah Agent" },
  { id: "B002", serviceType: "Office Cleaning", variant: "Standard", date: "2026-02-22", status: "in-progress", amount: 180, customerId: "1", agentId: "2", customerName: "John Customer", agentName: "Sarah Agent" },
  { id: "B003", serviceType: "Commercial Cleaning", variant: "Emergency", date: "2026-02-23", status: "pending", amount: 450, customerId: "1", customerName: "John Customer" },
  { id: "B004", serviceType: "House Cleaning", variant: "Standard", date: "2026-02-18", status: "completed", amount: 150, customerId: "1", agentId: "2", customerName: "John Customer", agentName: "Sarah Agent" },
  { id: "B005", serviceType: "Office Cleaning", variant: "Deep Cleaning", date: "2026-02-25", status: "approved", amount: 320, customerId: "4", agentId: "2", customerName: "Alice Smith", agentName: "Sarah Agent" },
];

export const mockAgents: Agent[] = [
  { id: "2", name: "Sarah Agent", rating: 4.8, available: true, specialization: "House Cleaning", completedJobs: 156 },
  { id: "5", name: "David Lee", rating: 4.6, available: true, specialization: "Office Cleaning", completedJobs: 89 },
  { id: "6", name: "Emma Wilson", rating: 4.9, available: false, specialization: "Commercial Cleaning", completedJobs: 203 },
  { id: "7", name: "James Brown", rating: 4.3, available: true, specialization: "House Cleaning", completedJobs: 67 },
  { id: "8", name: "Maria Garcia", rating: 4.7, available: true, specialization: "Deep Cleaning", completedJobs: 124 },
  { id: "9", name: "Robert Chen", rating: 4.5, available: false, specialization: "Emergency Cleaning", completedJobs: 45 },
];

export const mockContacts: ChatContact[] = [
  { id: "c1", name: "Sarah Agent", lastMessage: "Your booking is confirmed!", time: "10:30 AM", unread: 2 },
  { id: "c2", name: "David Lee", lastMessage: "I'll be there at 2 PM", time: "Yesterday", unread: 0 },
  { id: "c3", name: "Support Team", lastMessage: "How can we help?", time: "Feb 20", unread: 1 },
];

export const mockMessages: ChatMessage[] = [
  { id: "m1", text: "Hi, I'd like to confirm my booking for tomorrow", sender: "me", time: "10:25 AM" },
  { id: "m2", text: "Sure! Let me check the details.", sender: "other", time: "10:27 AM" },
  { id: "m3", text: "Your booking is confirmed! I'll arrive at 9 AM.", sender: "other", time: "10:28 AM" },
  { id: "m4", text: "Your booking is confirmed!", sender: "other", time: "10:30 AM" },
];

export const mockComplaints: Complaint[] = [
  { id: "CP001", subject: "Service Delay", description: "Agent arrived 2 hours late", status: "in-progress", date: "2026-02-19", userId: "1", userName: "John Customer" },
  { id: "CP002", subject: "Quality Issue", description: "Kitchen was not cleaned properly", status: "pending", date: "2026-02-21", userId: "4", userName: "Alice Smith" },
  { id: "CP003", subject: "Billing Error", description: "Charged twice for same service", status: "resolved", date: "2026-02-15", userId: "1", userName: "John Customer" },
];

export const mockServiceRequests: ServiceRequest[] = [
  { id: "SR001", customerName: "John Customer", serviceType: "House Cleaning", variant: "Deep Cleaning", date: "2026-02-24", status: "pending", address: "123 Main St" },
  { id: "SR002", customerName: "Alice Smith", serviceType: "Office Cleaning", variant: "Standard", date: "2026-02-25", status: "pending", address: "456 Business Ave" },
  { id: "SR003", customerName: "Bob Johnson", serviceType: "Commercial Cleaning", variant: "Emergency", date: "2026-02-23", status: "approved", address: "789 Commerce Dr" },
];
