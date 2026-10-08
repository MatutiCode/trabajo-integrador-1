// Rutas de /api/tags (el prefijo se define en app.js). Los middlewares se ejecutan en orden y el último es el controlador
import { Router } from "express";
import {
  createTag,
  getTags,
  getTagById,
  updateTag,
  deleteTag,
} from "../controllers/tag.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { validateTag, validateTagId } from "../middlewares/tag.validator.js";

// Router: mini-app de Express para agrupar las rutas de un recurso
const router = Router();

// POST /api/tags: crear etiqueta (solo admin: authMiddleware + adminMiddleware)
router.post("/", authMiddleware, adminMiddleware, validateTag, createTag);
// GET /api/tags: listar etiquetas (requiere login)
router.get("/", authMiddleware, getTags);
// Intención: obtener una etiqueta por id (solo admin). NOTA: está definida con '/' igual que la anterior, por eso nunca se ejecuta; debería ser '/:id'
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  validateTag,
  validateTagId,
  getTagById,
);
// PUT /api/tags/:id: editar etiqueta (solo admin; valida body e id)
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateTag,
  validateTagId,
  updateTag,
);
// DELETE /api/tags/:id: eliminar etiqueta (solo admin). NOTA: validateTag exige body.name y en un DELETE no hay body, por eso devuelve 400
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateTag,
  validateTagId,
  deleteTag,
);

// Se exporta para montarlo en app.js
export default router;
