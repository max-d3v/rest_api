import { Router } from "express";
import { checkSchema } from "express-validator";
import { CreateInteressadoValidation } from "../utils/validationSchemas.mjs";
import { matchedData,validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();
const router = Router();


router.get('/todos', async (req, res) => {
    const response = await prisma.interessado.findMany()
    try {
        res.status(200).send(response);
    }
    catch (err) {
        res.status(500).send({"error": err})
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        res.status(400).send({"error": "Invalid ID"});
        return;
    }

    try {
        const response = await prisma.interessado.findUnique({
            where: {
                codigo_interessado: parseInt(id)
            }
        })
        if (response == null) {
            res.status(404).send({"error": "Interessado not found"})
            return;
        }
        res.status(200).send({data: response});
    }
    catch (err) {
        res.status(500).send({"error": err})
    }
});

router.post('/', checkSchema(CreateInteressadoValidation),  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        console.log("passou aqui");
        return res.status(400).send({"error": result.array()});
    }
    const data = matchedData(req);
    const { nome_interessado, email_interessado, fone_interessado, altura_interessado_cm } = data;

    try {
        const interessado = await prisma.interessado.create({
            data: {
                nome_interessado,
                email_interessado,
                fone_interessado,
                altura_interessado_cm
            }
        })

        res.status(201).send({"data": interessado});
    }
    catch(err) {
        res.status(500).send({"error": err});
    }
})



export default router