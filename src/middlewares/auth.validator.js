// Reglas de validación (express-validator) para registro y login. Cada array se usa como middleware en la ruta
import { body } from "express-validator";
import { validateResult } from "./validate.middleware.js";

// Validaciones del registro: username, email y password
export const validateRegister = [
  // username: obligatorio, 3 a 20 caracteres, solo letras y números (trim() quita espacios de los costados)
  body("username")
    .trim()
    .notEmpty()
    .withMessage("el nombre de usuario es obligatorio")
    .isLength({ min: 3, max: 20 })
    .withMessage("el nombre de usuario debe tener entre 3 y 20 caracteres")
    .isAlphanumeric()
    .withMessage("el nombre de usuario solo puede contener letras y numeros"),
  // email: obligatorio y con formato válido
  body("email")
    .trim()
    .notEmpty()
    .withMessage("el email es obligatorio")
    .isEmail()
    .withMessage("debe ingresar un email valido"),
  // password: obligatoria, mínimo 8 caracteres, con mayúscula, minúscula y número (regex)
  body("password")
    .notEmpty()
    .withMessage("la contraseña es obligatoria")
    .isLength({ min: 8 })
    .withMessage("la contraseña debe tener almenos 8 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "la contraseña debe contener almenos una letra mayuscula, una minuscula y un numero",
    ),
  // Al final va siempre validateResult, que responde 400 si alguna regla falló
  validateResult,
];

// Validaciones del login: email válido y contraseña no vacía
export const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("el email es obligatorio")
    .isEmail()
    .withMessage("debe ingresar un email valide"),
  body("password").notEmpty().withMessage("la contraseña es obligatoria"),
  validateResult,
];
