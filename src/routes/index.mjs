import { Router } from "express";
import exampleRouter from "./example.mjs";
import authRouter from "./auth.mjs";



const router = Router();

//Router initialization
router.use(exampleRouter);
router.use(authRouter);
// ----------------------------


export default router