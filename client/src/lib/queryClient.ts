import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Define la URL base aquí. Esto leerá el valor de la variable de entorno.
const API_BASE_URL = process.env.REACT_APP_API_URL;

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string, // Esta 'url' es la ruta relativa (ej. "/api/reservations")
  data?: unknown | undefined,
): Promise<Response> {
  const token = localStorage.getItem("auth_token");
  const headers: HeadersInit = data ? { "Content-Type": "application/json" } : {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // **** CORRECCIÓN CLAVE AQUÍ ****
  // Construye la URL completa usando la API_BASE_URL
  const fullUrl = `${API_BASE_URL}${url}`;

  const res = await fetch(fullUrl, { // Usa la URL completa aquí
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });
  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // **** CORRECCIÓN CLAVE AQUÍ ****
    // queryKey[0] es la ruta relativa, así que también necesita la API_BASE_URL
    const fullUrl = `${API_BASE_URL}${queryKey[0] as string}`;

    const res = await fetch(fullUrl, { // Usa la URL completa aquí
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});