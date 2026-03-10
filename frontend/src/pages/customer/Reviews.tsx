import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { customerAPI } from "@/lib/api";

export default function Reviews() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { toast({ title: "Error", description: "Please select a rating", variant: "destructive" }); return; }
    setIsLoading(true);
    try {
      await customerAPI.submitReview({ rating, comment: review });
      toast({ title: "✅ Review Submitted", description: "Thank you for your feedback!" });
      setRating(0);
      setReview("");
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to submit review", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <h2 className="page-header">Leave a Review</h2>
      <div className="max-w-lg">
        <div className="bg-card rounded-xl border border-border/60 shadow-soft p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s} type="button"
                    onMouseEnter={() => setHover(s)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(s)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star className={`h-7 w-7 ${s <= (hover || rating) ? "text-accent fill-accent" : "text-muted-foreground/30"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="review">Your Review</Label>
              <Textarea id="review" placeholder="Tell us about your experience..." rows={4} value={review} onChange={(e) => setReview(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
