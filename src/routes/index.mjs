import { Router } from "express";
import bicicletaRouter from "./bicicleta.mjs";
import authRouter from "./auth.mjs";
import escolhaRouter from "./escolha.mjs";
import interessadoRouter from "./interessado.mjs";

const router = Router();

//Router initialization
router.use("/bicicleta", bicicletaRouter);
router.use("/escolha", escolhaRouter);
router.use("/interessado", interessadoRouter);
router.use("/auth",authRouter);
// ----------------------------


export default router