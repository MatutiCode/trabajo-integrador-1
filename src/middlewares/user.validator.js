// Reglas de validación para usuarios
import { body, param } from "express-validator";
import { validateResult } from "./validate.middleware.js";

// Valida que el :id de la URL sea un entero positivo
export const validateUserId = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("el id de usuario debe ser un numero entero valido"),
  validateResult,
];

// Validaciones para actualizar un usuario: los campos son opcionales, pero si vienen deben ser válidos
export const validateUpdateUser = [
  // Reutiliza la validación del id definida arriba
  validateUserId,
  // username (opcional): 3 a 20 caracteres, solo letras y números
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage(" el nombre de usuario debe tener entre 3 a 20 caracteres")
    .isAlphanumeric()
    .withMessage("el nombre de usuario solo puede contener letras y numeros"),
  // email (opcional): con formato válido
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("debe ingresar un email valido"),
  validateResult,
];
