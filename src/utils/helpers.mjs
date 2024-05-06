import { db } from "../db/db.mjs";
import bcrypt from 'bcrypt'
const saltRounds = 10



export const handleError = (res, err, errCode = 200) => {
    res.status(errCode).json({ error: err });
}
// ------------------------------

export const queryDb = async (query, dados) => {
    const formattedQuery = formatQuery(query, dados);
    return new Promise((resolve, reject) => {
        db.query(formattedQuery, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });                 
}                           

export const formatQuery = (query, values) => {
    return query.replace(/\?/g, () => {
        const value = values.shift();
        return typeof value === 'string' ? `'${value}'` : value;
    });
}

export const hashSenha = (senha) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(senha, salt)
}