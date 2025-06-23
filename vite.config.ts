import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    // Replit specific plugins (only for development/Replit environment)
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      // Ajusta las rutas de alias si es necesario, asegúrate que '@/...' apunte a 'client/src'
      // Esto parece que intenta ir al directorio padre y luego a 'client/src'.
      // Si tu vite.config.ts está en client/vite.config.ts, y 'src' está en client/src,
      // entonces `path.resolve(__dirname, 'src')` o `path.resolve(import.meta.dirname, 'src')`
      // sería más directo si la 'root' es 'client'.
      // Dejaremos la configuración original, pero tenlo en cuenta si los alias fallan.
      "@": path.resolve(import.meta.dirname, "./src"), // <-- CORRECCIÓN: Si vite.config.ts está en client/, entonces src es './src'
      "@shared": path.resolve(import.meta.dirname, "../shared"), // <-- CORRECCIÓN: Si shared está un nivel arriba de client/
      "@assets": path.resolve(import.meta.dirname, "../attached_assets"), // <-- CORRECCIÓN: Si attached_assets está un nivel arriba de client/
    },
  },
  // Elimina 'root' o asegúrate de que sea el mismo directorio que el vite.config.ts si no lo necesitas.
  // 'root' es útil cuando el config no está en la raíz del proyecto.
  // Si tu repo tiene /client/vite.config.ts y /client/src, entonces la raíz de Vite es 'client'.
  // Al quitarlo, Vite asume que la raíz es donde está vite.config.ts.
  // root: path.resolve(import.meta.dirname, "client"), // <--- REMOVIDO/COMENTADO

  build: {
    // **** CORRECCIÓN CRÍTICA AQUÍ ****
    // `outDir` DEBE ser solo 'dist' dentro del contexto de 'client/'
    // Azure SWA espera 'dist' en la raíz de lo que le das en app_location.
    outDir: "dist", // <--- CORREGIDO: Cambiado a solo "dist"
    emptyOutDir: true, // Esto es bueno para limpiar antes de un nuevo build
    // Añadir la configuración para que las rutas de los assets sean correctas en el index.html generado
    assetsDir: 'assets', // Esto es el default, pero lo ponemos explícito
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash][extname]`
      }
    }
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  // Añade la base para producción para asegurar que las rutas se generen correctamente
  // '/' es el predeterminado y correcto para la raíz de un dominio/subdominio en SWA.
  base: '/', // <--- AÑADIDO/VERIFICADO
});
