// Funciones para encriptar y comparar contraseñas con bcrypt (nunca se guarda la contraseña en texto plano)
import bcrypt from "bcrypt";

// Recibe la contraseña y devuelve el hash. genSalt(10) = 10 rondas de costo para generar la sal
export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};


// Compara la contraseña ingresada con el hash guardado; devuelve true o false
export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};