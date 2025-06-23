import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { MenuCategory, MenuItem, InsertMenuCategory, InsertMenuItem } from "@shared/schema";

// Define la URL base aquí ya que usa fetch directamente en useMenuCategories y useMenuItems.
const API_BASE_URL = process.env.REACT_APP_API_URL; // <--- AÑADIDO: Define la URL base

export function useMenuCategories() {
  return useQuery<MenuCategory[]>({
    queryKey: ["/api/menu/categories"],
    queryFn: async () => {
      // MODIFICACIÓN CLAVE AQUÍ: AÑADE API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/api/menu/categories`);
      if (!response.ok) throw new Error("Failed to fetch menu categories");
      return response.json();
    },
  });
}

export function useMenuItems(categoryId?: number) {
  const queryParams = categoryId ? `?categoryId=${categoryId}` : "";

  return useQuery<MenuItem[]>({
    queryKey: ["/api/menu/items", categoryId],
    queryFn: async () => {
      // MODIFICACIÓN CLAVE AQUÍ: AÑADE API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/api/menu/items${queryParams}`);
      if (!response.ok) throw new Error("Failed to fetch menu items");
      return response.json();
    },
  });
}

export function useCreateMenuCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: InsertMenuCategory) => {
      await apiRequest("POST", "/api/menu/categories", category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu/categories"] });
    },
  });
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: InsertMenuItem) => {
      await apiRequest("POST", "/api/menu/items", item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu/items"] });
    },
  });
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<InsertMenuItem> }) => {
      await apiRequest("PATCH", `/api/menu/items/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu/items"] });
    },
  });
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/menu/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu/items"] });
    },
  });
}