// Modelo Profile: datos extra del usuario (relación 1:1 con User)
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./user.model.js";

// Definición del modelo y sus columnas
export const Profile = sequelize.define(
    "Profile",
    {
        // Clave primaria autoincremental
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        // Clave foránea única: cada usuario tiene un solo perfil
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        // Nombre (opcional)
        first_name: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        // Apellido (opcional)
        last_name: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        // Biografía en texto largo (opcional)
        biography: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        // URL de la foto de perfil (opcional)
        avatar_url: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        // Fecha de nacimiento, solo fecha sin hora (opcional)
        birth_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
    },
    {
        // Opciones: nombre de tabla, snake_case y timestamps
        tableName: "profiles",
        underscored: true,
        timestamps: true,
    }
);

// Relación 1:1: un usuario tiene un perfil
User.hasOne(Profile, { foreignKey: "user_id", as: "profile"});
// Lado inverso: el perfil pertenece a un usuario
Profile.belongsTo(User, { foreignKey: "user_id", as: "user"});
