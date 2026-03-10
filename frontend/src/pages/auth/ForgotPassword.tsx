import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle } from "lucide-react";
import logo from "@/assets/logo.svg";
import { authAPI } from "@/lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
    } catch {
      setSent(true); // Show success anyway to prevent email enumeration
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/40 to-background">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <img src={logo} alt="CleanMate" className="h-8 w-8" />
            <span className="text-3xl font-display font-bold text-primary">
              CleanMate
            </span>
          </div>
          <p className="text-muted-foreground">Reset your password</p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg border border-border/60 p-8">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-display font-semibold text-lg mb-2">
                Reset Link Sent!
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Check your email for password reset instructions.
              </p>
              <Link to="/login">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Username or Email</Label>
                <Input
                  id="email"
                  placeholder="Enter your username or email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to Login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}