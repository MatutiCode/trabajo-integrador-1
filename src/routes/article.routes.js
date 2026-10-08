// Rutas de /api/articles (el prefijo se define en app.js). Los middlewares se ejecutan en orden y el último es el controlador
import { Router } from "express";
import {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from "../controllers/article.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  validateArticle,
  validateArticleId,
} from "../middlewares/article.validator.js";

// Router: mini-app de Express para agrupar las rutas de un recurso
const router = Router();

// POST /api/articles: crear artículo (requiere login y body válido)
router.post("/", authMiddleware, validateArticle, createArticle);
// GET /api/articles: listar todos los artículos (pública, no requiere login)
router.get("/", getArticles);
// GET /api/articles/:id: ver un artículo (pública); :id es un parámetro de la URL
router.get("/:id", validateArticleId, getArticleById);
// PUT /api/articles/:id: editar (login + id válido + body válido; el controlador verifica que sea el autor o admin)
router.put(
  "/:id",
  authMiddleware,
  validateArticleId,
  validateArticle,
  updateArticle,
);
// DELETE /api/articles/:id: eliminar (login + id válido; solo el autor o admin)
router.delete("/:id", authMiddleware, validateArticleId, deleteArticle);

// Se exporta para montarlo en app.js
export default router;
