import {Router} from "express";
import { checkSchema } from "express-validator";
import { matchedData,validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import { CreateEscolhaValidation, alterEscolhaValidation } from "../utils/validationSchemas.mjs";
import { FindQuadroBicicleta } from "../utils/helpers.mjs";

const prisma = new PrismaClient();
const router = Router();


router.get('/todas', async (req, res) => {
    const response = await prisma.escolha.findMany()
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
        const response = await prisma.escolha.findUnique({
            where: {
                codigo_escolha: parseInt(id)
            }
        })
        if (response == null) {
            res.status(404).send({"error": "Escolha not found"})
            return;
        }
        res.status(200).send({data: response});
    }
    catch (err) {
        res.status(500).send({"error": err})
    }
});




router.post('/', checkSchema(CreateEscolhaValidation),  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        console.log("passou aqui");
        return res.status(400).send({"error": result.array()});
    }
    const data = matchedData(req);
    const { codigo_interessado } = data;

    try {
    const interessado = await prisma.interessado.findUnique({
        where: {
            codigo_interessado: codigo_interessado
        }
    })

    if (!interessado) {
        return res.status(404).send({"error": "Interessado not found"});
    }

    const { altura_interessado_cm } = interessado;
    if (!altura_interessado_cm) {
        return res.status(400).send({"error": "Altura do interessado não informada"});
    }
    const selectedQuadro = FindQuadroBicicleta(altura_interessado_cm)

    if (!selectedQuadro) {
        return res.status(400).send({"error": "Erro ao calcular altura do quadro"});
    }

    const bicicletas = await prisma.bicicleta.findMany({
        where: {
            quadro_bicicleta: selectedQuadro
        }
    })
    if (bicicletas.length == 0) {
        return res.status(404).send({"error": "Bicicleta com aro desejado não encontrada"});
    }

    var codigos = [];
    bicicletas.forEach(bicicleta => {
        codigos.push(bicicleta.codigo_bicicleta);
    });
    
    var escolha = await prisma.escolha.create({
        data: {
            codigos_bicicletas: codigos,
            codigo_interessado,
        }
    })
    res.status(201).send({"data": escolha});
    }
    catch(err) {
        console.log(err)
        res.status(500).send({"error": err});
    }
});


router.patch("/:id", checkSchema(alterEscolhaValidation), async (req, res) => {
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
    const { codigo_interessado } = data;
    if (!codigo_interessado) {
        res.status(400).send({"error": "Invalid data"});
        return;
    }
    try {
        const escolha = await prisma.escolha.findUnique({
            where: {
                codigo_escolha: parseInt(id)
            }
        });
        if (!escolha) {
            res.status(404).send({"error": "Escolha not found"});
            return;
        }

        const interessado = await prisma.interessado.findUnique({
            where: {
                codigo_interessado: escolha.codigo_interessado
            }
        });
        if (!interessado) {
            res.status(404).send({"error": "Interessado not found"});
            return;
        }
        const { altura_interessado_cm } = interessado;
        var selectedQuadro = FindQuadroBicicleta(altura_interessado_cm);

        const bicicletas = await prisma.bicicleta.findMany({
            where: {
                quadro_bicicleta: selectedQuadro
            }
        });
        if (bicicletas.length == 0) {
            res.status(404).send({"error": "Bicicleta not found"});
            return;
        }
        var codigos = [];
        bicicletas.forEach(bicicleta => {
            codigos.push(bicicleta.codigo_bicicleta);
        });


        const escolhaUpdated = await prisma.escolha.update({
            where: {
                codigo_escolha: parseInt(id)
            },
            data: {
                codigo_interessado,
                codigos_bicicletas: codigos
            }
        });

        res.status(200).send({"data": escolhaUpdated});
    }
    catch(err) {
        console.log(err)
        res.status(500).send({"error": err});
    }
});


router.delete("/:id", async (req, res) => {
    const {id} = req.params;
    if (!id || isNaN(id)) {
        res.status(400).send({"error": "Invalid ID"});
        return;
    }
    try {
        const escolha = await prisma.escolha.findUnique({
            where: {
                codigo_escolha: parseInt(id)
            }
        });
        if (!escolha) {
            res.status(404).send({"error": "Escolha not found"});
            return;
        }
        await prisma.escolha.delete({
            where: {
                codigo_escolha: parseInt(id)
            }
        });
        res.status(204).send();
    }
    catch(err) {
        res.status(500).send({"error": err});
    }
})








export default router