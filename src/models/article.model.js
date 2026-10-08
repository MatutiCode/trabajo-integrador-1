// Modelo Article: representa la tabla articles
import { DataTypes, TableHints } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./user.model.js";

// Definición del modelo y sus columnas
export const Article = sequelize.define(
    "Article",
    {
        // Clave primaria autoincremental
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        // Título obligatorio (máximo 200 caracteres)
        title: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        // Contenido en TEXT (texto largo)
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        // Resumen opcional
        excerpt: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        // Estado del artículo: published o archived
        status: {
            type: DataTypes.ENUM("published", "archived"),
            allowNull: false,
            defaultValue: "published",
        },
        // Clave foránea: id del usuario autor
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        // Opciones: nombre de tabla, snake_case, borrado lógico (paranoid) y timestamps
        tableName: "articles",
        underscored: true,
        paranoid: true,
        timestamps: true,
    }
);

// Relación 1:N: un usuario tiene muchos artículos (as = alias que se usa luego en los include)
User.hasMany(Article, { foreignKey: "user_id", as: "articles"});
// Lado inverso: cada artículo pertenece a un usuario (el autor)
Article.belongsTo(User, { foreignKey: "user_id", as: "author"});