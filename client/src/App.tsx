import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import Navbar from "@/components/layout/navbar";
import Dashboard from "@/pages/dashboard";
import Reservations from "@/pages/reservations";
import Tables from "@/pages/tables";
import Menu from "@/pages/menu";
import Inventory from "@/pages/inventory";
import Reports from "@/pages/reports";
import CustomerHome from "@/pages/customer-home";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show auth page for protected routes
  if (!user) {
    return (
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <Route>
          <AuthPage />
        </Route>
      </Switch>
    );
  }

  // Customer interface for regular users
  if (user.role === "customer") {
    return (
      <Switch>
        <Route path="/" component={CustomerHome} />
        <Route path="/auth" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Staff/Manager interface
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Switch>
        <ProtectedRoute path="/" component={Dashboard} requireRole="staff" />
        <ProtectedRoute path="/reservations" component={Reservations} requireRole="staff" />
        <ProtectedRoute path="/tables" component={Tables} requireRole="staff" />
        <ProtectedRoute path="/menu" component={Menu} requireRole="staff" />
        <ProtectedRoute path="/inventory" component={Inventory} requireRole="staff" />
        <ProtectedRoute path="/reports" component={Reports} requireRole="staff" />
        <Route path="/auth" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
