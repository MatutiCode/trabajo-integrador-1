// Controlador de artículos: CRUD (crear, leer, actualizar y eliminar). next(error) manda los errores al middleware de errores de app.js
import { Article } from "../models/article.model.js";
import { User } from "../models/user.model.js";
import { Tag } from "../models/tag.model.js";

// CREATE: crea un artículo del usuario logueado
export const createArticle = async (req, res, next) => {
  try {
    // tags es un arreglo con los ids de las etiquetas
    const { title, content, tags } = req.body;
    // user_id sale de req.user (el usuario autenticado), no del body
    const article = await Article.create({
      title,
      content,
      user_id: req.user.id,
    });

    // setTags (método generado por belongsToMany) asocia las etiquetas guardándolas en article_tags
    if (tags && tags.length > 0) {
      await article.setTags(tags);
    }

    return res
      .status(201)
      .json({ message: "Artículo creado con éxito", article });
  } catch (error) {
    next(error);
  }
};

// READ ALL: lista todos los artículos
export const getArticles = async (req, res, next) => {
  try {
    // include trae datos relacionados (JOIN): el autor (sin password) y las etiquetas
    const articles = await Article.findAll({
      include: [
        { model: User, as: "author", attributes: ["id", "username", "email"] },
        { model: Tag, as: "tags", through: { attributes: [] } },
      ],
    });
    return res.status(200).json(articles);
  } catch (error) {
    next(error);
  }
};

// READ ONE: un artículo por id
export const getArticleById = async (req, res, next) => {
  try {
    // findByPk busca por clave primaria; req.params.id es el :id de la URL
    const article = await Article.findByPk(req.params.id, {
      include: [
        { model: User, as: "author", attributes: ["id", "username", "email"] },
        { model: Tag, as: "tags", through: { attributes: [] } },
      ],
    });

    // Si no existe responde 404
    if (!article)
      return res.status(404).json({ message: "Artículo no encontrado" });
    return res.status(200).json(article);
  } catch (error) {
    next(error);
  }
};

// UPDATE: edita un artículo
export const updateArticle = async (req, res, next) => {
  try {
    // id del artículo tomado de la URL
    const { id } = req.params;
    const { title, content, tags } = req.body;

    // Busca el artículo a editar
    const article = await Article.findByPk(id);
    if (!article)
      return res.status(404).json({ message: "Artículo no encontrado" });

    // Permiso: solo el autor o un admin puede modificarlo; si no, 403
    if (req.user.role !== "admin" && article.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para modificar este artículo" });
    }

    // Actualiza título y contenido
    await article.update({ title, content });

    // Reemplaza las etiquetas actuales por las nuevas
    if (tags) {
      await article.setTags(tags);
    }

    return res
      .status(200)
      .json({ message: "Artículo actualizado con éxito", article });
  } catch (error) {
    next(error);
  }
};

// DELETE: elimina un artículo (borrado lógico por paranoid; el hook del modelo Tag borra sus article_tags)
export const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article)
      return res.status(404).json({ message: "Artículo no encontrado" });

    // Mismo control de permisos: solo el autor o un admin
    if (req.user.role !== "admin" && article.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para eliminar este artículo" });
    }

    // destroy() hace borrado lógico (completa deleted_at) porque el modelo es paranoid
    await article.destroy();
    return res.status(200).json({ message: "Artículo eliminado con éxito" });
  } catch (error) {
    next(error);
  }
};
