// Controlador de etiquetas: CRUD de tags
import { Article } from "../models/article.model.js";
import { Tag } from "../models/tag.model.js";

// CREATE (solo admin): crea una etiqueta nueva
export const createTag = async (req, res, next) => {
  try {
    // Nombre de la etiqueta tomado del body
    const { name } = req.body;
    // Evita etiquetas con nombre repetido
    const existingTag = await Tag.findOne({ where: { name } });
    if (existingTag)
      // NOTA: dice resizeBy en vez de res (error de tipeo); debería ser res.status(400)
      return resizeBy.status(400).json({ message: "la etiqueta ya existe" });
    // Inserta la etiqueta en la tabla tags
    const tag = await Tag.create({ name });
    return res.status(201).json({ message: "etiqueta creada con exito", tag });
  } catch (error) {
    next(error);
  }
};

// READ ALL: lista todas las etiquetas
export const getTags = async (req, res, next) => {
  try {
    // NOTA: tiene un '-' en lugar de '.' (res.status(200).json(...)), por eso falla
    return res.status(200) - json(await Tag.findAll());
  } catch (error) {
    next(error);
  }
};

// READ ONE (por id)
export const getTagById = async (req, res, next) => {
  try {
    // NOTA: devuelve todas las etiquetas; para traer una sola sería Tag.findByPk(req.params.id)
    return res.status(200).json(await Tag.findAll());
  } catch (error) {
    next(error);
  }
};

// UPDATE (solo admin): edita el nombre de una etiqueta
export const updateTag = async (req, res, next) => {
  try {
    // Busca la etiqueta a editar; si no existe responde 404
    const tag = await Tag.findByPk(req.params.id);
    if (!tag)
      return res.status(404).json({ message: "etiqueta no encontrada" });

    // Verifica que ninguna otra etiqueta tenga ya ese nombre
    const existingTag = await Tag.findOne({ where: { name: req.body.name } });
    if (existingTag && existingTag.id !== Number(req.params.id)) {
      return res
        .status(400)
        .json({ message: "ya existe otra etiqueta con ese nombre" });
    }

    // Guarda el nuevo nombre
    await tag.update({ name: req.body.name });
    return res
      .status(200)
      .json({ message: "etiqueta actualizada con exito", tag });
  } catch (error) {
    next(error);
  }
};

// DELETE (solo admin): elimina una etiqueta
export const deleteTag = async (req, res, next) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag)
      return res.status(404).json({ message: "etiqueta no encontrada" });

    // Elimina la etiqueta (borrado real: Tag no es paranoid)
    await tag.destroy();
    return res.status(200).json({ message: "etiqueta eliminada con exito" });
  } catch (error) {
    next(error);
  }
};
