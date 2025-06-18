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
    return `<span class="math-inline">\{displayHour\}\:</span>{minutes} ${ampm}`;
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
                          control={