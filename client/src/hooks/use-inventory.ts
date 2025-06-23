import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { InventoryItem, InsertInventoryItem } from "@shared/schema";

// Define la URL base aquí ya que usa fetch directamente en useInventoryItems.
const API_BASE_URL = process.env.REACT_APP_API_URL; // <--- AÑADIDO: Define la URL base

export function useInventoryItems() {
  return useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory"],
    queryFn: async () => {
      // MODIFICACIÓN CLAVE AQUÍ: AÑADE API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/api/inventory`);
      if (!response.ok) throw new Error("Failed to fetch inventory items");
      return response.json();
    },
  });
}

export function useCreateInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: InsertInventoryItem) => {
      await apiRequest("POST", "/api/inventory", item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    },
  });
}

export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<InsertInventoryItem> }) => {
      await apiRequest("PATCH", `/api/inventory/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    },
  });
}

export function useDeleteInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/inventory/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    },
  });
}
