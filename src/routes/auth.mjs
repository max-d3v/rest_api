import { Router } from "express";
import passport from "passport";
const router = Router();

//Auth login route
router.post('/auth', (req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
        if (err) { 
            return next(err); 
        }
        if (!user) { 
            return res.status(401).json(info); 
        }
        req.logIn(user, function(err) {
            if (err) { 
                return next(err); 
            }
            return res.status(200).json({ sessionID: req.sessionID, cookie: req.session.cookie});
        });
    })(req, res, next); // Adicione isto
});


// ----------------------------

export default router
 