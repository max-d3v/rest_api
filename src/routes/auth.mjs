import { Router } from "express";
import jsonwebtoken from "jsonwebtoken";
import jwt from "jsonwebtoken";
import env from "dotenv";
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const token = jwt.sign({ id: process.env.TOKEN_ID }, process.env.TOKEN_SECRET ); 

//Auth login route
router.get('/status', (req, res, next) => {
    const token = req.headers.authorization;
    const tokenData = jsonwebtoken.verify(token, process.env.TOKEN_SECRET)
    return res.status(200).send({status: true, data: {tokenId: tokenData.id}});
});     




// ----------------------------

export default router
 