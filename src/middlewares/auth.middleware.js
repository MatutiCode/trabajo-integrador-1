// Middleware de autenticación: verifica que el usuario esté logueado antes de llegar al controlador
import { verifyToken } from "../helpers/jwt.helper.js";
import { User } from "../models/user.model.js";

// next() pasa al siguiente middleware/controlador; res corta la request con una respuesta
export const authMiddleware = async (req, res, next) => {
  try {
    // Busca el token en la cookie o, si no está, en el header Authorization: Bearer <token>
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    // Sin token = no autenticado (401)
    if (!token) {
      return res
        .status(401)
        .json({ message: "No autenticado, token faltante" });
    }

    // Verifica el token y obtiene el payload { id, role }
    const decoded = verifyToken(token);

    // Si el token no trae id se considera inválido
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Token inválido o malformado" });
    }

    // Confirma que el usuario todavía existe en la base de datos
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Usuario no encontrado o no válido" });
    }

    // Guarda el usuario en req.user para que lo usen los siguientes controladores
    req.user = user;
    // Todo OK: continúa con la siguiente función de la ruta
    next();
  // Cualquier fallo al verificar (token vencido o falsificado) responde 401
  } catch (error) {
    console.error("Error en authMiddleware:", error.message);
    return res.status(401).json({ message: "token invalido o expirado" });
  }
};
