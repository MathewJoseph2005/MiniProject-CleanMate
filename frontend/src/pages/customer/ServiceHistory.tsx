import { useState, useEffect } from "react";
import { customerAPI } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ServiceHistory() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    customerAPI.getBookings()
      .then((res) => setBookings(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="page-container animate-fade-in flex items-center justify-center py-20">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>;
  }

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Service History</h2>

      <div className="bg-card rounded-xl border border-border/60 shadow-soft overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">No bookings found</TableCell>
              </TableRow>
            )}
            {bookings.map((b) => (
              <TableRow key={b._id}>
                <TableCell>
                  <p className="font-medium text-sm">{b.serviceType}</p>
                  <p className="text-xs text-muted-foreground">{b.variant}</p>
                </TableCell>
                <TableCell className="text-sm">{new Date(b.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    b.status === "completed" ? "bg-success/10 text-success" :
                    b.status === "in-progress" ? "bg-info/10 text-info" :
                    b.status === "pending" ? "bg-warning/10 text-warning" :
                    "bg-primary/10 text-primary"
                  }`}>
                    {b.status}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">₹{b.amount.toLocaleString("en-IN")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
