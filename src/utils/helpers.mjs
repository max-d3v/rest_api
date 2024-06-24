import { db } from "../db/db.mjs";
import bcrypt from 'bcrypt'
const saltRounds = 10


export const hashSenha = (senha) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(senha, salt)
}

export const FindQuadroBicicleta = (altura_interessado_cm) => {    
    var selectedQuadro;
    if (altura_interessado_cm >= 150 && altura_interessado_cm <= 160 ) {
        selectedQuadro = 14;
    }
    else if (altura_interessado_cm > 160 && altura_interessado_cm <= 170 ) {
        selectedQuadro = 16;
    }
    else if ( altura_interessado_cm > 170 ) {
        selectedQuadro = 17;
    } else {
        return null;
    }
    return selectedQuadro
}
