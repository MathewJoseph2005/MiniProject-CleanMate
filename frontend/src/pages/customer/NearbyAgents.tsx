import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { customerAPI } from "@/lib/api";
import { Agent } from "@/types";

export default function NearbyAgents() {
  const [sort, setSort] = useState("rating");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    customerAPI.getNearbyAgents()
      .then((res) => setAgents(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...agents].sort((a, b) => sort === "rating" ? b.rating - a.rating : b.completedJobs - a.completedJobs);

  if (loading) {
    return <div className="page-container animate-fade-in flex items-center justify-center py-20">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>;
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="page-header">Nearby Agents</h2>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Sort by Rating</SelectItem>
            <SelectItem value="jobs">Sort by Jobs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sorted.length === 0 && <p className="text-muted-foreground text-sm">No agents available at the moment.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((agent) => (
          <div key={agent.id} className="bg-card rounded-xl border border-border/60 shadow-soft p-5 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-display font-bold text-primary">
                {agent.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{agent.name}</p>
                <p className="text-xs text-muted-foreground">{agent.specialization}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${agent.available ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                {agent.available ? "Available" : "Busy"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-accent fill-accent" />
                <span className="font-medium">{agent.rating}</span>
              </div>
              <span className="text-muted-foreground">{agent.completedJobs} jobs</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
