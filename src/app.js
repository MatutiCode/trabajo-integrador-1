// app.js: configura la app de Express (middlewares y rutas). No levanta el servidor, eso lo hace server.js
// Importaciones: express (framework), cors, cookie-parser, dotenv y el router de cada recurso
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import tagRoutes from "./routes/tag.routes.js";
import userRoutes from "./routes/user.routes.js";
import articleRoutes from "./routes/article.routes.js";

// Carga las variables del archivo .env en process.env
dotenv.config();

// Crea la aplicación de Express
const app = express();

// CORS: permite que el frontend (Vite en localhost:5173) llame a la API; credentials:true permite enviar cookies
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// Lee las cookies de la request y las deja en req.cookies (ahí viene el token JWT)
app.use(cookieParser());
// Convierte el body JSON de la request en un objeto: req.body
app.use(express.json());
// Lo mismo, pero para formularios (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba para verificar que la API está funcionando
app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({ status: "ok", message: "API funcionando correctamente" });
});

// Monta cada router bajo su prefijo: /api/auth/login, /api/tags/..., etc.
app.use("/api/auth", authRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/users", userRoutes);
app.use("/api/articles", articleRoutes);

// Middleware 404: se ejecuta si ninguna ruta anterior coincidió
app.use((req, res) => {
  res.status(404).json({ message: "Recurso no encontrado" });
});

// Middleware de errores (4 parámetros): atrapa lo que los controladores pasan con next(error)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Error interno del servidor" });
});

// Se exporta para que server.js lo use
export default app;
