import { Router } from "express";
import passport from "passport";
const router = Router();

//Auth login route
router.post('/auth/login', (req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
        if (err) { 
            return next(err); 
        }
        if (!user) { 
            return res.status(200).send({status: "error", message: info}); 
        }
        req.logIn(user, function(err) {
            if (err) { 
                return next(err); 
            }
            return res.status(200).send({ status: "success", data: req.sessionID });
        });
    })(req, res, next); // Adicione isto
});     


// ----------------------------

export default router
 