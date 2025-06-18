import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertReservationSchema, type InsertReservation, type MenuCategory, type MenuItem, type Table, type Reservation } from "@shared/schema";
import { queryClient, getQueryFn, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Wine, Users, MapPin, Calendar, Clock, Star, Gift } from "lucide-react";

export default function CustomerHome() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  const { data: menu = [], isLoading: menuLoading } = useQuery<(MenuCategory & { items: MenuItem[] })[]>({
    queryKey: ["/api/customer/menu"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: tables = [], isLoading: tablesLoading } = useQuery<Table[]>({
    queryKey: ["/api/customer/tables"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: reservations = [], isLoading: reservationsLoading } = useQuery<Reservation[]>({
    queryKey: ["/api/customer/reservations"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const reservationForm = useForm<InsertReservation>({
    resolver: zodResolver(insertReservationSchema),
    defaultValues: {
      date: "",
      time: "",
      guests: 2,
      tableId: undefined,
      customerPhone: "",
      specialRequests: "",
    },
  });

  const createReservationMutation = useMutation({
    mutationFn: async (data: InsertReservation) => {
      const res = await apiRequest("POST", "/api/customer/reservations", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customer/reservations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/customer/tables"] });
      setIsReservationOpen(false);
      reservationForm.reset();
      toast({
        title: "Reservation created!",
        description: "Your table has been reserved. We look forward to seeing you!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Reservation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onCreateReservation = (data: InsertReservation) => {
    createReservationMutation.mutate(data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Wine className="h-8 w-8 text-amber-600" />
              <div>
                <h1 className="text-xl font-semibold">Premium Bar</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Welcome, {user.firstName}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Gift className="h-4 w-4 text-amber-600" />
                <span>{user.loyaltyPoints} loyalty points</span>
              </div>
              <Button variant="outline" onClick={() => logoutMutation.mutate()}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="reservations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reservations">My Reservations</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="tables">Available Tables</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="reservations" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Reservations</h2>
              <Dialog open={isReservationOpen} onOpenChange={setIsReservationOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Calendar className="h-4 w-4 mr-2" />
                    New Reservation
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Make a Reservation</DialogTitle>
                    <DialogDescription>
                      Reserve your table at our premium bar. Choose your preferred time and area.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...reservationForm}>
                    <form onSubmit={reservationForm.handleSubmit(onCreateReservation)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={reservationForm.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={reservationForm.control}
                          name="time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={reservationForm.control}
                          name="guests"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Guests</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="1" 
                                  max="8" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={reservationForm.control}
                          name="tableId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Table</FormLabel>
                              <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Any available" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {tables.map((table) => (
                                    <SelectItem key={table.id} value={table.id.toString()}>
                                      Table {table.number} ({table.area.replace('_', ' ')}) - {table.capacity} seats
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={reservationForm.control}
                        name="customerPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" value={field.value || ""} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={reservationForm.control}
                        name="specialRequests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Special Requests</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Any special requests or dietary requirements..."
                                value={field.value || ""}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={createReservationMutation.isPending}
                      >
                        {createReservationMutation.isPending ? "Creating..." : "Reserve Table"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {reservationsLoading ? (
                <div className="text-center py-8">Loading your reservations...</div>
              ) : reservations.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No reservations yet</p>
                    <p className="text-sm text-gray-500">Make your first reservation to get started!</p>
                  </CardContent>
                </Card>
              ) : (
                reservations.map((reservation) => (
                  <Card key={reservation.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-600" />
                            <span className="font-medium">{reservation.date}</span>
                            <Clock className="h-4 w-4 text-gray-600 ml-4" />
                            <span>{formatTime(reservation.time)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-600" />
                            <span>{reservation.guests} guests</span>
                            {reservation.tableId && (
                              <>
                                <MapPin className="h-4 w-4 text-gray-600 ml-4" />
                                <span>Table {reservation.tableId}</span>
                              </>
                            )}
                          </div>
                          {reservation.specialRequests && (
                            <p className="text-sm text-gray-600 mt-2">
                              Special requests: {reservation.specialRequests}
                            </p>
                          )}
                        </div>
                        <Badge className={getStatusColor(reservation.status)}>
                          {reservation.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="menu" className="space-y-6">
            <h2 className="text-2xl font-bold">Our Menu</h2>
            {menuLoading ? (
              <div className="text-center py-8">Loading menu...</div>
            ) : (
              <div className="space-y-8">
                {menu.map((category) => (
                  <div key={category.id} className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold">{category.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{category.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.items.map((item) => (
                        <Card key={item.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {item.description}
                                </p>
                                {item.alcoholContent && (
                                  <p className="text-xs text-amber-600 mt-1">
                                    {item.alcoholContent}% ABV
                                  </p>
                                )}
                                {item.ingredients && item.ingredients.length > 0 && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {item.ingredients.join(", ")}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <span className="font-semibold text-lg">${item.price}</span>
                                {item.preparationTime && (
                                  <p className="text-xs text-gray-500">
                                    {item.preparationTime} min
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="tables" className="space-y-6">
            <h2 className="text-2xl font-bold">Available Tables</h2>
            {tablesLoading ? (
              <div className="text-center py-8">Loading tables...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tables.map((table) => (
                  <Card key={table.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Table {table.number}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {table.area.replace('_', ' ').toUpperCase()} Area
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Up to {table.capacity} guests
                          </p>
                          {table.location && (
                            <p className="text-xs text-gray-500 mt-1">
                              {table.location}
                            </p>
                          )}
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          Available
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-2xl font-bold">My Profile</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-semibold text-amber-800">
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{user.firstName} {user.lastName}</h3>
                    <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
                    <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">{user.loyaltyPoints}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Loyalty Points</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{user.totalVisits}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Visits</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}