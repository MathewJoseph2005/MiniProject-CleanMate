import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

export default function CostEstimator() {
  const [area, setArea] = useState("");
  const rate = 18; // ₹18 per sq ft (demo)
  const cost = area ? (parseFloat(area) * rate).toFixed(2) : "0.00";

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Cost Estimator</h2>
      <div className="max-w-lg">
        <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="area">Floor Area (sq ft)</Label>
            <Input id="area" type="number" placeholder="e.g. 1200" value={area} onChange={(e) => setArea(e.target.value)} />
          </div>

          <div className="p-6 rounded-xl bg-primary/5 border border-primary/10 text-center">
            <Calculator className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Estimated Cost</p>
            <p className="text-4xl font-display font-bold text-primary mt-1">₹{Number(cost).toLocaleString("en-IN")}</p>
            <p className="text-xs text-muted-foreground mt-2">Rate: ₹18 per sq ft (demo)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
