import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Zap } from "lucide-react";

export default function BookService() {
  const [category, setCategory] = useState("");
  const [variant, setVariant] = useState("");
  const [emergency, setEmergency] = useState(false);
  const { toast } = useToast();

  const handleBook = () => {
    if (!category || !variant) {
      toast({ title: "Error", description: "Please select a service and variant", variant: "destructive" });
      return;
    }
    toast({ title: "✅ Booking Confirmed", description: `${category} - ${variant}${emergency ? " (Emergency)" : ""}` });
  };

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Book a Service</h2>

      <div className="max-w-2xl">
        <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6 space-y-6">
          <div className="space-y-2">
            <Label>Service Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="House Cleaning">🏠 House Cleaning</SelectItem>
                <SelectItem value="Office Cleaning">🏢 Office Cleaning</SelectItem>
                <SelectItem value="Commercial Cleaning">🏭 Commercial Cleaning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Service Variant</Label>
            <Select value={variant} onValueChange={setVariant}>
              <SelectTrigger><SelectValue placeholder="Select variant" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Deep Cleaning">Deep Cleaning</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`flex items-center justify-between p-4 rounded-lg border transition-all ${emergency ? "border-warning bg-warning/5" : "border-border/40"}`}>
            <div className="flex items-center gap-3">
              <Zap className={`h-5 w-5 ${emergency ? "text-warning" : "text-muted-foreground"}`} />
              <div>
                <p className="text-sm font-medium">Emergency Service</p>
                <p className="text-xs text-muted-foreground">Priority handling with faster response</p>
              </div>
            </div>
            <Switch checked={emergency} onCheckedChange={setEmergency} />
          </div>

          <Button onClick={handleBook} className="w-full gap-2">
            <CheckCircle className="h-4 w-4" /> Confirm Booking
          </Button>
        </div>
      </div>
    </div>
  );
}
