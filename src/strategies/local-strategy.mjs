import passport from "passport";
import { Strategy } from 'passport-local';



// passport local login strategy
passport.serializeUser((user, done) => {
    if (!user) {
        done(new Error("User not provided"), null);
    } else if (!user.id) {
        done(new Error("User ID not provided"), null);
    } else {
        done(null, user);
    }});


passport.deserializeUser((user, done) => {
    done(null, user) 
})




export default passport.use(
    new Strategy({ usernameField: "name", passwordField: "senha" }, async (username, password, done) => {
        var success = true;
        const userData = {id: 1, username: "jon", password: "doe"}
        //Login Logic
        if (success) {
            done(null, userData)
        }
        if (!success) {
            done(null, false, { message: 'Incorrect login' });
        }
        // ------------------------------
    })
)
// ------------------------------