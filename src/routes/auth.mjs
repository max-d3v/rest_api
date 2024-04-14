import { Router } from "express";
import passport from "passport";
const router = Router();

//Auth login route
router.post('/auth', (req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
        if (err) { 
            return res.sendStatus(500); 
        }
        req.logIn(user, function(err) {
            if (err) { 
                return next(err); 
            }
            return res.status(200).send({status: "success", msg: "User authenticated", user: user});
        });
    })(req, res, next); // Adicione isto
});


// ----------------------------

export default router
 