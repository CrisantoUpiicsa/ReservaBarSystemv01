import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Ban, Armchair } from "lucide-react";
import { useTables, useUpdateTableStatus } from "@/hooks/use-tables";
import { useToast } from "@/hooks/use-toast";
import type { Table } from "@shared/schema";

export default function Tables() {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const { data: tables, isLoading } = useTables();
  const updateTableStatus = useUpdateTableStatus();
  const { toast } = useToast();

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await updateTableStatus.mutateAsync({ id, status });
      toast({
        title: "Success",
        description: "Table status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update table status",
        variant: "destructive",
      });
    }
  };

  const getTableClasses = (status: string) => {
    switch (status) {
      case "available":
        return "table-available border-2";
      case "occupied":
        return "table-occupied border-2";
      case "reserved":
        return "table-reserved border-2";
      default:
        return "table-unavailable border-2";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "available":
        return "default";
      case "occupied":
        return "destructive";
      case "reserved":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 h-96"></div>
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6 h-48"></div>
              <div className="bg-white rounded-lg shadow-md p-6 h-48"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Table Management</h1>
        <p className="text-gray-600">View and manage restaurant table availability</p>
      </div>

      {/* Table Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Floor Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {tables?.map((table) => (
                  <div
                    key={table.id}
                    className={`table-item ${getTableClasses(table.status)} rounded-lg p-4 cursor-pointer transition-all ${
                      selectedTable?.id === table.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => handleTableClick(table)}
                  >
                    <div className="text-center">
                      <Armchair className="mx-auto mb-2 h-6 w-6" />
                      <p className="text-sm font-medium">Table {table.number}</p>
                      <p className="text-xs">{table.capacity} seats</p>
                      <Badge
                        variant={getStatusBadgeVariant(table.status)}
                        className="text-xs mt-1"
                      >
                        {table.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center space-x-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-300 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-300 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Reserved</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-300 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Occupied</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Table Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTable ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Table:</span>
                    <span>Table {selectedTable.number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Capacity:</span>
                    <span>{selectedTable.capacity} seats</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Location:</span>
                    <span>{selectedTable.location || "Main Floor"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <Badge variant={getStatusBadgeVariant(selectedTable.status)}>
                      {selectedTable.status}
                    </Badge>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-gray-600">
                      Click the action buttons below to manage this table.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Select a table to view details</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  New Reservation
                </Button>
                
                <Button variant="outline" className="w-full" disabled={!selectedTable}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Table
                </Button>
                
                {selectedTable && (
                  <>
                    {selectedTable.status === "available" && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleStatusUpdate(selectedTable.id, "occupied")}
                        disabled={updateTableStatus.isPending}
                      >
                        Mark as Occupied
                      </Button>
                    )}
                    
                    {selectedTable.status === "occupied" && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleStatusUpdate(selectedTable.id, "available")}
                        disabled={updateTableStatus.isPending}
                      >
                        Mark as Available
                      </Button>
                    )}
                    
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleStatusUpdate(selectedTable.id, "unavailable")}
                      disabled={updateTableStatus.isPending}
                    >
                      <Ban className="mr-2 h-4 w-4" />
                      Mark Unavailable
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
