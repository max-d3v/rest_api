import { Router } from "express";
import { checkSchema } from "express-validator";
import { CreateBicicletaValidation, AlterBicicletaValidation } from "../utils/validationSchemas.mjs";
import { matchedData,validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();
const router = Router();


router.get('/todas', async (req, res) => {
    const response = await prisma.bicicleta.findMany()
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
        const response = await prisma.bicicleta.findUnique({
            where: {
                codigo_bicicleta: parseInt(id)
            }
        })
        if (response == null) {
            res.status(404).send({"error": "Bicicleta not found"})
            return;
        }
        res.status(200).send({data: response});
    }
    catch (err) {
        res.status(500).send({"error": err})
    }
});

router.get("/quadro/:tamanho", async (req, res) => {
    const { tamanho } = req.params;
    if (!tamanho || isNaN(tamanho)) {
        res.status(400).send({"error": "Invalid tamanho"});
        return;
    }

    try {
        const response = await prisma.bicicleta.findMany({
            where: {
                quadro_bicicleta: parseInt(tamanho)
            }
        })
        if (!response) {
            res.status(404).send({"error": "Bicicleta not found"})
            return;
        }
        res.status(200).send({data: response});
    }
    catch (err) {
        res.status(500).send({"error": err})
    }
});

router.get("/interessado/:id", async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        res.status(400).send({"error": "Invalid ID"});
        return;
    }

    try {
        const escolhas = await prisma.escolha.findMany({
            where: {
                codigo_interessado: parseInt(id)
            },
            select: {
                codigos_bicicletas: true
            }
        });

        if (!escolhas) {
            res.status(404).send({"error": "Bicicleta not found"})
            return;
        }
        
        var bicicletas = [];
        for (const escolha of escolhas) {
            var codigos = escolha.codigos_bicicletas;
            console.log("codigos: ");
            console.log(codigos);
        
            for (const codigo of codigos) {
                const bicicleta = await prisma.bicicleta.findUnique({
                    where: {
                        codigo_bicicleta: codigo
                    }
                });
        
                if (!bicicleta) {
                    res.status(404).send({"error": "Código de bicicleta na escolha não existe!"});
                    return;
                }
                //checar se a mesma bicicleta ja esta presente no array:
                const checaBicicleta = bicicletas.find(bicicletaDoArray => bicicletaDoArray.codigo_bicicleta == bicicleta.codigo_bicicleta); 
                if (!checaBicicleta) {
                    bicicletas.push(bicicleta);
                }
            }
        }
        console.log(bicicletas)
        res.status(200).send({data: bicicletas});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({"error": err})
    }
})




router.patch("/:id", checkSchema(AlterBicicletaValidation), async (req, res) => {
    const {id} = req.params;
    if (!id || isNaN(id)) {
        res.status(400).send({"error": "Invalid ID"});
        return;
    }
    const result = validationResult(req);
    if (!result.isEmpty()) {
        console.log("passou aqui");
        return res.status(400).send({"error": result.array()});
    }
    const data = matchedData(req);
    const { quadro_bicicleta, cor_bicicleta } = data;

    try {
        const bicicleta = await prisma.bicicleta.findUnique({
            where: {
                codigo_bicicleta: parseInt(id)
            }
        })
        if (!bicicleta) {
            res.status(404).send({"error": "Bicicleta not found"});
            return;
        }

        const bicicletaUpdated = await prisma.bicicleta.update({
            where: {
                codigo_bicicleta: parseInt(id)
            },
            data: {
                quadro_bicicleta,
                cor_bicicleta
            }
        });

        res.status(200).send({"data": bicicletaUpdated});
    }
    catch(err) {
        res.status(500).send({"error": err});
    }
})


router.post('', checkSchema(CreateBicicletaValidation),  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        console.log("passou aqui");
        return res.status(400).send({"error": result.array()});
    }
    const data = matchedData(req);
    const { quadro_bicicleta, cor_bicicleta } = data;

    try {
        const bicicleta = await prisma.bicicleta.create({
            data: {
                quadro_bicicleta,
                cor_bicicleta
            }
        })

        res.status(201).send({"data": bicicleta});
    }
    catch(err) {
        res.status(500).send({"error": err});
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        res.status(400).send({"error": "Invalid ID"});
        return;
    }

    try {
        const response = await prisma.bicicleta.delete({
            where: {
                codigo_bicicleta: parseInt(id)
            }
        })
        if (!response) {
            res.status(404).send({"error": "Bicicleta not found"})
            return;
        }
        res.status(200).send({data: response});
    }
    catch (err) {
        res.status(500).send({"error": err})
    }
})



export default router