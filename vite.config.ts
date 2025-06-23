import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Importa 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // *** AÑADE ESTA SECCIÓN PARA RESOLVER EL ALIAS @/ ***
      '@': path.resolve(__dirname, './src'), // Asume que este archivo vite.config.ts está en 'client/'
                                             // y que tus componentes están en 'client/src'
      // Si tu vite.config.ts está en la raíz del monorepo, sería diferente.
      // Pero como estamos ejecutando la compilación DENTRO de client/, este es el path correcto.
    },
  },
  // Si tienes un problema con 'root', esta es la configuración para un proyecto de Vite dentro de un monorepo
  // root: path.resolve(__dirname, 'client'), // Generalmente no es necesario si app_location ya es /client
  // build: {
  //   outDir: 'dist', // Asegúrate de que esto coincida con output_location en tu YAML
  // },
});
