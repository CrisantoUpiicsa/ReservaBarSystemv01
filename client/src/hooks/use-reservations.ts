import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Reservation, InsertReservation } from "@shared/schema";

export function useReservations(filters?: {
  date?: string;
  status?: string;
  tableId?: number;
}) {
  const queryParams = new URLSearchParams();
  if (filters?.date) queryParams.append("date", filters.date);
  if (filters?.status) queryParams.append("status", filters.status);
  if (filters?.tableId) queryParams.append("tableId", filters.tableId.toString());

  return useQuery<Reservation[]>({
    queryKey: ["/api/reservations", filters],
    queryFn: async () => {
      const url = `/api/reservations${queryParams.toString() ? `?${queryParams}` : ""}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch reservations");
      return response.json();
    },
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservation: InsertReservation) => {
      await apiRequest("POST", "/api/reservations", reservation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reservations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
  });
}

export function useUpdateReservationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PATCH", `/api/reservations/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reservations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
  });
}

export function useDeleteReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/reservations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reservations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
  });
}
