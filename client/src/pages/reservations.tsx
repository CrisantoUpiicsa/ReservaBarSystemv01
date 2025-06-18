import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, User } from "lucide-react";
import { useReservations, useUpdateReservationStatus, useDeleteReservation } from "@/hooks/use-reservations";
import { useTables } from "@/hooks/use-tables";
import ReservationModal from "@/components/modals/reservation-modal";
import { useToast } from "@/hooks/use-toast";

export default function Reservations() {
  const [filters, setFilters] = useState({
    date: "",
    status: "all",
    tableId: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: reservations, isLoading } = useReservations({
    date: filters.date || undefined,
    status: filters.status === "all" ? undefined : filters.status,
    tableId: filters.tableId ? parseInt(filters.tableId) : undefined,
  });

  const { data: tables } = useTables();
  const updateStatus = useUpdateReservationStatus();
  const deleteReservation = useDeleteReservation();

  const filteredReservations = reservations?.filter(reservation =>
    reservation.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reservation.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast({
        title: "Success",
        description: "Reservation status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reservation status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to cancel this reservation?")) {
      try {
        await deleteReservation.mutateAsync(id);
        toast({
          title: "Success",
          description: "Reservation cancelled successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to cancel reservation",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 h-32"></div>
          <div className="bg-white rounded-lg shadow-md p-6 h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reservations</h1>
          <p className="text-gray-600">Manage all customer reservations</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="mt-4 sm:mt-0">
          <Plus className="mr-2 h-4 w-4" />
          New Reservation
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="table">Table</Label>
              <Select value={filters.tableId} onValueChange={(value) => setFilters({ ...filters, tableId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Tables" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Tables</SelectItem>
                  {tables?.map((table) => (
                    <SelectItem key={table.id} value={table.id.toString()}>
                      Table {table.number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reservations Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.length > 0 ? (
                  filteredReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="text-primary h-4 w-4" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{reservation.customerName}</div>
                            <div className="text-sm text-gray-500">{reservation.customerEmail}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>Table {reservation.tableId}</TableCell>
                      <TableCell>{reservation.date} - {reservation.time}</TableCell>
                      <TableCell>{reservation.guests}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(reservation.status)}>
                          {reservation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {reservation.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(reservation.id, "confirmed")}
                              disabled={updateStatus.isPending}
                            >
                              Confirm
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(reservation.id)}
                            disabled={deleteReservation.isPending}
                          >
                            Cancel
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No reservations found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
