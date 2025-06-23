import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from "cors"; // <--- AÑADIDO: Importa el paquete 'cors'
import { setupAuth } from "./auth"; // <--- AÑADIDO: Importa setupAuth desde auth.ts

const app = express();

// *** AÑADIDO: CONFIGURACIÓN DE CORS ***
// Asegúrate de que esta configuración de CORS esté ANTES de app.use(express.json())
// y antes de cualquier ruta o middleware de autenticación.
app.use(cors({
  origin: [
    'http://localhost:5173', // O el puerto que use tu frontend React localmente (comúnmente 3000 o 5173 con Vite)
    'https://yellow-sea-0462af710.2.azurestaticapps.net' // <--- ¡MUY IMPORTANTE! Reemplaza con la URL REAL de tu Azure Static Web App
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Define los métodos HTTP permitidos
  credentials: true, // Esto es CRUCIAL para permitir el envío de cookies/sesiones (usadas por Passport.js)
  optionsSuccessStatus: 204 // Código de estado para solicitudes OPTIONS de pre-vuelo exitosas
}));
// *** FIN DE LA CONFIGURACIÓN DE CORS ***


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// AÑADIDO: Configura la autenticación (normalmente va después de los parsers de body y antes de las rutas API)
setupAuth(app); 


app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Asegúrate de que registerRoutes configura tus rutas API
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    // Es importante NO hacer throw err; aquí en un middleware de errores global,
    // ya que Express lo maneja y un throw aquí podría causar un crash si no se atrapa.
    // Simplemente registra el error si es necesario.
    // console.error(err); // Considera registrar el error para depuración en producción
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = process.env.PORT || 5000; // Azure App Service generalmente espera que escuches en el puerto 8080 o el PORT de la variable de entorno
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
