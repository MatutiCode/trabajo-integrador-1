// Middleware de autorización: solo deja pasar a usuarios con rol admin. Va siempre DESPUÉS de authMiddleware (necesita req.user)
export const adminMiddleware = (req, res, next) => {
    // Si es admin continúa; si no, responde 403 (acceso prohibido)
    if(req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "acceso denegado"});
    }
};