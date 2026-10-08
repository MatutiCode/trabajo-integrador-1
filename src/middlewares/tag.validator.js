// Reglas de validación para etiquetas (tags)
import { body, param } from "express-validator";
import { validateResult } from "./validate.middleware.js";

// Validaciones del body para crear/editar una etiqueta
export const validateTag = [
  // name: obligatorio, de 2 a 30 caracteres y sin espacios
  body("name")
    .trim()
    .notEmpty()
    .withMessage("el nombre de la etiqueta es obligatorio")
    .isLength({ min: 2, max: 30 })
    .withMessage("el nombre debe tener entre 2 a 30 caracteres")
    // custom(): validación propia; devuelve true solo si el valor no tiene espacios
    .custom((value) => !/\s/.test(value))
    .withMessage("el nombe de la etiqueta no debe contener espacios"),
  validateResult,
];

// Valida que el :id de la URL sea un entero positivo
export const validateTagId = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El id de la etiquta debe ser un número entero valido"),
  validateResult,
];
