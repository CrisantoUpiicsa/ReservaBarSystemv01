import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Table, InsertTable } from "@shared/schema";

// Define la URL base aquí ya que usa fetch directamente en useTables.
const API_BASE_URL = process.env.REACT_APP_API_URL; // <--- AÑADIDO: Define la URL base

export function useTables() {
  return useQuery<Table[]>({
    queryKey: ["/api/tables"],
    queryFn: async () => {
      // MODIFICACIÓN CLAVE AQUÍ: AÑADE API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/api/tables`);
      if (!response.ok) throw new Error("Failed to fetch tables");
      return response.json();
    },
  });
}

export function useCreateTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (table: InsertTable) => {
      await apiRequest("POST", "/api/tables", table);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tables"] });
    },
  });
}

export function useUpdateTableStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PATCH", `/api/tables/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tables"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
  });
}