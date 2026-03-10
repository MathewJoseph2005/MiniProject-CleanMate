import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Sparkles, Shield, Clock, Droplets, ArrowRight, UserCheck, CheckCircle2 } from "lucide-react";
import logo from "@/assets/logo.svg";

const SERVICES = [
  { icon: Droplets, title: "Standard Cleaning", desc: "Regular house cleaning for a fresh and tidy home.", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: Sparkles, title: "Deep Cleaning", desc: "Thorough cleaning reaching every nook and cranny.", color: "text-purple-500", bg: "bg-purple-500/10" },
  { icon: Clock, title: "Emergency Cleaning", desc: "Immediate response for urgent cleaning needs.", color: "text-orange-500", bg: "bg-orange-500/10" },
  { icon: Shield, title: "Sanitization", desc: "Professional disinfection for a safe environment.", color: "text-green-500", bg: "bg-green-500/10" },
];

const EXPERTS = [
  { name: "Robert Fox", role: "Sr. Cleaner", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert" },
  { name: "Wade Warren", role: "Deep Clean Expert", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Wade" },
  { name: "Guy Hawkins", role: "Sanitization Pro", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guy" },
  { name: "Devon Lane", role: "Home Cleaner", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Devon" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="CleanMate" className="h-8 w-8" />
            <span className="text-2xl font-display font-bold text-primary">CleanMate</span>
          </div>

          <div className="hidden md:flex flex-1 justify-center gap-8">
            {['Home', 'About', 'Services', 'Features', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <span className="text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer hidden sm:block">Log in</span>
            </Link>
            <Link to="/signup">
              <Button className="rounded-full px-6 font-semibold shadow-md hover:shadow-lg transition-all">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-28">
        {/* HERO SECTION - Matching Figure 1 & 3 */}
        <section className="relative max-w-7xl mx-auto px-6 pt-12 pb-24 lg:pt-20 lg:pb-32 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 min-h-[85vh]">
          {/* Background decorative blob */}
          <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-50 transform translate-x-1/3 -translate-y-1/4"></div>

          <div className="flex-1 space-y-8 animate-fade-in relative z-10 w-full lg:w-auto text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-2 mx-auto lg:mx-0">
              <Sparkles className="h-4 w-4" /> Top Rated Cleaning Service
            </div>

            <h1 className="text-5xl lg:text-7xl font-display font-extrabold leading-[1.15] tracking-tight text-foreground">
              The <span className="text-primary relative inline-block">
                Professional
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-amber-400" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0 10 Q50 20 100 10" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span><br />
              Approach to Clean
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed mx-auto lg:mx-0">
              We provide premium, reliable service providers for your home. From deep cleaning to quick touch-ups, our vetted experts bring the shine back to your space.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start">
              <Link to="/signup?role=customer">
                <Button size="lg" className="rounded-full px-8 h-14 text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all w-full sm:w-auto">
                  Book Now
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base font-semibold border-2 bg-background/50 backdrop-blur-sm hover:bg-muted transition-all gap-2 w-full sm:w-auto group">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Play className="h-4 w-4 text-primary ml-0.5" />
                </div>
                Watch Video
              </Button>
            </div>

            <div className="flex items-center gap-4 pt-8 justify-center lg:justify-start">
              <div className="flex -space-x-3">
                {EXPERTS.slice(0, 4).map((expert, i) => (
                  <img key={i} src={expert.image} alt={expert.name} className="w-10 h-10 rounded-full border-2 border-background shadow-sm" />
                ))}
              </div>
              <div className="text-sm">
                <p className="font-bold text-foreground">220+ Members</p>
                <div className="flex items-center text-amber-400 text-xs">
                  {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 relative animate-slide-up lg:animate-fade-in mt-10 lg:mt-0">
            {/* The circular graphic from Figure 1 / Splash from Figure 3 */}
            <div className="relative w-full aspect-square max-w-[500px] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary via-primary/80 to-blue-400 rounded-full scale-95 shadow-2xl opacity-90 transform -rotate-6"></div>
              {/* Clean abstract shape/Blob */}

              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000&auto=format&fit=crop"
                alt="Professional Cleaner"
                className="absolute inset-0 w-full h-full object-cover rounded-full mix-blend-overlay opacity-80"
              />
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000&auto=format&fit=crop"
                alt="Professional Cleaner"
                className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] object-cover rounded-full shadow-inner z-10"
              />

              {/* Floating Cards (Figure 1 style) */}
              <div className="absolute top-1/4 -right-8 lg:-right-12 bg-card rounded-xl p-3 shadow-xl border border-border/50 flex items-center gap-3 animate-float z-20">
                <img src={EXPERTS[0].image} className="w-10 h-10 rounded-full bg-muted" alt="Expert" />
                <div>
                  <p className="text-sm font-bold">{EXPERTS[0].name}</p>
                  <p className="text-[10px] text-muted-foreground">5.0 ★★★★★</p>
                </div>
              </div>

              <div className="absolute bottom-1/4 -left-8 lg:-left-12 bg-card rounded-xl p-3 shadow-xl border border-border/50 flex items-center gap-3 animate-float-delayed z-20">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold">100% Guaranteed</p>
                  <p className="text-[10px] text-muted-foreground">Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section id="services" className="py-24 bg-slate-50/50 dark:bg-slate-900/50 border-y border-border/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Our Services</h2>
              <p className="text-muted-foreground">Comprehensive cleaning solutions tailored for your space. We ensure every corner sparkles.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SERVICES.map((s, i) => (
                <div key={i} className="bg-card p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-border/50 group text-center lg:text-left">
                  <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center mb-6 mx-auto lg:mx-0 group-hover:scale-110 transition-transform`}>
                    <s.icon className={`h-7 w-7 ${s.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Why CleanMate?</h2>
              <p className="text-muted-foreground">We stand apart by offering highly trained professionals and guaranteed satisfaction.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "A Cleaner Environment", img: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=800&auto=format&fit=crop", desc: "Eco-friendly products ensuring a safe home for families." },
                { title: "Professional Experts", img: "https://images.unsplash.com/photo-1628177142898-93e46e623666?q=80&w=800&auto=format&fit=crop", desc: "Vetted, trained, and background-checked staff." },
                { title: "Safety is Our Business", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop", desc: "Insured and bonded service for your complete peace of mind." }
              ].map((feat, i) => (
                <div key={i} className="group rounded-3xl overflow-hidden shadow-sm border border-border/50 bg-card hover:shadow-xl transition-all">
                  <div className="h-56 overflow-hidden">
                    <img src={feat.img} alt={feat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-8 text-center">
                    <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                    <p className="text-sm text-muted-foreground">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERT MEMBERS */}
        <section className="py-24 bg-primary/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-display font-bold gap-4">Our Expert Members</h2>
                <p className="text-muted-foreground mt-4 max-w-xl">Meet the professionals who make your home shine.</p>
              </div>
              <Button variant="outline" className="rounded-full">View All <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {EXPERTS.map((user, i) => (
                <div key={i} className="bg-card rounded-3xl p-6 text-center shadow-sm border border-border/50 hover:-translate-y-1 transition-transform">
                  <img src={user.image} alt={user.name} className="w-24 h-24 mx-auto rounded-full mb-4 bg-muted border-4 border-background shadow-md" />
                  <h3 className="text-lg font-bold">{user.name}</h3>
                  <p className="text-sm text-primary font-medium mb-4">{user.role}</p>
                  <div className="flex justify-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
                      <UserCheck className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <img src={logo} alt="CleanMate" className="h-8 w-8 brightness-0 invert" />
              <span className="text-2xl font-display font-bold text-white">CleanMate</span>
            </div>
            <p className="text-sm text-slate-400 mb-6">The professional approach to simple, eco-friendly, and reliable cleaning services.</p>
            <div className="flex gap-4">
              {/* Social icons placeholder */}
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer text-white">𝕏</div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer text-white">in</div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Services</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Services</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">House Cleaning</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Office Cleaning</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Deep Cleaning</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Sanitization</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Newsletter</h4>
            <p className="text-sm text-slate-400 mb-4">Subscribe to get the latest updates and offers.</p>
            <div className="flex">
              <input type="email" placeholder="Your email" className="bg-white/10 border-none rounded-l-lg px-4 py-2 w-full text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary" />
              <button className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-primary/90 transition-colors font-medium">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} CleanMate. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
