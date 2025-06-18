import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/layout/navbar";
import Dashboard from "@/pages/dashboard";
import Reservations from "@/pages/reservations";
import Tables from "@/pages/tables";
import Menu from "@/pages/menu";
import Inventory from "@/pages/inventory";
import Reports from "@/pages/reports";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/reservations" component={Reservations} />
        <Route path="/tables" component={Tables} />
        <Route path="/menu" component={Menu} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/reports" component={Reports} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
