// Funciones para crear y verificar tokens JWT
import jwt from "jsonwebtoken";

// Clave secreta usada para firmar los tokens (viene del .env)
const SECRET = process.env.JWT_SECRET || "secreto_por_defecto";

// Crea un token firmado con el payload (id y rol del usuario) que vence en 24 horas
export const generateToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: "24h" });
};

// Verifica la firma y el vencimiento; devuelve el payload o lanza error si el token no es válido
export const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};
