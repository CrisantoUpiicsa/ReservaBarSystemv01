import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar, Star, UtensilsCrossed } from "lucide-react";
import StatsCard from "@/components/ui/stats-card";

export default function Reports() {
  // Mock data for demonstration
  const reportsData = {
    salesReport: { value: 45231, trend: "+15% from last month" },
    reservations: { value: 342, trend: "+8% from last month" },
    satisfaction: { value: "4.8/5", trend: "Based on 284 reviews" },
    popularItems: [
      { name: "Grilled Salmon", orders: 147, revenue: 3675, change: "+12%" },
      { name: "Ribeye Steak", orders: 132, revenue: 4356, change: "+18%" },
      { name: "Pasta Carbonara", orders: 98, revenue: 1764, change: "+7%" },
    ],
    revenueData: [
      { period: "This Week", amount: 12567, percentage: 85 },
      { period: "Last Week", amount: 11432, percentage: 78 },
      { period: "This Month", amount: 45231, percentage: 92 },
      { period: "Last Month", amount: 39876, percentage: 81 },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">View detailed reports and analytics for your restaurant</p>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Sales Report"
          value={`$${reportsData.salesReport.value.toLocaleString()}`}
          icon={TrendingUp}
          trend={reportsData.salesReport.trend}
          trendColor="green"
          borderColor="border-green-500"
          iconBgColor="bg-green-100"
          iconColor="text-green-500"
        />
        
        <StatsCard
          title="Reservations"
          value={reportsData.reservations.value}
          icon={Calendar}
          trend={reportsData.reservations.trend}
          trendColor="green"
          borderColor="border-blue-500"
          iconBgColor="bg-blue-100"
          iconColor="text-blue-500"
        />
        
        <StatsCard
          title="Customer Satisfaction"
          value={reportsData.satisfaction.value}
          icon={Star}
          trend={reportsData.satisfaction.trend}
          trendColor="gray"
          borderColor="border-yellow-500"
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-500"
        />
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Items */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportsData.popularItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <UtensilsCrossed className="text-primary h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${item.revenue.toLocaleString()}</p>
                    <p className="text-sm text-green-600">{item.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportsData.revenueData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{item.period}</span>
                    <span className="font-bold text-gray-900">${item.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-green-600' : 
                        index === 1 ? 'bg-blue-600' : 
                        index === 2 ? 'bg-primary' : 'bg-gray-400'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
