import { db } from "../db/db.mjs";
import bcrypt from 'bcrypt'
const saltRounds = 10


export const hashSenha = (senha) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(senha, salt)
}
