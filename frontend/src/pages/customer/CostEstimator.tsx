import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator } from "lucide-react";
import { customerAPI } from "@/lib/api";

export default function CostEstimator() {
  const [area, setArea] = useState("");
  const [serviceType, setServiceType] = useState("House Cleaning");
  const [variant, setVariant] = useState("Standard");
  const [estimate, setEstimate] = useState<{ rate: number; estimate: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchEstimate = async (areaValue: string) => {
    setArea(areaValue);
    if (!areaValue || parseFloat(areaValue) <= 0) {
      setEstimate(null);
      return;
    }
    setLoading(true);
    try {
      const res = await customerAPI.getEstimate(parseFloat(areaValue), serviceType, variant);
      setEstimate(res.data);
    } catch {
      // Fallback to local calculation
      const rate = variant === "Deep Cleaning" ? 25 : variant === "Emergency" ? 35 : 18;
      setEstimate({ rate, estimate: Math.round(parseFloat(areaValue) * rate) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Cost Estimator</h2>
      <div className="max-w-lg">
        <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6 space-y-6">
          <div className="space-y-2">
            <Label>Service Type</Label>
            <Select value={serviceType} onValueChange={(v) => { setServiceType(v); if (area) fetchEstimate(area); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="House Cleaning">🏠 House Cleaning</SelectItem>
                <SelectItem value="Office Cleaning">🏢 Office Cleaning</SelectItem>
                <SelectItem value="Commercial Cleaning">🏭 Commercial Cleaning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Variant</Label>
            <Select value={variant} onValueChange={(v) => { setVariant(v); if (area) fetchEstimate(area); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Deep Cleaning">Deep Cleaning</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Floor Area (sq ft)</Label>
            <Input id="area" type="number" placeholder="e.g. 1200" value={area} onChange={(e) => fetchEstimate(e.target.value)} />
          </div>

          <div className="p-6 rounded-xl bg-primary/5 border border-primary/10 text-center">
            <Calculator className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Estimated Cost</p>
            <p className="text-4xl font-display font-bold text-primary mt-1">
              ₹{(estimate?.estimate || 0).toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Rate: ₹{estimate?.rate || 18} per sq ft
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
