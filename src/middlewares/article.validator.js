// Reglas de validación para artículos
import { body, param } from "express-validator";
import { validateResult } from "./validate.middleware.js";

// Validaciones del body para crear/editar un artículo
export const validateArticle = [
  // title: obligatorio, entre 3 y 100 caracteres
  body("title")
    .trim()
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isLength({ min: 3, max: 100 })
    .withMessage("El título debe tener entre 3 y 100 caracteres"),
  // content: obligatorio
  body("content").trim().notEmpty().withMessage("El contenido es obligatorio"),
  // tags: opcional, pero si viene debe ser un arreglo de ids
  body("tags")
    .optional()
    .isArray()
    .withMessage("Las etiquetas deben enviarse en un arreglo de IDs"),
  validateResult,
];

// Valida que el :id de la URL sea un entero positivo (param() lee de req.params, body() lee de req.body)
export const validateArticleId = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID del artículo debe ser un número entero válido"),
  validateResult,
];
