import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Home as HomeIcon, Upload, Star, Settings as SettingsIcon, Search } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Import from "@/pages/import";
import Saved from "@/pages/saved";
import Settings from "@/pages/settings";
import AdminPage from "@/pages/admin";
import { usePreferences } from "@/hooks/use-preferences";

const queryClient = new QueryClient();

function AppHeader() {
  const [, setLocation] = useLocation();
  return (
    <div className="h-12 bg-card border-b border-card-border flex items-center justify-between px-4 sticky top-0 z-10 shrink-0">
      <h1 className="font-bold text-lg tracking-tight text-[var(--text-primary)]">
        UID <span className="text-[var(--primary)]">Operator</span>
      </h1>
      <button onClick={() => setLocation('/')} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
        <Search className="w-4 h-4" />
      </button>
    </div>
  );
}

function BottomNav() {
  const [location] = useLocation();

  const tabs = [
    { href: "/", icon: HomeIcon, label: "HOME" },
    { href: "/import", icon: Upload, label: "IMPORT" },
    { href: "/saved", icon: Star, label: "SAVED" },
    { href: "/settings", icon: SettingsIcon, label: "SETTINGS" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 border-t border-card-border bg-card/95 backdrop-blur-sm flex items-center justify-around px-2 z-50">
      {tabs.map((tab) => {
        const isActive = location === tab.href;
        const Icon = tab.icon;
        return (
          <Link key={tab.href} href={tab.href} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? "text-[var(--primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}>
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

function Router() {
  const [location] = useLocation();

  if (location === "/admin") {
    return <AdminPage />;
  }

  return (
    <div className="flex flex-col w-full min-h-[100dvh] max-w-md mx-auto bg-background shadow-2xl relative">
      <AppHeader />
      <main className="flex-1 overflow-y-auto pb-4">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/import" component={Import} />
          <Route path="/saved" component={Saved} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <BottomNav />
    </div>
  );
}

function App() {
  const { prefs } = usePreferences();

  useEffect(() => {
    if (prefs.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [prefs.theme]);

  useEffect(() => {
    document.documentElement.classList.remove("text-sm", "text-base", "text-lg");
    if (prefs.fontSize === "sm") document.documentElement.classList.add("text-sm");
    if (prefs.fontSize === "md") document.documentElement.classList.add("text-base");
    if (prefs.fontSize === "lg") document.documentElement.classList.add("text-lg");
  }, [prefs.fontSize]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="bg-background min-h-[100dvh]">
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
