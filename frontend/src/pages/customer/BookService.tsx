import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Zap, MapPin, Loader2 } from "lucide-react";
import { customerAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function BookService() {
  const [category, setCategory] = useState("");
  const [variant, setVariant] = useState("");
  const [emergency, setEmergency] = useState(false);
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Error", description: "Geolocation is not supported by your browser", variant: "destructive" });
      return;
    }

    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude: lat, longitude: lng } = position.coords;
          const res = await customerAPI.reverseGeocode(lat, lng);
          setAddress(res.data.formatted_address);
          toast({ title: "📍 Location Updated", description: "Your current address has been fetched." });
        } catch (error: any) {
          console.error("Reverse geocoding error:", error);
          const message = error.response?.data?.message || error.message || "Unknown error";
          toast({ 
            title: "Geolocation Error", 
            description: `${message}. Please enter your address manually if this persists.`, 
            variant: "destructive" 
          });
        } finally {
          setIsFetchingLocation(false);
        }
      },
      (error) => {
        setIsFetchingLocation(false);
        toast({ title: "Error", description: "Please enable location permissions", variant: "destructive" });
      }
    );
  };

  const handleBook = async () => {
    if (!category || !variant) {
      toast({ title: "Error", description: "Please select a service and variant", variant: "destructive" });
      return;
    }
    if (!date) {
      toast({ title: "Error", description: "Please select a date", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await customerAPI.createBooking({
        serviceType: category,
        variant,
        date,
        isEmergency: emergency,
        address: address || user?.address,
      });
      toast({ title: "✅ Booking Confirmed", description: `${category} - ${variant}${emergency ? " (Emergency)" : ""}` });
      setCategory("");
      setVariant("");
      setEmergency(false);
      setDate("");
      setAddress("");
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to create booking", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container animate-fade-in p-8 space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-display font-bold text-[#1a2e1a]">Book a Professional Service</h2>
        <p className="text-sm text-[#1a2e1a]/40 font-medium">Customized cleaning solutions for every space</p>
      </div>

      <div className="max-w-3xl">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-8 md:p-12 space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#97BC62]/10 rounded-bl-[4rem]" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-2">
              <Label className="text-[#1a2e1a] font-bold ml-1">Service Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-slate-50 border-slate-200 h-12 rounded-xl focus:ring-[#1a2e1a] capitalize font-semibold text-[#1a2e1a]">
                  <SelectValue placeholder="What needs cleaning?" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 rounded-xl">
                  <SelectItem value="House Cleaning" className="focus:bg-[#97BC62]/10 focus:text-[#1a2e1a]">🏠 House Cleaning</SelectItem>
                  <SelectItem value="Office Cleaning" className="focus:bg-[#97BC62]/10 focus:text-[#1a2e1a]">🏢 Office Cleaning</SelectItem>
                  <SelectItem value="Commercial Cleaning" className="focus:bg-[#97BC62]/10 focus:text-[#1a2e1a]">🏭 Commercial Cleaning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[#1a2e1a] font-bold ml-1">Service Intensity</Label>
              <Select value={variant} onValueChange={setVariant}>
                <SelectTrigger className="bg-slate-50 border-slate-200 h-12 rounded-xl focus:ring-[#1a2e1a] font-semibold text-[#1a2e1a]">
                  <SelectValue placeholder="Select intensity" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 rounded-xl">
                  <SelectItem value="Standard" className="focus:bg-[#97BC62]/10">Standard Clean</SelectItem>
                  <SelectItem value="Deep Cleaning" className="focus:bg-[#1a2e1a] focus:text-white">Deep Sanitization</SelectItem>
                  <SelectItem value="Emergency" className="focus:bg-amber-100 focus:text-amber-800">Swift Response</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 relative z-10">
            <Label className="text-[#1a2e1a] font-bold ml-1">Preferred Date</Label>
            <Input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              min={new Date().toISOString().split('T')[0]} 
              className="bg-slate-50 border-slate-200 h-12 rounded-xl focus:ring-[#1a2e1a] font-semibold text-[#1a2e1a]"
            />
          </div>

          <div className="space-y-2 relative z-10">
            <div className="flex items-center justify-between mb-1">
                <Label className="text-[#1a2e1a] font-bold ml-1">Service Address</Label>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-[11px] font-black uppercase tracking-wider text-[#97BC62] hover:text-[#1a2e1a] hover:bg-[#97BC62]/10 rounded-full"
                    onClick={fetchLocation}
                    disabled={isFetchingLocation}
                >
                    {isFetchingLocation ? <Loader2 className="h-3 w-3 animate-spin" /> : <MapPin className="h-3 w-3" />}
                    Detect Location
                </Button>
            </div>
            <Input 
              placeholder="Where should we clean?" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              className="bg-slate-50 border-slate-200 h-12 rounded-xl focus:ring-[#1a2e1a] font-semibold text-[#1a2e1a]"
            />
          </div>

          <div className={`group relative flex items-center justify-between p-6 rounded-3xl border-2 transition-all duration-300 ${emergency ? "border-amber-400 bg-amber-50" : "border-slate-100 bg-slate-50/50 hover:border-[#97BC62]/30"}`}>
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${emergency ? "bg-amber-400 text-white" : "bg-white text-slate-300 group-hover:text-[#97BC62]"}`}>
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <p className={`text-sm font-black uppercase tracking-tight ${emergency ? "text-amber-800" : "text-[#1a2e1a]"}`}>Emergency Priority</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Instant scheduling for urgent needs</p>
              </div>
            </div>
            <Switch 
              checked={emergency} 
              onCheckedChange={setEmergency} 
              className="data-[state=checked]:bg-amber-500"
            />
          </div>

          <Button 
            onClick={handleBook} 
            className="w-full h-14 gap-3 bg-[#1a2e1a] hover:bg-[#2C5F2D] text-white font-black text-lg rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50" 
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5 text-[#97BC62]" />}
            {isLoading ? "PROCESSING..." : "CONFIRM BOOKING"}
          </Button>
        </div>
      </div>
    </div>
  );
}
