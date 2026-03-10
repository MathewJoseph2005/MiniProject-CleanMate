import { mockBookings } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ServiceHistory() {
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
            {mockBookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell>
                  <p className="font-medium text-sm">{b.serviceType}</p>
                  <p className="text-xs text-muted-foreground">{b.variant}</p>
                </TableCell>
                <TableCell className="text-sm">{b.date}</TableCell>
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
