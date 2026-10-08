// Modelo Tag: etiquetas que se pueden asignar a los artículos (relación N:M con Article)
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Article } from "./article.model.js";
import { ArticleTag } from "./articletag.model.js";

// Definición del modelo y sus columnas
export const Tag = sequelize.define(
    "Tag",
    {
        // Clave primaria autoincremental
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        // Nombre de la etiqueta: único, máximo 30 caracteres
        name: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        },
    },
    {
        // Opciones: nombre de tabla, snake_case y timestamps
        tableName: "tags",
        underscored: true,
        timestamps: true,
    }
);

// Relación N:M: un artículo tiene muchas etiquetas y una etiqueta está en muchos artículos. 'through' es la tabla intermedia (article_tags); foreignKey apunta a este modelo y otherKey al otro
Article.belongsToMany(Tag, {
    through: ArticleTag,
    foreignKey: "article_id",
    otherKey: "tag_id",
    as: "tags",
});
// Lado inverso de la relación N:M
Tag.belongsToMany(Article, {
    through: ArticleTag,
    foreignKey: "tag_id",
    otherKey: "article_id",
    as: "articles",
});

// Relaciones directas con la tabla intermedia (permiten consultar o borrar sus filas)
Article.hasMany(ArticleTag, { foreignKey: "article_id", as: "articleTags" });
ArticleTag.belongsTo(Article, { foreignKey: "article_id", as: "article" });

Tag.hasMany(ArticleTag, { foreignKey: "tag_id", as: "articleTags" });
ArticleTag.belongsTo(Tag, { foreignKey: "tag_id", as: "tag" });

// Hook: antes de eliminar un artículo borra sus filas en article_tags para no dejar registros huérfanos
Article.addHook("beforeDestroy", async (article, options) => {
    await ArticleTag.destroy({
    where: { article_id: article.id },
    transaction: options.transaction,
    });
});