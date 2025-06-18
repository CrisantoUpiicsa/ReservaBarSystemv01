import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendColor?: "green" | "red" | "gray";
  borderColor?: string;
  iconBgColor?: string;
  iconColor?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendColor = "gray",
  borderColor = "border-primary",
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary",
}: StatsCardProps) {
  const trendColorClasses = {
    green: "text-green-600",
    red: "text-red-600",
    gray: "text-gray-600",
  };

  return (
    <Card className={`border-l-4 ${borderColor}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`${iconBgColor} p-3 rounded-full`}>
            <Icon className={`${iconColor} text-xl h-5 w-5`} />
          </div>
        </div>
        {trend && (
          <div className="mt-4">
            <span className={`text-sm font-medium ${trendColorClasses[trendColor]}`}>
              {trend}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
