// Modelo User: representa la tabla users
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js"

// sequelize.define(nombreDelModelo, columnas, opciones)
export const User = sequelize.define(
    "User",
    {
        // Clave primaria autoincremental
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        // Nombre de usuario: máximo 20 caracteres, obligatorio y único
        username: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        // Email: obligatorio y único
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        // Acá se guarda el hash de la contraseña (255 por el largo del hash de bcrypt)
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        // Rol del usuario: user o admin (por defecto user)
        role: {
            type: DataTypes.ENUM("user", "admin"),
            allowNull: false,
            defaultValue: "user",
        },

    },
    {
        // Opciones: tableName = nombre de la tabla; underscored = columnas en snake_case; paranoid = borrado lógico (deleted_at); timestamps = created_at y updated_at automáticos
        tableName: "users",
        underscored: true,
        paranoid: true,
        timestamps: true,
    }
);