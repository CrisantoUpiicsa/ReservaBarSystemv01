import { Link, useLocation } from "wouter";
import { 
  Calendar, 
  BarChart3, 
  UtensilsCrossed, 
  Package, 
  CalendarDays, 
  Home,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/reservations", label: "Reservations", icon: CalendarDays },
    { path: "/tables", label: "Tables", icon: Calendar },
    { path: "/menu", label: "Menu", icon: UtensilsCrossed },
    { path: "/inventory", label: "Inventory", icon: Package },
    { path: "/reports", label: "Reports", icon: BarChart3 },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <UtensilsCrossed className="text-primary text-2xl mr-3" />
              <span className="text-xl font-bold text-gray-900">ReservaBar</span>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.path;
                  return (
                    <Link key={item.path} href={item.path}>
                      <Button
                        variant="ghost"
                        className={`nav-btn ${isActive ? "active" : ""}`}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  3
                </Badge>
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">John Manager</p>
                <p className="text-xs text-gray-500">Manager</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                JM
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
