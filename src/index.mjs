import express from 'express';
import routerIndex from './routes/index.mjs';
import session from 'express-session';
import passport from "passport";
import jsonwebtoken from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

//const mode = "tst";
const mode ="dev";




export const app = express();
const PORT = 3001;


app.use(express.json())
app.use(session({
    secret: 'secret',
    saveUninitialized: false, 
    resave: true,
}))


app.use((req, res, next) => {
    const token = req.headers.authorization;
    const tokenData = jsonwebtoken.verify(token, process.env.TOKEN_SECRET)
    if (tokenData.id == process.env.TOKEN_ID) {
        next();
    }
    return;
})


app.get("/api/v1/status", (req, res) => {
    res.status(200).send({"status": "success", "msg": "Ok sistems"})
})
app.use('/api/v1', routerIndex)

app.use((err, req, res, next) => {
    if (err) {
        if ( mode == "dev" ) {
            console.error(err);
        }
        res.status(500).send({"error": err});
    } else {
        next();
    }
});

if (mode == "dev") {
    app.listen(PORT, () => {
        console.log('running on port ' + PORT);
    });    
}
