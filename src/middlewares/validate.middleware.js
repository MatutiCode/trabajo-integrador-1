// Middleware que corta la request si alguna validación de express-validator falló
import { validationResult } from "express-validator";

// Se ejecuta siempre después de las reglas de validación
export const validateResult = (req, res, next) => {
  // Junta los errores que encontraron las reglas anteriores
  const errors = validationResult(req);
  // Si hay errores responde 400 con la lista; si no, continúa
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
