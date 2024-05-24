import passport from "passport";
import { Strategy } from 'passport-local';
import { db } from "../db/db.mjs";
import { queryDb, hashSenha } from "../utils/helpers.mjs";
import bcrypt from  'bcrypt'
// passport local login strategy
passport.serializeUser((user, done) => {
    if (!user) {
        done(new Error("User not provided"), null);
    } else {
        done(null, user);
    }});


passport.deserializeUser((user, done) => {
    done(null, user) 
})




export default passport.use(
    new Strategy({ usernameField: "usuario", passwordField: "senha" }, async (username, password, done) => {
        //Login Logic
        const query = "SELECT * FROM usuarios WHERE usuario = ?";
        const response = await queryDb(query, [username]);
        if (!response) {
            return done(null, false, 'Credencias inválidas!');
        }
        if (response.length == 0) {
            return done(null, false, 'Credencias inválidas!');    
        }

        const responseObj = response[0];

        const senhaHashed = hashSenha(password);
        const senhasCoincidem = await bcrypt.compare(password, responseObj.senha);

        if (senhasCoincidem) {
            const userObj = {
                nome: responseObj.nome,
                tipo: responseObj.tipo
            }

            done(null, userObj);
            return
        }

        done(null, false, 'Credencias inválidas!');    
        return        
    })
)
