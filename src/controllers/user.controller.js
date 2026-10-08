// Controlador de usuarios: listar, ver, editar y eliminar
import { User } from "../models/user.model.js";
import { Profile } from "../models/profile.model.js";
import { Article } from "../models/article.model.js";

// READ ALL (solo admin): lista los usuarios con su perfil
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      // exclude: no trae la columna password en la respuesta
      attributes: { exclude: ["password"] },
      // include trae el perfil asociado (JOIN)
      include: [{ model: Profile, as: "profile" }],
    });
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// READ ONE: un usuario con su perfil y sus artículos
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
      include: [
        { model: Profile, as: "profile" },
        { model: Article, as: "articles" },
      ],
    });
    // Si no existe responde 404
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// UPDATE: edita un usuario
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Permiso: solo el propio usuario o un admin pueden editar; si no, 403
    if (req.user.role !== "admin" && req.user.id !== Number(id)) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para modificar este perfil" });
    }

    // Busca el usuario a editar
    const user = await User.findByPk(id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // Actualiza con los datos del body. NOTA: usa req.body completo, conviene limitar los campos (por ejemplo para que no puedan cambiar role)
    await user.update(req.body);
    return res.status(200).json({ message: "Usuario actualizado con éxito" });
  } catch (error) {
    next(error);
  }
};

// DELETE (solo admin): intenta eliminar un usuario
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // NOTA: is_active no existe en el modelo, así que no cambia nada. Como User es paranoid, lo correcto sería user.destroy()
    await user.update({ is_active: false });
    return res.status(200).json({ message: "Usuario desactivado con éxito" });
  } catch (error) {
    next(error);
  }
};
