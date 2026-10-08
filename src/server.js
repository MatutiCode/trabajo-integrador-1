// server.js: punto de entrada. Conecta a la base de datos y levanta el servidor
// Importa la app configurada y la conexión a la BD
import dotenv from "dotenv";
import app from "./app.js";
import { connectDB, sequelize } from "./config/db.js";
// Se importan todos los modelos para que Sequelize los registre antes de sync() y pueda crear las tablas
import { Article } from "./models/article.model.js";
import { User } from "./models/user.model.js";
import { Profile } from "./models/profile.model.js";
import { Tag } from "./models/tag.model.js";
import { ArticleTag } from "./models/articletag.model.js";

dotenv.config();

// Puerto tomado del .env, o 3000 si no está definido
const PORT = process.env.PORT || 3000;

// Primero conecta a la BD, sincroniza las tablas y recién después levanta el servidor
const startServer = async () => {
  // Verifica la conexión con MySQL (si falla, corta el proceso)
  await connectDB();
  // Crea las tablas que no existan según los modelos (no modifica las ya existentes)
  await sequelize.sync();

  // Pone el servidor a escuchar peticiones en el puerto
  app.listen(PORT, () => {
    console.log(`Servidor corriento en http://localhost:${PORT}`);
  });
};

// Ejecuta todo el arranque
startServer();
