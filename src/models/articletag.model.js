// Tabla intermedia de la relación N:M entre articles y tags (cada fila = un artículo con una etiqueta)
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

// Definición del modelo y sus columnas
export const ArticleTag = sequelize.define(
    "ArticleTag",
    {
        // Clave primaria autoincremental
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        // Id del artículo
        article_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        // Id de la etiqueta
        tag_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        // Opciones: nombre de tabla, snake_case y timestamps
        tableName: "article_tags",
        underscored: true,
        timestamps: true,
    }
);