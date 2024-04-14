import express from 'express';
import routerIndex from './routes/index.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from "passport";
import './strategies/local-strategy.mjs';
import { handleError } from './utils/helpers.mjs';
import mysql from 'mysql2/promise';




//CREATE SWAGGER CONFIG:
//const require = createRequire(import.meta.url); // Cria uma instância de require
//const swaggerDocs = require('./swagger.json');
// ------------------------------






//Mysql store for sessions: 
const MySQLStoreFactory = await import('express-mysql-session');
const MySQLStore = MySQLStoreFactory.default(session);
const mysqlStoreOptions = {
    ttl: 60000 * 30,
    expiration: 60000 * 30
}



const dbConnection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "lar_renascer"
});


const sessionStore = new MySQLStore(mysqlStoreOptions, dbConnection);
// ------------------------------









//App creation, port definition and essential middlewares:
const app = express();
const PORT = 3001;

app.use(cookieParser('key'))
app.use(express.json())
app.use(session({
    secret: 'secret',
    saveUninitialized: false, 
    resave: true,
    cookie: {
        maxAge: 60000 * 30
    },
    store:  sessionStore
}))

app.use(passport.initialize());
app.use(passport.session());
// ------------------------------





//Router initialization and status endpoint
app.get("/api/v1/status", (req, res) => {
    res.status(200).send({"status": "success", "msg": "Ok sistems"})
})
app.use('/api/v1', routerIndex)
// ------------------------------





//Error handling middleware
app.use((err, req, res, next) => {
    if (err) {
        var errorMsg;
        if (err !== 'Error') {
            errorMsg = err.message;
        }

        console.error(err.stack); // Log do detalhe do erro
        handleError(res, errorMsg, 500);
    } else {
        next();
    }
});
// ------------------------------





//app initialization, running on port defined
app.listen(PORT, () => {
    console.log('running');
})
// ------------------------------