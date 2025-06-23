import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser, InsertUser, LoginCredentials, RegisterData } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginCredentials>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, RegisterData>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      // Asegúrate de que tu backend responde con el token directamente,
      // o con un objeto que contenga el token (ej. { user: ..., token: "..." }).
      // Si solo devuelve el objeto de usuario, y el token viene en un header,
      // la lógica sería diferente. Asumiremos que el JSON de respuesta contiene el token.
      const data = await res.json(); // <-- Obtén los datos completos de la respuesta
      return data; // <-- Devuelve los datos para onSuccess, incluyendo el token
    },
    onSuccess: (data: any) => { // <-- Cambiado de `user: SelectUser` a `data: any` temporalmente para acceder al token
      // LÍNEA CLAVE PARA AÑADIR/MODIFICAR:
      // Asume que tu backend devuelve un objeto como { user: SelectUser, token: string }
      if (data && data.token) {
        localStorage.setItem("auth_token", data.token);
        console.log("Token guardado en localStorage:", data.token); // Para depuración
      } else {
        console.warn("Login exitoso, pero no se encontró el token en la respuesta:", data);
      }

      // Luego, actualiza la caché de React Query con los datos del usuario
      // Asegúrate de que `data.user` sea el objeto `SelectUser` si tu backend lo devuelve anidado.
      queryClient.setQueryData(["/api/user"], data.user || data); // Ajusta según la estructura real de tu respuesta

      toast({
        title: "Welcome back!",
        description: `Logged in as ${data.user?.firstName || ''} ${data.user?.lastName || ''}`, // Accede a user si está anidado
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterData) => {
      const res = await apiRequest("POST", "/api/register", credentials);
      const data = await res.json(); // Obtén los datos completos
      // LÍNEA CLAVE PARA AÑADIR/MODIFICAR (si el registro también devuelve un token y quieres iniciar sesión automáticamente)
      if (data && data.token) {
        localStorage.setItem("auth_token", data.token);
        console.log("Token de registro guardado en localStorage:", data.token);
      }
      return data;
    },
    onSuccess: (data: any) => { // Cambiado de `user: SelectUser` a `data: any`
      queryClient.setQueryData(["/api/user"], data.user || data);
      toast({
        title: "Welcome to the bar!",
        description: `Account created for ${data.user?.firstName || ''} ${data.user?.lastName || ''}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
      localStorage.removeItem("auth_token"); // LÍNEA CLAVE: ELIMINAR TOKEN AL CERRAR SESIÓN
      console.log("Token eliminado de localStorage."); // Para depuración
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logged out",
        description: "See you next time!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}