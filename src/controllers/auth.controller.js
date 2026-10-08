// Controlador de autenticación: lógica de registro, login, perfil y logout
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";
import { Profile } from "../models/profile.model.js";
import { User } from "../models/user.model.js";

// REGISTER: crea el usuario y su perfil vacío. Respuestas: 201 ok, 400 email repetido, 500 error
export const register = async (req, res) => {
    try {
        // Extrae los datos del body (ya validados por auth.validator)
        const { username, email, password } = req.body;

        // Verifica que el email no esté registrado
        const existingUser = await User.findOne({ where: { email }});
        if (existingUser) {
            return res.status(400).json({ message: "el email ya esta registrado"});
        }

        // Encripta la contraseña antes de guardarla
        const hasedPassword = await hashPassword(password);

        // Inserta el usuario en la tabla users
        const user = await User.create({
            username,
            email,
            password: hasedPassword,
        });

        // Crea el perfil vacío asociado al usuario (relación 1:1)
        await Profile.create({ user_id: user.id });

        // 201 = creado. Se devuelve el usuario sin la contraseña
        return res.status(201).json({
            message: "usuario registrado",
            user: { id: user.id, username: user.username, email: user.email},
        });
    } catch (error) {
        return res.status(500).json({ message: "error interno del servidor", error: error.message});
    }
};

// LOGIN: valida las credenciales y entrega el token en una cookie
export const login = async (req, res) => {
    try {
    const { email, password } = req.body;

    // Busca el usuario por email
    const user = await User.findOne({ where: { email } });
    // Mismo mensaje si el usuario no existe o la contraseña falla, para no revelar cuál fue el error
    if (!user) {
        return res.status(400).json({ message: "Credenciales inválidas" });
    }

    // Compara la contraseña ingresada con el hash guardado
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Credenciales inválidas" });
    }

    // Genera el JWT con el id y el rol del usuario
    const token = generateToken({ id: user.id, role: user.role });

    // Guarda el token en una cookie httpOnly (el JavaScript del navegador no puede leerla) que dura 24 h; secure:false porque se usa en http local
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Responde con los datos básicos del usuario (la sesión queda guardada en la cookie)
    return res.status(200).json({
        message: "Login exitoso",
        user: { id: user.id, username: user.username, role: user.role },
    });
    } catch (error) {
    return res.status(500).json({ message: "error interno del servidor", error: error.message });
    }
};

// PROFILE: devuelve el usuario logueado (authMiddleware ya lo puso en req.user). NOTA: incluye el hash del password
export const getProfile = async (req, res) => {
    try {
        return res.status(200).json({ user: req.user });
    }   catch (error) {
        return res.status(500).json({ message: "error al obtener el perfil", error: error.message});
    }

    
};

// LOGOUT: elimina la cookie del token
export const logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logout exitoso" });
};