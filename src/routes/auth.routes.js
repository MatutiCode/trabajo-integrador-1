// Rutas de /api/auth (el prefijo se define en app.js). Los middlewares se ejecutan en orden y el último es el controlador
import { Router } from "express";
import {
  register,
  login,
  logout,
  getProfile,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  validateLogin,
  validateRegister,
} from "../middlewares/auth.validator.js";

// Router: mini-app de Express para agrupar las rutas de un recurso
const router = Router();

// POST /api/auth/register: primero valida el body y después ejecuta el controlador
router.post("/register", validateRegister, register);
// POST /api/auth/login: valida el body y loguea (genera la cookie con el token)
router.post("/login", validateLogin, login);
// GET /api/auth/profile: requiere estar logueado (authMiddleware)
router.get("/profile", authMiddleware, getProfile);
// POST /api/auth/logout: borra la cookie del token
router.post("/logout", logout);

// Se exporta para montarlo en app.js
export default router;
