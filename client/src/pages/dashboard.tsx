import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/ui/stats-card";
import { 
  CalendarCheck, 
  Armchair, 
  DollarSign, 
  Star, 
  Plus, 
  BarChart3, 
  Settings, 
  User 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Reservation } from "@shared/schema";

interface DashboardStats {
  todayReservations: number;
  availableTables: number;
  totalTables: number;
  revenue: number;
  satisfaction: number;
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: recentReservations, isLoading: reservationsLoading } = useQuery<Reservation[]>({
    queryKey: ["/api/dashboard/recent-reservations"],
  });

  if (statsLoading || reservationsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening at your restaurant today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Today's Reservations"
          value={stats?.todayReservations || 0}
          icon={CalendarCheck}
          trend="+12% from yesterday"
          trendColor="green"
          borderColor="border-primary"
          iconBgColor="bg-primary/10"
          iconColor="text-primary"
        />
        
        <StatsCard
          title="Available Tables"
          value={`${stats?.availableTables || 0}`}
          icon={Armchair}
          trend={`Out of ${stats?.totalTables || 0} total tables`}
          trendColor="gray"
          borderColor="border-green-500"
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        
        <StatsCard
          title="Revenue Today"
          value={`$${stats?.revenue || 0}`}
          icon={DollarSign}
          trend="+8% from last week"
          trendColor="green"
          borderColor="border-yellow-500"
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        
        <StatsCard
          title="Customer Satisfaction"
          value={stats?.satisfaction || 0}
          icon={Star}
          trend="Based on 127 reviews"
          trendColor="gray"
          borderColor="border-blue-500"
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Reservations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReservations?.length ? (
                recentReservations.map((reservation) => (
                  <div key={reservation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <User className="text-primary h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{reservation.customerName}</p>
                        <p className="text-sm text-gray-600">
                          Table {reservation.tableId} • {reservation.guests} guests • {reservation.time}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={reservation.status === 'confirmed' ? 'default' : 
                               reservation.status === 'pending' ? 'secondary' : 'destructive'}
                    >
                      {reservation.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent reservations</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button className="flex flex-col items-center justify-center p-6 h-auto bg-primary/10 text-primary hover:bg-primary/20" variant="ghost">
                <Plus className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">New Reservation</span>
              </Button>
              
              <Button className="flex flex-col items-center justify-center p-6 h-auto bg-green-100 text-green-600 hover:bg-green-200" variant="ghost">
                <Armchair className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Manage Tables</span>
              </Button>
              
              <Button className="flex flex-col items-center justify-center p-6 h-auto bg-blue-100 text-blue-600 hover:bg-blue-200" variant="ghost">
                <BarChart3 className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">View Reports</span>
              </Button>
              
              <Button className="flex flex-col items-center justify-center p-6 h-auto bg-purple-100 text-purple-600 hover:bg-purple-200" variant="ghost">
                <Settings className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
