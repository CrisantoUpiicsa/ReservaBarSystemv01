import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, AlertTriangle, Ban, DollarSign, Fish, Wine } from "lucide-react";
import { useInventoryItems } from "@/hooks/use-inventory";
import StatsCard from "@/components/ui/stats-card";

export default function Inventory() {
  const { data: inventory, isLoading } = useInventoryItems();

  const stats = inventory ? {
    totalItems: inventory.length,
    lowStock: inventory.filter(item => item.currentStock <= item.minimumStock).length,
    outOfStock: inventory.filter(item => item.currentStock === 0).length,
    totalValue: inventory.reduce((sum, item) => sum + (item.currentStock * parseFloat(item.unitPrice)), 0),
  } : null;

  const getStockStatus = (item: any) => {
    if (item.currentStock === 0) return { status: "Out of Stock", variant: "destructive" as const };
    if (item.currentStock <= item.minimumStock) return { status: "Low Stock", variant: "secondary" as const };
    return { status: "In Stock", variant: "default" as const };
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "seafood":
        return Fish;
      case "beverages":
        return Wine;
      default:
        return Package;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 h-32"></div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Monitor stock levels and manage supplies</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Inventory Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Items"
            value={stats.totalItems}
            icon={Package}
            borderColor="border-blue-500"
            iconBgColor="bg-blue-100"
            iconColor="text-blue-500"
          />
          
          <StatsCard
            title="Low Stock"
            value={stats.lowStock}
            icon={AlertTriangle}
            borderColor="border-orange-500"
            iconBgColor="bg-orange-100"
            iconColor="text-orange-500"
          />
          
          <StatsCard
            title="Out of Stock"
            value={stats.outOfStock}
            icon={Ban}
            borderColor="border-red-500"
            iconBgColor="bg-red-100"
            iconColor="text-red-500"
          />
          
          <StatsCard
            title="Total Value"
            value={`$${stats.totalValue.toLocaleString()}`}
            icon={DollarSign}
            borderColor="border-green-500"
            iconBgColor="bg-green-100"
            iconColor="text-green-500"
          />
        </div>
      )}

      {/* Inventory Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory?.length ? (
                  inventory.map((item) => {
                    const { status, variant } = getStockStatus(item);
                    const IconComponent = getCategoryIcon(item.category);
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <IconComponent className="text-gray-600 h-4 w-4" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm text-gray-500">{item.supplier || "No supplier"}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.currentStock} {item.unit}</TableCell>
                        <TableCell>{item.minimumStock} {item.unit}</TableCell>
                        <TableCell>${item.unitPrice}</TableCell>
                        <TableCell>
                          <Badge variant={variant}>{status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                            <Button size="sm" variant="outline">
                              Restock
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No inventory items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
