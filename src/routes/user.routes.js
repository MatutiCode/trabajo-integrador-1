// Rutas de /api/users (el prefijo se define en app.js). Los middlewares se ejecutan en orden y el último es el controlador
import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import {
  validateUserId,
  validateUpdateUser,
} from "../middlewares/user.validator.js";

// Router: mini-app de Express para agrupar las rutas de un recurso
const router = Router();

// GET /api/users: listar usuarios (solo admin)
router.get("/", authMiddleware, adminMiddleware, getUsers);
// GET /api/users/:id: ver un usuario (requiere login)
router.get("/:id", authMiddleware, validateUserId, getUserById);
// PUT /api/users/:id: editar usuario (el controlador permite solo al mismo usuario o a un admin)
router.put("/:id", authMiddleware, validateUpdateUser, updateUser);
// DELETE /api/users/:id: eliminar usuario (solo admin)
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateUserId,
  deleteUser,
);

// Se exporta para montarlo en app.js
export default router;
